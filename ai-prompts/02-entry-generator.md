# Prompt 02 — Generate Changelog Entries

Use this prompt to generate new changelog entries for your product without doing a full rebrand.

---

## Instructions

Copy and paste this prompt into Claude, ChatGPT, or any LLM. Fill in the brackets with your details.

---

## Prompt

```
I need to generate changelog entries for my product to add to a Framer changelog page template.

My product: [PRODUCT NAME]
My product's category: [e.g. "API gateway", "billing platform", "design tool"]
My tech stack / audience: [e.g. "Node.js SDK for backend engineers", "no-code for marketers"]

Generate [NUMBER] changelog entries in the following format:

---
version: [e.g. v3.1.0 — increment from my latest: [YOUR CURRENT LATEST VERSION]]
date: [recent date]
category: [Feature | Fix | Improvement | Breaking]
title: [max 8 words — specific and descriptive, not generic like "performance improvements"]
body: [2 paragraphs. First paragraph: what changed and why. Second paragraph: what it means for users, or how to get the benefit. 2–4 sentences each. Engineer-friendly voice — precise, no marketing language.]
code: [One realistic code snippet showing the change, in [LANGUAGE/FRAMEWORK]. Use null if no code snippet is needed for this entry.]
---

Cover the following categories in the entries you generate: [list which ones you want, e.g. "2 Feature, 1 Fix, 1 Improvement, 1 Breaking"]

Important rules:
- Titles must be specific. "Rate limiting support" not "New feature added."
- Breaking changes must include what specifically breaks and what the migration path is.
- Code snippets must be realistic — not pseudocode. Use [my product's SDK/API conventions if known].
- Voice: direct, minimal, technical but not jargon-heavy.
```

---

## After generating

1. Copy each entry into the `entries` array in `ChangelogPage.tsx` (around line 27)
2. Follow this TypeScript structure exactly:

```typescript
{
    id: "entry-v3-1-0",          // use version numbers separated by dashes
    version: "v3.1.0",
    date: "Apr 15, 2026",
    category: "Feature",         // must be exactly: "Feature" | "Fix" | "Improvement" | "Breaking"
    title: "Your entry title",
    body: "First paragraph.\n\nSecond paragraph.",  // \n\n separates paragraphs
    code: `your code here`,      // use backtick template literal, or null
}
```

3. Update `sidebarGroups` to include the new versions and months (around line 103)
