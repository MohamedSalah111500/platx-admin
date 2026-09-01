import argparse
import csv
import glob
import json
import os
import re
import shutil
import sqlite3
import sys
import tempfile
import time

STATUSES = ["New", "Contacted", "Interested", "DemoScheduled", "Negotiation", "Won", "Lost"]
PRIORITIES = ["Low", "Medium", "High"]

SESSION_ROOT = os.path.join(
    os.environ.get("LOCALAPPDATA", ""),
    "Packages",
    "5319275A.WhatsAppDesktop_cv1g1gvanyjgm",
    "LocalState",
    "sessions",
)

LINE_PATTERNS = [
    re.compile(r"^\[?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),? (\d{1,2}:\d{2}(?::\d{2})?(?: ?[APap][Mm])?)\]? ?[-–]? ?([^:]{1,80}?): (.*)$"),
]

SYSTEM_PROMPT = """You classify WhatsApp sales conversations for PlatX, a SaaS platform for teachers and academies
(online courses, exams, live classes, student management). One side is the PlatX sales team, the other is a prospect.
Return ONLY a JSON object with these keys:
- "status": one of New, Contacted, Interested, DemoScheduled, Negotiation, Won, Lost
   New = prospect wrote but got no real reply yet; Contacted = we replied, no clear interest yet;
   Interested = asked about features/pricing positively; DemoScheduled = demo/trial/meeting agreed;
   Negotiation = discussing price, plan, payment or discount; Won = paid/subscribed/platform created;
   Lost = said no, not interested, unresponsive after several follow-ups, or clearly not a fit.
- "priority": Low, Medium or High (High = close to buying or big academy; Low = cold or not a fit)
- "summary": one Arabic sentence (max 25 words) saying who they are and where the conversation stands
- "next_action": one short Arabic sentence with the recommended next step (or "لا يوجد" if closed)
No markdown, no explanation, JSON only."""


def normalize_name(value):
    return re.sub(r"[\s‎‏‪-‮]+", " ", (value or "")).strip().lower()


def phone_digits(value):
    digits = re.sub(r"\D", "", value or "")
    return digits[2:] if digits.startswith("00") else digits


def looks_like_phone(value):
    return 7 <= len(phone_digits(value)) <= 15 and re.fullmatch(r"[\d\s()+\-.‎‏]+", value or "") is not None


def parse_export_file(path):
    messages = []
    with open(path, encoding="utf-8-sig", errors="ignore") as f:
        for raw in f:
            line = raw.rstrip("\n").replace("‎", "").replace("‏", "").strip()
            if not line:
                continue
            matched = None
            for pattern in LINE_PATTERNS:
                m = pattern.match(line)
                if m:
                    matched = m
                    break
            if matched:
                messages.append({"date": matched.group(1), "sender": matched.group(3).strip(), "text": matched.group(4).strip()})
            elif messages:
                messages[-1]["text"] += "\n" + line
    return messages


def contact_from_filename(path):
    base = os.path.splitext(os.path.basename(path))[0]
    for prefix in ["WhatsApp Chat with ", "WhatsApp Chat - ", "دردشة واتساب مع ", "محادثة واتساب مع "]:
        if base.startswith(prefix):
            return base[len(prefix):].strip()
    return base.strip()


