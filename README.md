# Orbit Changelog Page — Framer Template

> **Purchased this template?** Your Remix link was delivered with your receipt. This repo contains the setup docs and source files.
>
> **Don't have it yet?** [Get it on Gumroad →](https://shipkitco.gumroad.com/l/orbit-changelog-framer)

---

A standalone changelog page for Framer — sticky sidebar nav, category tags, dark/light mode. Drop it into any existing Framer site as your `/changelog`.

![Orbit Changelog Page](https://shipkitco.gumroad.com/l/orbit-changelog-framer)

---

## What's in this repo

| File | Purpose |
|---|---|
| `ChangelogPage.tsx` | Full Framer code component — paste into Assets → Code |
| `SETUP.md` | Step-by-step setup guide |
| `ai-prompts/` | 4 AI prompts for generating changelog copy with Claude or ChatGPT |

---

## Quick Start

**1. Remix into Framer** *(fastest — your purchase receipt includes the Remix link)*

Click the Remix link from your receipt. Framer opens with a live copy of the project already in your workspace. Skip to step 3.

**2. Or paste the component manually**

1. Open your Framer project
2. **Assets → Code → +** (New code file) → name it `ChangelogPage`
3. Paste the full contents of `ChangelogPage.tsx`
4. Press **Cmd+S**

**3. Configure with Property Controls**

Select the component on canvas. Four controls appear in the right panel:

| Control | Default | What it does |
|---|---|---|
| **Color Mode** | Dark | Toggles dark ↔ light mode |
| **Accent Color** | `#818CF8` | Brand color — updates every badge, tag, and button |
| **Product Name** | Orbit | Logo text in nav and footer |
| **Current Version** | v2.4.0 | "Latest: v2.4.0" badge in the page header |

**4. Add your changelog entries**

The feed is a static array at the top of `ChangelogPage.tsx`. See **[SETUP.md](SETUP.md)** for the full entry schema and instructions.

**5. Publish as `/changelog`**

Add a new Page in Framer, set the path to `/changelog`, drag the component to fill the frame, publish.

---

## AI Prompts

The `ai-prompts/` folder contains 4 ready-to-use prompts:

| File | What it generates |
|---|---|
| `01-rebrand.md` | Full rebrand checklist for your product |
| `02-entry-generator.md` | Changelog entries from your release notes |
| `03-category-tags.md` | Correct category tag (Feature / Fix / Improvement / Breaking) for any change |
| `04-subscribe-copy.md` | Subscribe section headline and CTA copy |

Paste any prompt into Claude or ChatGPT, follow the instructions inside the file.

---

## Bundle compatibility

This template uses the same Framer Variables and design tokens as the full ShipKitCo template suite:

- [Meridian Pricing Page](https://github.com/ShipKitCo/meridian-pricing-framer)
- [Orbit Comparison Page](https://github.com/ShipKitCo/orbit-comparison-framer)

Variables are named identically across all three (`Color/Accent`, `Color/Background`, etc.) — update once, all pages update.

---

## Support

- **Setup questions:** See [SETUP.md](SETUP.md)
- **Content generation:** Use the prompts in [ai-prompts/](ai-prompts/)
- **Bugs or issues:** [Open an issue](https://github.com/ShipKitCo/orbit-changelog-framer/issues)
- **Purchase support:** Reply to your Gumroad receipt email

---

Made by [ShipKitCo](https://shipkitco.gumroad.com)
