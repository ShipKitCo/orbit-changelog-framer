# Prompt 03 — Assign Category Tags

Use this prompt to determine the correct category tag for each of your release notes.

---

## Instructions

Copy and paste this prompt into Claude, ChatGPT, or any LLM. Fill in the brackets with your release notes.

---

## Prompt

```
I'm building a changelog page for my product. The template uses four category tags:
- Feature: A new capability that didn't exist before
- Fix: Something was broken and is now repaired
- Improvement: An existing capability that got meaningfully better (faster, more reliable, clearer)
- Breaking: A change that requires existing users to take action (code change, config update, migration)

For each release note below, assign the correct category tag and provide a one-line justification.

Release notes:
[PASTE YOUR RELEASE NOTES HERE — one per line or numbered]

Return in this format for each:
- Release note: [exact text]
- Category: [Feature | Fix | Improvement | Breaking]
- Reason: [one sentence]
- Suggested title: [a more specific, scannable title if the original is vague — max 8 words]
```

---

## Category decision rules (when in doubt)

| Situation | Tag |
|---|---|
| Adds something new that didn't exist | Feature |
| Fixes something that was broken/wrong | Fix |
| Makes an existing thing noticeably better | Improvement |
| Requires users to change their code or config | Breaking |
| Performance improvement to existing feature | Improvement |
| Security patch (no behavior change) | Fix |
| Security patch (behavior change, action required) | Breaking |
| New API endpoint added | Feature |
| API endpoint deprecated with migration path | Breaking |
| Reduced latency / better uptime | Improvement |

## Notes

- Use Breaking sparingly — if you can make a change backwards-compatible, do it. Breaking changes create churn and support tickets.
- Improvement is the most under-used tag. "We reduced latency by 40%" is an Improvement, not a Feature.
- When a release includes both a bug fix AND a new capability, split it into two entries.
