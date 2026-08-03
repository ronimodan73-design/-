---
name: token-efficient-sessions
description: House rules for keeping a Claude Code session lean over long, multi-step work — large refactors, exploring an unfamiliar codebase, multi-file bug hunts, or any task that will span many tool calls and turns. Make sure to apply this automatically whenever a task looks like it will take more than a handful of tool calls, whenever the user is working across many files, or whenever the user mentions running low on context/tokens, wanting a "long session," or asks how to work more efficiently — even if they don't name tokens or context explicitly.
---

# Token-Efficient Sessions

Every token spent on a file you didn't need, a re-read of something already known, or a
narrated thought is a token not available later in the session. The context window is a
shared, shrinking budget for the whole conversation — treat reads and tool calls as
withdrawals from it, not as free actions. Being frugal early is what lets a session run
for hours instead of hitting compaction after twenty minutes.

## Before reading anything

- Search before you read. Use Grep/Glob to find the right lines or files first; only
  `Read` the file (or the specific range) once you know it's the one you need. A blind
  `Read` of a large file to "get oriented" is usually the single biggest token sink in a
  session.
- On a large file, pass `offset`/`limit` for the section you actually need instead of the
  whole file, once Grep has told you roughly where to look.
- Don't re-read a file you just edited with `Edit`/`Write` to confirm the change landed —
  the tool already errors if it didn't. Re-reading to double-check is pure waste.
- Don't re-read a file you already read earlier in the session unless you have reason to
  think it changed. Trust your own memory of it before spending tokens to refresh it.

## Before writing anything

- Prefer `Edit` (a diff) over `Write` (a full rewrite) for existing files. `Write`ing a
  whole file back out to change three lines burns tokens on the 97% that didn't change.
- Don't build things the task doesn't need — no speculative abstractions, no unrequested
  refactors, no "while I'm here" cleanup. Extra code is extra tokens now and extra tokens
  every time it's read again later in the session.

## Delegating and batching

- For open-ended exploration ("where is X handled," "how does this feature work," "what
  touches this table") that would take more than two or three targeted searches, delegate
  to the `Explore` agent instead of grepping around yourself turn by turn. Its results come
  back as a digested summary — the raw search noise never enters your main context.
- When several tool calls don't depend on each other's results, issue them together in one
  turn rather than one-by-one. Fewer round-trips means less repeated framing/overhead per
  call.
- If a subtask's output is large but only its conclusion matters (a build log, a test run,
  a broad file survey), consider running it through a subagent and asking for a short
  report back, rather than letting the raw output land in the main conversation.

## Communicating

- Give brief, factual status updates (one sentence) at decision points, not a running
  narration of every step. The user reads your text, not your tool calls — text is where
  tokens buy the least value per word, so keep it tight.
- Don't restate context the user already gave you or that's visible in a file you both can
  see. Point at it (`file.ts:42`) instead of quoting it back.
- Skip a written summary of a plan you're about to execute anyway — plans are worth writing
  when they need approval, not as a preamble to work that's happening regardless.

## Staying lean across a long session

- Periodically checkpoint mentally: what's actually still needed from ten turns ago? If a
  file's content or a search result won't be referenced again, don't re-fetch it "just in
  case" — pull it again later if it turns out you need it.
- When a task naturally splits into independent chunks (e.g., fix module A, then module B,
  then module C), treat each chunk as a fresh mini-investigation rather than carrying the
  full detail of the previous chunk forward — carry forward conclusions, not raw exploration.
- If the conversation is long enough that compaction is likely near, favor concrete,
  re-derivable facts (file paths, line numbers, a short summary of what changed) over
  restating full file contents — those are cheap to re-fetch later and expensive to keep
  live in context indefinitely.

None of this is about doing less work — it's about spending tokens on the parts of the
task that actually need them, so the session has room to keep going instead of running out
of runway halfway through.
