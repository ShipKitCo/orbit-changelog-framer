# Prompt 01 — Rebrand for Your Product

Use this prompt to replace all Orbit references with your actual product and generate realistic changelog entries.

---

## Instructions

Copy and paste this prompt into Claude, ChatGPT, or any LLM. Fill in the brackets with your actual product details before sending.

---

## Prompt

```
I'm using a Framer changelog page template originally built for "Orbit" — a developer API platform.
I need to rebrand it for my product and generate realistic changelog entries.

My product name: [YOUR PRODUCT NAME]
My product category: [e.g. "SaaS billing platform", "developer API", "design tool", "project management"]
My product's core function: [ONE SENTENCE — what does it do?]
My tech stack or audience: [e.g. "Node.js SDK, targets backend engineers", "no-code, targets marketing teams"]

Please rewrite the following for my product:

1. Nav product name text (just the name, already set via Property Control — confirm it's correct)
2. Page header subhead (max 12 words, factual, describes what the changelog covers)
3. Latest version badge label (e.g. "Latest:" prefix stays; just confirm the format looks right for my product)
4. 7 changelog entries in this exact format for each:
   - version: [e.g. v2.4.0]
   - date: [recent date, last 6 months]
   - category: [Feature | Fix | Improvement | Breaking]
   - title: [max 8 words, specific — not generic like "bug fixes"]
   - body: [2 short paragraphs, 2–4 sentences each, technical but accessible, engineer-friendly voice]
   - code: [realistic code snippet in my stack, or null if not applicable]
5. Subscribe section headline (max 6 words, e.g. "Stay in the loop.")
6. Subscribe section subhead (max 15 words, e.g. "Get notified when we ship something worth knowing about.")
7. Footer copyright line (e.g. "© 2026 [Product]. All rights reserved.")

Cover all 4 category types across the 7 entries: at least 1 Feature, 1 Fix, 1 Improvement, 1 Breaking.
Voice: precise, minimal, engineer-friendly — not marketing-speak.
Return each section clearly labeled.
```

---

## Notes

- The Framer component has `productName` and `currentVersion` as Property Controls — update those first in the Framer panel before editing the component code.
- The 7 changelog entries live in the `entries` array at the top of `ChangelogPage.tsx` (around line 27). Copy the output from this prompt and replace the entries one by one.
- The `sidebarGroups` array (around line 103) also needs to be updated to match your new version/month groupings — do this after updating the entries.
- Use prompt 02 if you just need more entries without a full rebrand.
