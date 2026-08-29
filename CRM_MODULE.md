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

## First-time setup

1. Run the backend once (migration auto-applies).
2. Log in to the admin as the owner → **CRM → Team → Add agent** for each employee.
3. Each employee logs in with their email/password and starts adding leads (or use **Import from WhatsApp**).
