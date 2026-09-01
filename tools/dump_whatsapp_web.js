const fs = require("fs");
const path = require("path");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const QRCode = require("qrcode");

const MESSAGES_PER_CHAT = Number(process.env.WA_MESSAGES_PER_CHAT || 80);
const OUT_DIR = process.argv[2] || process.cwd();

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: path.join(OUT_DIR, ".wa-session") }),
  puppeteer: { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] },
});

client.on("qr", (qr) => {
  console.log("Scan this QR with WhatsApp on your phone (Linked devices):");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => console.log("Authenticated."));
client.on("auth_failure", (msg) => {
  console.error("Authentication failed:", msg);
  process.exit(1);
});

client.on("ready", async () => {
  console.log("Connected. Loading chats...");
  const chats = await client.getChats();
  const personal = chats.filter((c) => !c.isGroup && c.id.server === "c.us");
  console.log(`${personal.length} individual chats found.`);

  const dump = [];
  const contactsRows = [["Name", "Phone"]];

  for (let i = 0; i < personal.length; i++) {
    const chat = personal[i];
    const phone = chat.id.user;
    let name = chat.name || "";
    try {
      const contact = await chat.getContact();
      name = contact.name || contact.pushname || contact.shortName || name;
    } catch {}
    name = (name || "").trim();

    let messages = [];
    try {
      const fetched = await chat.fetchMessages({ limit: MESSAGES_PER_CHAT });
      messages = fetched
        .filter((m) => m.body && m.body.trim())
        .map((m) => ({
          date: new Date(m.timestamp * 1000).toISOString(),
          fromMe: !!m.fromMe,
          text: m.body.trim(),
        }));
    } catch (e) {
      console.warn(`  could not fetch messages for ${name || phone}: ${e.message}`);
    }

    dump.push({ name: name || "+" + phone, phone, messages });
    contactsRows.push([name, "+" + phone]);
    if ((i + 1) % 25 === 0 || i === personal.length - 1) {
      console.log(`  ${i + 1}/${personal.length}`);
    }
  }

  const csv = contactsRows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "whatsapp_contacts.csv"), "﻿" + csv, "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "whatsapp_dump.json"), JSON.stringify(dump, null, 1), "utf8");

  console.log(`\nSaved whatsapp_contacts.csv and whatsapp_dump.json in ${OUT_DIR}`);
  console.log("Next: python classify_whatsapp_chats.py --dump whatsapp_dump.json");
  await client.destroy();
  process.exit(0);
});

client.initialize();