def load_contacts_csv(path):
    mapping = {}
    if not path or not os.path.exists(path):
        return mapping
    with open(path, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            name = normalize_name(row.get("Name") or row.get("name"))
            phone = phone_digits(row.get("Phone") or row.get("phone"))
            if name and phone:
                mapping.setdefault(name, phone)
    return mapping


def chats_from_exports(folder, contacts):
    chats = []
    for path in sorted(glob.glob(os.path.join(folder, "**", "*.txt"), recursive=True)):
        messages = parse_export_file(path)
        if not messages:
            continue
        contact = contact_from_filename(path)
        phone = phone_digits(contact) if looks_like_phone(contact) else contacts.get(normalize_name(contact), "")
        senders = {}
        for m in messages:
            senders[m["sender"]] = senders.get(m["sender"], 0) + 1
        chats.append({"name": contact, "phone": phone, "messages": messages, "senders": senders, "source": os.path.basename(path)})
    return chats


def chats_from_db(contacts):
    chats = {}
    if not os.path.isdir(SESSION_ROOT):
        return []
    text_cols = ["text", "body", "content", "message", "data", "caption"]
    jid_cols = ["chatjid", "chat_jid", "jid", "remotejid", "remote_jid", "chatid", "chat_id", "keyremotejid"]
    from_cols = ["fromme", "from_me", "isfromme", "is_from_me", "keyfromme", "sentbyme"]
    with tempfile.TemporaryDirectory() as work:
        for session in glob.glob(os.path.join(SESSION_ROOT, "*")):
            for db_path in glob.glob(os.path.join(session, "*.db")):
                base = os.path.basename(db_path)
                for suffix in ["", "-wal", "-shm"]:
                    if os.path.exists(db_path + suffix):
                        shutil.copy2(db_path + suffix, os.path.join(work, base + suffix))
                try:
                    con = sqlite3.connect(f"file:{os.path.join(work, base)}?mode=ro", uri=True)
                    con.row_factory = sqlite3.Row
                    for (table,) in con.execute("select name from sqlite_master where type='table'").fetchall():
                        cols = {r[1].lower(): r[1] for r in con.execute(f'pragma table_info("{table}")')}
                        tcol = next((cols[c] for c in text_cols if c in cols), None)
                        jcol = next((cols[c] for c in jid_cols if c in cols), None)
                        fcol = next((cols[c] for c in from_cols if c in cols), None)
                        if not tcol or not jcol:
                            continue
                        for row in con.execute(f'select * from "{table}"'):
                            jid = str(row[jcol] or "")
                            if "@g.us" in jid or "@broadcast" in jid or not row[tcol]:
                                continue
                            phone = phone_digits(jid.split("@")[0])
                            if len(phone) < 7:
                                continue
                            sender = "PlatX" if (fcol and row[fcol]) else "Customer"
                            chats.setdefault(phone, []).append({"date": "", "sender": sender, "text": str(row[tcol])})
                    con.close()
                except sqlite3.Error:
                    continue
    by_phone = {v: k for k, v in contacts.items()}
    return [
        {"name": by_phone.get(phone, "+" + phone), "phone": phone, "messages": msgs, "senders": {"PlatX": 1, "Customer": 1}, "source": "whatsapp-db"}
        for phone, msgs in chats.items()
    ]


def chats_from_dump(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    chats = []
    for entry in data:
        messages = [
            {"date": (m.get("date") or "")[:16].replace("T", " "), "sender": "PlatX" if m.get("fromMe") else "Customer", "text": m.get("text", "")}
            for m in entry.get("messages", [])
            if m.get("text")
        ]
        if not messages:
            continue
        chats.append({
            "name": entry.get("name") or "+" + entry.get("phone", ""),
            "phone": phone_digits(entry.get("phone", "")),
            "messages": messages,
            "senders": {"PlatX": 1, "Customer": 1},
            "source": "whatsapp-web",
        })
    return chats


def build_transcript(chat, me, max_messages=80, max_chars=7000):
    messages = chat["messages"][-max_messages:]
    lines = []
    for m in messages:
        sender = m["sender"]
        if me and normalize_name(sender) == normalize_name(me):
            sender = "PlatX"
        elif sender == "PlatX" or sender == "Customer":
            pass
        elif normalize_name(sender) == normalize_name(chat["name"]):
            sender = "Customer"
        lines.append(f"[{m['date']}] {sender}: {m['text']}" if m["date"] else f"{sender}: {m['text']}")
    transcript = "\n".join(lines)
    return transcript[-max_chars:]


def classify(client, model, chat, me):
    transcript = build_transcript(chat, me)
    prompt = f"Prospect display name: {chat['name']}\nTotal messages: {len(chat['messages'])}\n\nConversation (oldest first):\n{transcript}"
    for attempt in range(4):
        try:
            response = client.messages.create(
                model=model,
                max_tokens=400,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt}],
            )
            text = "".join(block.text for block in response.content if getattr(block, "type", "") == "text").strip()
            text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.MULTILINE).strip()
            data = json.loads(text)
            status = data.get("status") if data.get("status") in STATUSES else "Contacted"
            priority = data.get("priority") if data.get("priority") in PRIORITIES else "Medium"
            return {
                "status": status,
                "priority": priority,
                "summary": (data.get("summary") or "").strip(),
                "next_action": (data.get("next_action") or "").strip(),
            }
        except Exception as e:
            wait = 3 * (attempt + 1)
            print(f"   retry in {wait}s ({e})")
            time.sleep(wait)
    return {"status": "Contacted", "priority": "Medium", "summary": "", "next_action": ""}


