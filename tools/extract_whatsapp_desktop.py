"""Extract WhatsApp contacts (and chat text) straight from the WhatsApp Desktop app data.

The app's own *.db files are encrypted, but it renders WhatsApp Web inside a WebView whose
IndexedDB store is not, so the contact and message records can be read from there directly.
Records are V8-serialized; this walks the raw bytes rather than decoding the whole format.
"""

import argparse
import csv
import glob
import json
import os
import re
import shutil
import sys
import tempfile

PACKAGE = "5319275A.WhatsAppDesktop_cv1g1gvanyjgm"
IDB_RELATIVE = os.path.join(
    "LocalCache", "EBWebView", "Default", "IndexedDB",
    "https_web.whatsapp.com_0.indexeddb.leveldb",
)

ONE_BYTE_STRING = 0x22
TWO_BYTE_STRING = 0x63

JID_RE = re.compile(r"^\d{7,15}@c\.us$")
NAME_FIELDS = [b"name", b"pushname", b"shortName", b"verifiedName", b"formattedName"]


def idb_path():
    local = os.environ.get("LOCALAPPDATA", "")
    return os.path.join(local, "Packages", PACKAGE, IDB_RELATIVE)


def read_varint(data, pos):
    value = 0
    shift = 0
    while pos < len(data):
        byte = data[pos]
        pos += 1
        value |= (byte & 0x7F) << shift
        if not byte & 0x80:
            return value, pos
        shift += 7
        if shift > 35:
            break
    return None, pos


def read_string(data, pos):
    """Reads a V8-serialized string at pos; returns (text, next_pos) or (None, pos)."""
    if pos >= len(data):
        return None, pos
    tag = data[pos]
    length, after = read_varint(data, pos + 1)
    if length is None or length > 4096 or after + length > len(data):
        return None, pos
    raw = data[after:after + length]
    if tag == ONE_BYTE_STRING:
        try:
            return raw.decode("latin-1"), after + length
        except UnicodeDecodeError:
            return None, pos
    if tag == TWO_BYTE_STRING:
        try:
            return raw.decode("utf-16-le"), after + length
        except UnicodeDecodeError:
            return None, pos
    return None, pos


def field_marker(name):
    return bytes([ONE_BYTE_STRING, len(name)]) + name


def clean(text):
    if not text:
        return ""
    text = "".join(ch for ch in text if ch.isprintable()).strip()
    return text if any(ch.isalnum() for ch in text) else ""


def extract_contacts(blob, contacts):
    marker = field_marker(b"phoneNumber")
    for match in re.finditer(re.escape(marker), blob):
        jid, after = read_string(blob, match.end())
        if not jid or not JID_RE.match(jid):
            continue
        phone = jid.split("@")[0]

        window_end = min(len(blob), after + 900)
        next_record = blob.find(field_marker(b"id"), after)
        if next_record != -1:
            window_end = min(window_end, next_record)
        window = blob[after:window_end]

        best = ""
        for field in NAME_FIELDS:
            hit = window.find(field_marker(field))
            if hit == -1:
                continue
            value, _ = read_string(window, hit + len(field_marker(field)))
            value = clean(value)
            if value and not value.replace("+", "").replace(" ", "").isdigit():
                best = value
                break

        existing = contacts.get(phone)
        if existing is None or (not existing and best):
            contacts[phone] = best


def extract_messages(blob, messages, lid_to_phone):
    """Collects message bodies keyed by the LID of the chat they belong to."""
    body_marker = field_marker(b"body")
    for match in re.finditer(re.escape(body_marker), blob):
        text, after = read_string(blob, match.end())
        text = clean(text)
        if not text or len(text) < 2:
            continue
        window = blob[max(0, match.start() - 900):match.start()]
        lids = re.findall(rb"(\d{9,20})@lid", window)
        if not lids:
            continue
        lid = lids[-1].decode()
        phone = lid_to_phone.get(lid)
        if not phone:
            continue
        from_me = b'"\x06fromMe' in window and b'"\x06fromMeT' in window
        messages.setdefault(phone, []).append({"date": "", "fromMe": from_me, "text": text})


def build_lid_map(blobs):
    mapping = {}
    id_marker = field_marker(b"id")
    phone_marker = field_marker(b"phoneNumber")
    for blob in blobs:
        for match in re.finditer(re.escape(phone_marker), blob):
            jid, _ = read_string(blob, match.end())
            if not jid or not JID_RE.match(jid):
                continue
            back = blob[max(0, match.start() - 200):match.start()]
            hit = back.rfind(id_marker)
            if hit == -1:
                continue
            lid_value, _ = read_string(back, hit + len(id_marker))
            if lid_value and lid_value.endswith("@lid"):
                mapping[lid_value.split("@")[0]] = jid.split("@")[0]
    return mapping


def load_blobs(source):
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as work:
        copied = []
        for path in sorted(glob.glob(os.path.join(source, "*"))):
            if not os.path.isfile(path):
                continue
            target = os.path.join(work, os.path.basename(path))
            try:
                shutil.copy2(path, target)
                copied.append(target)
            except OSError:
                continue
        return [open(p, "rb").read() for p in copied]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", default="whatsapp_contacts.csv")
    parser.add_argument("--dump", default="whatsapp_dump.json", help="Also write chat text per contact for the classifier")
    parser.add_argument("--no-messages", action="store_true")
    parser.add_argument("--source", default=idb_path())
    args = parser.parse_args()

    if not os.path.isdir(args.source):
        print("WhatsApp Desktop data not found at:", args.source)
        return 1

    print("Reading", args.source)
    blobs = load_blobs(args.source)
    print(f"{len(blobs)} data files loaded.")

    contacts = {}
    for blob in blobs:
        extract_contacts(blob, contacts)
    print(f"{len(contacts)} contacts found ({sum(1 for n in contacts.values() if n)} with a saved name).")

    with open(args.out, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Phone"])
        for phone, name in sorted(contacts.items(), key=lambda kv: (kv[1] or "~", kv[0])):
            writer.writerow([name, "+" + phone])
    print("Wrote", args.out)

    if args.no_messages:
        return 0

    lid_map = build_lid_map(blobs)
    messages = {}
    for blob in blobs:
        extract_messages(blob, messages, lid_map)

    dump = [
        {"name": contacts.get(phone) or "+" + phone, "phone": phone, "messages": msgs}
        for phone, msgs in messages.items()
    ]
    with open(args.dump, "w", encoding="utf-8") as f:
        json.dump(dump, f, ensure_ascii=False, indent=1)
    print(f"{len(dump)} chats with readable text -> {args.dump}")
    print("Next: python classify_whatsapp_chats.py --dump", args.dump)
    return 0


if __name__ == "__main__":
    sys.exit(main())
