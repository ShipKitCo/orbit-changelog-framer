# Prompt 04 — Subscribe Section Copy

Use this prompt to write subscribe CTA copy that matches your product's voice and audience.

---

## Instructions

Copy and paste this prompt into Claude, ChatGPT, or any LLM. Fill in the brackets with your details.

---

## Prompt

```
I need subscribe section copy for my product's changelog page. The section has:
- A short headline (max 6 words)
- A subhead (max 15 words)
- A submit button label (1–2 words)
- A success message (shown after subscribing, max 12 words)
- An email confirmation subject line (for the notification email subscribers receive when a new entry is published)

My product: [PRODUCT NAME]
My product category: [e.g. "developer API", "SaaS billing tool", "design platform"]
My audience: [e.g. "backend engineers", "startup founders", "marketing teams"]
Voice: [e.g. "precise and minimal like Linear", "warm and approachable", "technical and direct"]

Generate 3 variations of each element. I'll pick the ones I like best.

Format:
Variation 1:
- Headline: ...
- Subhead: ...
- Button: ...
- Success: ...
- Email subject: ...

Variation 2: [same format]
Variation 3: [same format]
```

---

## Where to use the output

Update these three strings in `ChangelogPage.tsx`:

1. **Headline** — find `Stay in the loop.` (around line 400) and replace
2. **Subhead** — find `Get notified when we ship something worth knowing about.` (around line 406) and replace
3. **Success message** — find `You're on the list. We'll notify you on every release.` (around line 415) and replace

The button label "Subscribe" can be updated where `btnPrimary` is applied in the subscribe form section.

---

## Examples of good subscribe copy by voice type

**Precise / engineer-friendly (default):**
- Headline: "Stay in the loop."
- Subhead: "Get notified when we ship something worth knowing about."

**Warm / founder-friendly:**
- Headline: "Never miss a release."
- Subhead: "We'll email you when something new ships. No spam, ever."

**Direct / conversion-focused:**
- Headline: "Ship with us."
- Subhead: "Join engineers who track every Orbit release."
