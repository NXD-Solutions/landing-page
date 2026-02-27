# Testament — Recurring Problem Log

Each developer maintains a local `Testament.md` in their Claude memory directory for this project.

**Location:** `~/.claude/projects/<project-id>/memory/Testament.md`

---

## Purpose

A local triage log of problems that have repeated across sessions. Prevents the same non-obvious problems from being re-discovered every session. The file is personal and never committed — any permanent fix it produces goes through the normal development process (feature branch, PR, review).

---

## When to add an entry

- The user hints that a problem has been solved before in a previous session
- A non-obvious workaround is discovered mid-session — add it **proactively**, without waiting to be told

## When to remove an entry

- The problem is permanently solved (e.g., a note added to CLAUDE.md, a config change merged)
- No trace needed once resolved

---

## Entry format

```markdown
## <Problem title>

**Symptom:** What went wrong or what Claude couldn't find or do.
**Solution:** What actually works.
**Permanent fix candidate:** What should change to solve this forever (CLAUDE.md note, config fix, etc.).
```
