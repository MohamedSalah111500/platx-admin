# PlatX CRM Module (Admin)

Standalone CRM inside `platx-admin` for tracking prospects (WhatsApp / social / website leads) with multi-agent support.
Backend lives in `portal-backend/Platx` (`CrmController`, `CrmService`, `CrmLead` / `CrmActivity` entities).

## What it does

| Page | Route | Who |
|------|-------|-----|
| Leads | `/crm/leads` | Owner + agents |
| Lead details (timeline) | `/crm/leads/:id` | Owner + agents |
| Pipeline board | `/crm/pipeline` | Owner + agents |
| Team (agents) | `/crm/team` | Owner (SuperAdmin) only |

- **Leads list**: KPI cards (all / new / overdue / due today / won / unassigned), search + filters (status, follow-up, source, priority, agent), inline status change, inline re-assign (owner), WhatsApp deep link (`wa.me`), pagination.
- **Import from WhatsApp**: paste `name, phone` lines (any order, comma/semicolon/tab/`|`), preview + edit, duplicates by phone are skipped server-side (max 500 rows per import).
- **Lead details**: contact card, ownership & follow-up, one-click status strip, activity log (note / call / WhatsApp / meeting / email / follow-up) with automatic *last contacted* + *New → Contacted*, timeline of every change (status + assignment are logged automatically).
- **Pipeline**: Kanban-style columns by stage (Won/Lost hidden by default), "Move to…" per card.
- **Team**: create agent accounts (role `CrmAgent`), edit name, activate/deactivate (lockout), reset password, per-agent lead counts.

## Roles & data scoping (enforced in the backend query layer)

- `SuperAdmin` (owner): sees everything, can assign, delete leads, manage agents.
- `CrmAgent`: sees only leads **assigned to them or created by them**; cannot delete or reassign; new leads are auto-assigned to themselves.
- Agents log into the same admin panel with their email + password; the sidebar only shows the CRM section for them and login lands on `/crm/leads`.

## Backend

- Entities: `CrmLead` (name, phone, normalized phone for duplicate detection, email, organization, country/city, source, status, priority, interested plan, notes, assignee, creator, last contacted, next follow-up, lost reason) and `CrmActivity` (type, content, author).
- Enums: `CrmLeadStatus` (New → Contacted → Interested → DemoScheduled → Negotiation → Won / Lost), `CrmLeadSource`, `CrmLeadPriority`, `CrmActivityType`, `CrmFollowUpFilter`.
- Endpoints (`api/Crm`): `GET/POST leads`, `GET/PUT/DELETE leads/{id}`, `PATCH leads/{id}/status`, `PATCH leads/{id}/assign`, `POST leads/import`, `GET/POST leads/{id}/activities`, `GET stats`, `GET pipeline`, `GET/POST agents`, `PUT agents/{id}`, `POST agents/{id}/reset-password`.
- Migration `AddCrmModule` (tables `CrmLeads`, `CrmActivities`) is applied automatically on API startup.
- The `CrmAgent` role is created on demand the first time an agent is added.
- All validation messages are localized (`SharedResources.resx` / `.ar.resx`, keys prefixed `Crm`).

## Pulling existing WhatsApp customers (scripts in `tools/`)

WhatsApp Desktop's own databases (`LocalState\sessions\...\*.db`) are **encrypted**, but the app renders WhatsApp Web in a WebView whose IndexedDB is not — the contact records live there in the clear.

1. **Contacts, no QR, straight off this machine:** `python tools/extract_whatsapp_desktop.py` → `whatsapp_contacts.csv` (Name, Phone). It copies the IndexedDB files to a temp folder and walks the V8-serialized records, so the running app is never touched. Message *bodies* are not persisted there, so this gives names and numbers only — every lead lands as **New**.
2. **Chats too (needed for the stage of each conversation):** `cd tools && npm install && npm run dump` → scan the QR once (phone → Linked devices). It walks every individual chat and writes `whatsapp_contacts.csv` plus `whatsapp_dump.json` (last 80 messages per chat, `WA_MESSAGES_PER_CHAT` to change). The session is kept in `tools/.wa-session` so re-runs need no QR.
3. To get **where each conversation stands** (converting / bought / not interested):
   - `pip install anthropic` and set `ANTHROPIC_API_KEY`.
   - `python classify_whatsapp_chats.py --dump whatsapp_dump.json` (`--dry-run` lists what was detected without calling the API; `--chats <folder>` also accepts manual "Export chat" .txt files).
   - Output `whatsapp_leads_classified.csv` with `Name, Phone, Status, Priority, Notes` (Arabic summary + next step). Results are cached in `whatsapp_classify_cache.json`, so re-runs only classify new chats.
4. Paste the CSV (including the header line) into **CRM → Leads → Import from WhatsApp** — the importer recognises the header, shows the stage per row (editable), and creates the leads with that status.

Everything these scripts produce (`*.csv`, `whatsapp_dump.json`, `.wa-session/`, `node_modules/`) is git-ignored — customer data never gets committed.

## Duplicate protection

Phone numbers are normalized before storage (digits only, leading `00` and the trunk `0` removed), and two numbers count as the same customer when one is the tail of the other — so `01111111111`, `0201111111111`, `+20 111 111 1111` and `0020-111-111-1111` all resolve to one lead, while numbers that merely share a tail across country codes stay separate. This is enforced on create, edit and import.

## Tests

`PlatX.OfflineContent.Tests/CrmImportTests.cs` covers the import path end to end against a real SQL Server database (a throwaway `PlatXCrmTest_*` DB on `.\SQLEXPRESS`, created and dropped per run): rows are stored with their stage, duplicates and invalid rows are skipped, search/stats/pipeline read the data back, activities move a lead to Contacted, and an agent can neither see, delete nor reassign someone else's leads.

```
dotnet test PlatX.OfflineContent.Tests/PlatX.OfflineContent.Tests.csproj --filter CrmImportTests
```

## First-time setup

1. Run the backend once (migration auto-applies).
2. Log in to the admin as the owner → **CRM → Team → Add agent** for each employee.
3. Each employee logs in with their email/password and starts adding leads (or use **Import from WhatsApp**).
