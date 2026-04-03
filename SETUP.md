# FRAMER-SETUP.md — Orbit Changelog Page

Quick setup guide for importing and configuring the changelog component in Framer.

---

## Step 1 — Import the component

1. Open your Framer project
2. Click **Assets** panel → **Code** tab → **+** (New code file)
3. Paste the full contents of `ChangelogPage.tsx`
4. Click **Save** — the component will appear in the Assets panel as "ChangelogPage"

---

## Step 2 — Add the component to your canvas

1. Drag "ChangelogPage" from the Assets panel onto your canvas
2. Set the frame width to **1440px** (or "Fill Container" for responsive)
3. Set the height to **Hug Contents**
4. The component renders the full changelog page including nav and footer

---

## Step 3 — Configure with Property Controls

With the component selected, open the **Properties** panel on the right. You'll see four controls:

| Control | Default | What it does |
|---|---|---|
| **Color Mode** | Dark | Toggles between dark and light mode. Both modes are fully styled. |
| **Accent Color** | `#818CF8` | Changes the brand color — version badges, category tags, CTA buttons, sidebar active state. |
| **Product Name** | Orbit | Updates the logo text in the nav and footer. |
| **Current Version** | v2.4.0 | Updates the "Latest: v2.4.0" badge in the page header. |

**To match your brand:** Change Accent Color to your primary color. The component dynamically generates all tinted/dimmed variants from this single hex value.

---

## Step 4 — Replace the changelog entries

The changelog feed is powered by a static array at the top of the component file (`entries`). To add your own releases:

1. Open the component file in Framer's code editor
2. Find the `const entries: ChangelogEntry[]` array (line ~27)
3. Replace or add entries following this structure:

```typescript
{
    id: "entry-v1-0-0",          // unique ID — used for anchor scrolling
    version: "v1.0.0",           // displayed in the version badge and sidebar
    date: "Apr 1, 2026",         // displayed next to the version badge
    category: "Feature",         // "Feature" | "Fix" | "Improvement" | "Breaking"
    title: "Your release title", // short, max ~8 words
    body: "First paragraph.\n\nSecond paragraph.", // use \n\n to separate paragraphs
    code: `your code here`,      // or null if no code snippet
}
```

4. Update `sidebarGroups` to match your new version/month groupings (around line ~103)

---

## Step 5 — Add as a page in your Framer site

1. In your Framer project, add a new **Page** (Pages panel → +)
2. Name it `Changelog`
3. Set the path to `/changelog`
4. Drag the ChangelogPage component to fill the full page width
5. Publish — the page is live at `yoursite.com/changelog`

---

## Customization tips

**Subscribe form:** The form uses a local `useState` success state. To connect it to a real email service (Mailchimp, ConvertKit, etc.), replace the `onSubmit` handler in the component with an API call to your email provider's subscribe endpoint.

**Fonts:** Geist and Geist Mono are loaded from Google Fonts automatically. No manual font setup needed in Framer Site Settings.

**Variable names:** This template uses the same Framer Variable names as the Orbit Pricing and Comparison templates (`Color/Accent`, `Color/Background`, etc.). If you're using the full template suite, all three pages share the same Variable structure — update once, all pages update.

---

## Support

If you have questions about setup, use the AI prompts in the `ai-prompts/` folder to generate customized content for your product.
