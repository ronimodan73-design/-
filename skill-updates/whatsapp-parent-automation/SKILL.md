---
name: whatsapp-parent-automation
description: Design and help build WhatsApp automation workflows for Roni's school communication (reminders, absence notices, homework/exam alerts, registration confirmations) using Make and Twilio, since there is no native WhatsApp connector. Use whenever Roni asks to automate WhatsApp messages, set up reminders to parents, or build a Make/Twilio scenario involving WhatsApp.
---

# WhatsApp Parent Automation (Make / Twilio)

Helps Roni design and build WhatsApp automation pipelines for school communication. There is no native WhatsApp connector available to Claude directly — every WhatsApp automation goes through **Twilio's WhatsApp Business API**, orchestrated via **Make** only. Roni decided not to use N8N — never suggest it.

## Standard architecture
```
Trigger (Google Sheets row / Form submission / schedule / Calendar event)
   → Make scenario
   → Twilio WhatsApp API
   → Parent's WhatsApp number
```

## Common use cases to design for
- **Reminders**: exam dates, homework due dates, קיץ פלוס program logistics — usually triggered on a schedule (e.g. "2 days before exam date in this sheet, send reminder")
- **Absence/behavior notices**: triggered manually or from a form Roni fills after class
- **Registration confirmations**: triggered when a Google Form submission (e.g. קיץ פלוס registration) lands in the connected Sheet
- **Broadcast announcements**: triggered manually, sent to a filtered list (e.g. only one grade/class) from a Sheet of parent contacts

## What Claude can and can't do directly
- Claude **cannot** send WhatsApp messages directly or access Roni's live Make/Twilio accounts — there's no connector for this.
- Claude **can**: design the scenario logic step-by-step, write the exact message templates (in Hebrew), specify the trigger/filter/action configuration in plain language Roni can enter into Make's UI, and help debug a scenario Roni describes or pastes an error from.
- If Roni wants something built and connected end-to-end, be explicit that the account setup and connection steps (API keys, Twilio number registration/verification, Make scenario creation) happen in Roni's own accounts — walk through each step concretely rather than assuming Roni will fill gaps.

## Design workflow
1. Clarify: trigger source (what starts the automation), audience (which parents/how filtered), message content, timing/frequency.
2. Draft the exact Hebrew message template(s), including any dynamic fields (student name, date, etc.) marked clearly (e.g. `{{שם_תלמיד}}`) so Roni can map them to spreadsheet columns in Make.
3. Lay out the scenario step-by-step (trigger → filter → format message → send via Twilio) in plain, numbered instructions suitable for Make's visual builder — Roni is not a developer, so avoid assuming familiarity with API/webhook terminology without a plain-language explanation alongside it.
4. Flag any Twilio-specific requirement that affects deliverability (e.g. WhatsApp Business API requires pre-approved message templates for the first contact in a 24-hour window, and only allows free-form replies within an active conversation window) — if unsure of current Twilio/WhatsApp policy specifics, say so and suggest Roni verify directly in the Twilio console rather than asserting stale details as current.

## Notes
Twilio/WhatsApp Business API policies (template approval, session windows, pricing) change periodically — don't state specifics confidently from memory if it's been a while; recommend checking Twilio's current docs for anything compliance/deliverability-critical.
