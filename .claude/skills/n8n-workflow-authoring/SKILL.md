---
name: n8n-workflow-authoring
description: How to build, edit, and debug n8n automation workflows for Roni efficiently — her self-hosted n8n runs at https://n8n.178.104.102.65.sslip.io on a Hetzner server. Covers n8n's workflow JSON structure, how to avoid regenerating a whole workflow for a small change, and preferring the n8n MCP connector's tools over hand-typed JSON. Trigger whenever asked to build, fix, extend, or explain an n8n automation/workflow, or anything involving connecting apps/services "without writing code."
---

# n8n Workflow Authoring

Roni wants to describe an automation in plain language and get a working n8n workflow,
without ever touching code or a terminal herself. That means the token cost of building
it is entirely on this side — so it matters more than usual to build efficiently.

## Prefer the connector's tools over hand-typed JSON

- If the n8n MCP connector is connected (check with `ListConnectors`), use its tools —
  `search_workflows`, `get_workflow_details`, `execute_workflow`, `publish_workflow`, etc.
  — directly instead of typing a full workflow JSON blob into the conversation. The
  connector manages workflow state on the server; there's no need to paste JSON back and
  forth to create or modify something that already lives there.
- Before building something new, search existing workflows first
  (`search_workflows`) — Roni may already have something close enough to extend, which is
  both cheaper and less likely to duplicate work she's forgotten about.
- If the connector isn't connected yet, say so and point back to the connection steps
  (n8n instance URL + an API key generated in n8n under Settings → n8n API, added via
  claude.ai → Settings → Connectors) rather than trying to work around it by SSHing into
  the server or hand-editing files there.

## When you do need to read or write workflow JSON directly

- An n8n workflow is a JSON object with two main parts: `nodes` (an array — each node has
  `id`, `name`, `type`, `typeVersion`, `position`, `parameters`) and `connections` (which
  node's output feeds which node's input).
- For a small change — one node's parameters, one new connection, one new node spliced
  into an existing chain — edit just that piece. Don't regenerate the whole workflow JSON
  to change one field; that's paying full price for a small edit.
- Keep `parameters` minimal: only include fields that differ from n8n's own defaults for
  that node type. Let n8n apply the rest rather than spelling out every default value.

## Testing before it goes live

- Validate logic on a small sample (pinned/test data) before publishing a workflow that
  has real side effects — sending an actual WhatsApp/Twilio message, an email, or a paid
  API call. Re-running a workflow with real side effects just to check the wiring is both
  wasteful and, for anything user-facing, something Roni should know is about to happen.
- Anything that will cost money to run (a paid API in the loop, SMS/WhatsApp sends) —
  flag that plainly before turning it on, the same way as any other spend.

## Keep explanations short

- Describe what a workflow does as a short list of steps ("when a form is submitted →
  check the date → send a WhatsApp reminder"), not by restating the full JSON in chat.
  Only show the JSON if Roni asks to see it or is debugging something specific with it.

This is a first draft — refine it once the n8n connector is actually in use and it's clear
which patterns keep coming up (a particular node type used constantly, a recurring
structure worth turning into a template, etc.).