def main():
    parser = argparse.ArgumentParser(description="Classify WhatsApp chats into CRM stages and export a CSV for the CRM importer.")
    parser.add_argument("--dump", help="whatsapp_dump.json produced by dump_whatsapp_web.js")
    parser.add_argument("--chats", help="Folder containing WhatsApp 'Export chat' .txt files")
    parser.add_argument("--db", action="store_true", help="Also try to read chats directly from the WhatsApp Desktop databases")
    parser.add_argument("--contacts", default="whatsapp_contacts.csv", help="CSV from export_whatsapp_contacts.py (name -> phone)")
    parser.add_argument("--me", default="", help="Your display name inside the exported chats (the PlatX side)")
    parser.add_argument("--model", default="claude-sonnet-5")
    parser.add_argument("--out", default="whatsapp_leads_classified.csv")
    parser.add_argument("--cache", default="whatsapp_classify_cache.json")
    parser.add_argument("--dry-run", action="store_true", help="List detected chats without calling the API")
    args = parser.parse_args()

    contacts = load_contacts_csv(args.contacts)
    chats = []
    if args.dump:
        chats += chats_from_dump(args.dump)
    if args.chats:
        chats += chats_from_exports(args.chats, contacts)
    if args.db:
        chats += chats_from_db(contacts)
    if not chats:
        print("No chats found. Run dump_whatsapp_web.js first and pass --dump whatsapp_dump.json, or export chats (chat menu -> More -> Export chat) into a folder and pass --chats <folder>.")
        return 1

    seen = set()
    unique = []
    for chat in chats:
        key = chat["phone"] or normalize_name(chat["name"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(chat)
    chats = unique

    print(f"Found {len(chats)} chats ({sum(1 for c in chats if c['phone'])} with a phone number).")
    if args.dry_run:
        for c in chats:
            print(f" - {c['name']} | +{c['phone'] or '?'} | {len(c['messages'])} messages | senders: {', '.join(c['senders'])}")
        return 0

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Set ANTHROPIC_API_KEY first (setx ANTHROPIC_API_KEY sk-ant-...).")
        return 1
    try:
        import anthropic
    except ImportError:
        print("Run: pip install anthropic")
        return 1

    client = anthropic.Anthropic()
    cache = {}
    if os.path.exists(args.cache):
        with open(args.cache, encoding="utf-8") as f:
            cache = json.load(f)

    rows = []
    for index, chat in enumerate(chats, 1):
        key = f"{chat['phone'] or chat['name']}|{len(chat['messages'])}"
        if key in cache:
            result = cache[key]
        else:
            print(f"[{index}/{len(chats)}] {chat['name']} ({len(chat['messages'])} messages)...")
            result = classify(client, args.model, chat, args.me)
            cache[key] = result
            with open(args.cache, "w", encoding="utf-8") as f:
                json.dump(cache, f, ensure_ascii=False, indent=1)
        notes = result["summary"]
        if result["next_action"] and result["next_action"] != "لا يوجد":
            notes = f"{notes} | الخطوة التالية: {result['next_action']}"
        rows.append([chat["name"], ("+" + chat["phone"]) if chat["phone"] else "", result["status"], result["priority"], notes])

    with open(args.out, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Phone", "Status", "Priority", "Notes"])
        writer.writerows(rows)

    counts = {}
    for r in rows:
        counts[r[2]] = counts.get(r[2], 0) + 1
    missing = sum(1 for r in rows if not r[1])
    print(f"\nExported {len(rows)} leads -> {args.out}")
    print("By stage: " + ", ".join(f"{k}: {v}" for k, v in sorted(counts.items(), key=lambda kv: STATUSES.index(kv[0]))))
    if missing:
        print(f"{missing} chats have no phone number (fill the Phone column before importing).")
    print("Paste the CSV content (with the header line) into CRM -> Leads -> Import from WhatsApp.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
