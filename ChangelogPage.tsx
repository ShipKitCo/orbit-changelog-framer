import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

/**
 * Orbit Changelog Page
 * saas-changelog-page-v1
 *
 * Design system: shared-design-system/DESIGN-TOKENS.md
 * Reference: saas-comparison-page-v1/ComparisonPage.tsx (architecture)
 *            saas-pricing-page-v1/PricingPage.tsx (IntersectionObserver pattern)
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */

type ChangelogEntry = {
    id: string
    version: string
    date: string
    category: "Feature" | "Fix" | "Improvement" | "Breaking"
    title: string
    body: string
    code: string | null
}

// -- Changelog data -------------------------------------------------------
// Replace these entries with your own. Each entry maps to one card in the feed.
// category options: "Feature" | "Fix" | "Improvement" | "Breaking"
const entries: ChangelogEntry[] = [
    {
        id: "entry-v2-4-0",
        version: "v2.4.0",
        date: "Apr 1, 2026",
        category: "Feature",
        title: "Webhook retry policies",
        body: "Configure exactly how Orbit handles delivery failures. Retry policies let you set the number of attempts, backoff strategy (linear or exponential), and the maximum retry window u2014 all per-webhook or globally across your account.\n\nWhen a delivery fails, Orbit queues the event and retries according to your policy. Every attempt is logged with its status code and response time, visible in your dashboard without any additional configuration.",
        code: `orbit.webhook.configure({\n  endpoint: "https://api.example.com/events",\n  retries: 5,\n  backoff: "exponential",  // or "linear"\n  retryWindow: "24h"\n})`,
    },
    {
        id: "entry-v2-3-2",
        version: "v2.3.2",
        date: "Mar 18, 2026",
        category: "Fix",
        title: "Race condition in concurrent event dispatch",
        body: "Fixed a race condition that caused duplicate event delivery when multiple SDK instances dispatched to the same endpoint within a short time window. This affected teams running horizontally scaled services with shared webhook configurations.\n\nThe fix introduces a distributed lock at the delivery layer. No SDK changes required u2014 update your server-side SDK to v2.3.2 or later to get the fix.",
        code: null,
    },
    {
        id: "entry-v2-3-0",
        version: "v2.3.0",
        date: "Mar 10, 2026",
        category: "Feature",
        title: "Event replay from dashboard",
        body: "Replay any failed or dropped event directly from the Orbit dashboard u2014 no code required. Select an event from your delivery log, inspect the payload, and re-dispatch it to any registered endpoint with one click.\n\nReplay is available for all events in your 30-day retention window. For programmatic access, use the new Replay API.",
        code: `// Programmatic replay\nconst result = await orbit.events.replay("evt_01hx3k92mf", {\n  endpoint: "https://api.example.com/events"  // optional override\n})`,
    },
    {
        id: "entry-v2-2-1",
        version: "v2.2.1",
        date: "Feb 28, 2026",
        category: "Improvement",
        title: "Delivery latency reduced 40%",
        body: "Median webhook delivery latency dropped from 180ms to 110ms following infrastructure changes to our delivery pipeline. P99 latency (previously 1.2s) is now under 400ms across all regions.\n\nThis improvement applies to all accounts automatically. No configuration changes needed.",
        code: null,
    },
    {
        id: "entry-v2-2-0",
        version: "v2.2.0",
        date: "Feb 14, 2026",
        category: "Feature",
        title: "Slack alert integrations",
        body: "Connect Orbit to your Slack workspace and receive delivery failure alerts where your team already works. Configure alerts per-webhook or globally, with customizable thresholds u2014 alert after 1 failure, after 3 consecutive failures, or when the failure rate exceeds a percentage.",
        code: `orbit.alerts.slack({\n  webhookUrl: process.env.SLACK_WEBHOOK_URL,\n  channel: "#eng-alerts",\n  threshold: { consecutiveFailures: 3 }\n})`,
    },
    {
        id: "entry-v2-1-0",
        version: "v2.1.0",
        date: "Jan 30, 2026",
        category: "Breaking",
        title: "SDK authentication header renamed",
        body: "The SDK authentication header has been renamed from X-Orbit-Key to Authorization: Bearer {token} to align with standard OAuth conventions. The old header continues to work until March 30, 2026 u2014 update before then.\n\nIf you're using the Orbit Node.js or Python SDK, upgrading to v2.1.0 handles this migration automatically.",
        code: `// Before (deprecated Mar 30)\nconst orbit = new Orbit({ "X-Orbit-Key": process.env.ORBIT_KEY })\n\n// After (v2.1.0+)\nconst orbit = new Orbit({ apiKey: process.env.ORBIT_KEY })`,
    },
    {
        id: "entry-v2-0-0",
        version: "v2.0.0",
        date: "Jan 15, 2026",
        category: "Feature",
        title: "Orbit 2.0 u2014 Real-time event streaming",
        body: "Orbit 2.0 introduces real-time event streaming alongside existing webhook delivery. Subscribe to a live event stream using Server-Sent Events or our WebSocket client u2014 no polling, no missed events, sub-50ms delivery.\n\nWebhook delivery is unchanged. Streaming is additive u2014 use it for dashboards, live activity feeds, or any use case where polling is the wrong tool.",
        code: `// Subscribe to a live event stream\nconst stream = orbit.stream.subscribe("user.*", (event) => {\n  console.log(event.type, event.data)\n})\n\n// Unsubscribe when done\nstream.close()`,
    },
]

// -- Sidebar groups -------------------------------------------------------
const sidebarGroups = [
    { month: "Apr 2026", versions: ["v2.4.0"] },
    { month: "Mar 2026", versions: ["v2.3.2", "v2.3.0"] },
    { month: "Feb 2026", versions: ["v2.2.1", "v2.2.0"] },
    { month: "Jan 2026", versions: ["v2.1.0", "v2.0.0"] },
]

const entryIdMap: Record<string, string> = Object.fromEntries(
    entries.map(e => [e.version, e.id])
)

// -------------------------------------------------------------------------

export default function ChangelogPage(props: {
    colorMode?: "dark" | "light"
    accentColor?: string
    productName?: string
    currentVersion?: string
}) {
    const {
        colorMode = "dark",
        accentColor = "#818CF8",
        productName = "Orbit",
        currentVersion = "v2.4.0",
    } = props

    // ResizeObserver on the root element u2014 reliable inside Framer's preview iframe.
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    )
    useEffect(() => {
        const el = wrapRef.current
        if (!el) return
        const ro = new ResizeObserver(entries => {
            setViewportWidth(entries[0].contentRect.width)
        })
        ro.observe(el)
        setViewportWidth(el.getBoundingClientRect().width)
        return () => ro.disconnect()
    }, [])

    const isDark = colorMode === "dark"
    const isMobile = viewportWidth <= 640
    const isTablet = viewportWidth <= 900
    // Parse accentColor u2014 handles both "#818CF8" (canvas) and "rgba(129,140,248,1)" (preview)
    const [ar, ag, ab] = (() => {
        const rgb = accentColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
        if (rgb) return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])]
        const hex = accentColor.replace("#", "").match(/^[0-9a-fA-F]{6}$/)
        if (hex) return (accentColor.replace("#","").match(/../g) || []).map((h: string) => parseInt(h, 16))
        return [129, 140, 248]
    })()

    // -- Design tokens u2014 mirrors DESIGN-TOKENS.md exactly ----------------
    const T = isDark
        ? {
              bg: "#0D0D0D",
              surface: "#141414",
              elevated: "#1C1C1E",
              border: "rgba(255,255,255,0.08)",
              borderStr: "rgba(255,255,255,0.16)",
              text: "#F5F5F5",
              muted: "#A3A3A3",
              disabled: "rgba(255,255,255,0.25)",
              accent: accentColor,
              accentDim: `rgba(${ar},${ag},${ab},0.15)`,
              accentBorder: `rgba(${ar},${ag},${ab},0.50)`,
              navBg: "rgba(13,13,13,0.88)",
              logoStroke: "rgba(255,255,255,0.20)",
          }
        : {
              bg: "#F8F8FC",
              surface: "#FFFFFF",
              elevated: "#F0F0F8",
              border: "rgba(0,0,0,0.08)",
              borderStr: "rgba(0,0,0,0.16)",
              text: "#0D0D0D",
              muted: "#6B6B6B",
              disabled: "rgba(0,0,0,0.25)",
              accent: accentColor,
              accentDim: `rgba(${ar},${ag},${ab},0.16)`,
              accentBorder: `rgba(${ar},${ag},${ab},0.32)`,
              navBg: "rgba(248,248,252,0.90)",
              logoStroke: "rgba(0,0,0,0.18)",
          }

    const [activeEntry, setActiveEntry] = useState(entries[0].version)
    const [subscribeEmail, setSubscribeEmail] = useState("")
    const [subscribed, setSubscribed] = useState(false)
    const wrapRef = useRef<HTMLDivElement>(null)

    // -- Font load --------------------------------------------------------
    useEffect(() => {
        const id = "clog-geist"
        if (!document.getElementById(id)) {
            const link = document.createElement("link")
            link.id = id
            link.rel = "stylesheet"
            link.href = "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"
            document.head.appendChild(link)
        }
    }, [])

    // -- Scroll reveal (same IntersectionObserver pattern as PricingPage.tsx)
    useEffect(() => {
        const container = wrapRef.current
        if (!container) return
        const observer = new IntersectionObserver(
            es => es.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("clog-revealed")
                    observer.unobserve(e.target)
                }
            }),
            { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
        )
        const timer = setTimeout(() => {
            container.querySelectorAll(".clog-reveal").forEach(el => observer.observe(el))
        }, 60)
        return () => { clearTimeout(timer); observer.disconnect() }
    }, [])

    // -- Sidebar active state (second IntersectionObserver on entry elements)
    useEffect(() => {
        const container = wrapRef.current
        if (!container) return
        const sideObs = new IntersectionObserver(
            es => {
                es.forEach(e => {
                    if (e.isIntersecting) {
                        const v = e.target.getAttribute("data-version")
                        if (v) setActiveEntry(v)
                    }
                })
            },
            { threshold: 0.25, rootMargin: "-72px 0px -40% 0px" }
        )
        const timer = setTimeout(() => {
            container.querySelectorAll("[data-version]").forEach(el => sideObs.observe(el))
        }, 80)
        return () => { clearTimeout(timer); sideObs.disconnect() }
    }, [])

    // -- Dynamic CSS injection (re-runs when mode or accent changes) ------
    useEffect(() => {
        const id = "clog-styles"
        const existing = document.getElementById(id)
        if (existing) existing.remove()
        const ghostHover = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            /* Scroll-reveal animations */
            @media (prefers-reduced-motion: no-preference) {
                .clog-reveal { opacity: 0; transform: translateY(16px); }
                .clog-revealed { opacity: 1; transform: translateY(0); transition: opacity 0.5s ease, transform 0.5s ease; transition-delay: var(--delay, 0s); }
            }
            @media (prefers-reduced-motion: reduce) {
                .clog-reveal { opacity: 1; transform: none; }
            }
            /* Button hover states */
            .clog-btn-primary { transition: opacity 0.15s, transform 0.15s; }
            .clog-btn-primary:hover { opacity: 0.82; transform: translateY(-1px); }
            .clog-btn-primary:active { opacity: 1; transform: translateY(0); }
            .clog-btn-ghost { transition: background 0.15s, border-color 0.15s, transform 0.15s; }
            .clog-btn-ghost:hover { background: ${ghostHover} !important; transform: translateY(-1px); }
            .clog-btn-ghost:active { transform: translateY(0); }
            /* Entry card hover */
            .clog-card { transition: border-color 0.15s; }
            .clog-card:hover { border-color: ${T.borderStr} !important; }
            /* Sidebar items */
            .clog-sidebar-item { transition: color 0.15s, border-left-color 0.15s, padding-left 0.15s; cursor: pointer; }
            .clog-sidebar-item:hover { color: ${T.text} !important; }
            /* Mobile pill row u2014 hide scrollbar */
            .clog-pill-row { display: flex; gap: 8px; overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; }
            .clog-pill-row::-webkit-scrollbar { display: none; }
            .clog-pill { white-space: nowrap; cursor: pointer; transition: background 0.15s, color 0.15s, border-color 0.15s; }
            .clog-pill:hover { background: ${T.elevated} !important; }
            /* Nav + footer links */
            .clog-nav-link { transition: color 0.12s; }
            .clog-nav-link:hover { color: ${T.text} !important; }
            .clog-footer-link { transition: color 0.12s; }
            .clog-footer-link:hover { color: ${T.text} !important; }
            /* Subscribe input */
            .clog-input { transition: border-color 0.15s; }
            .clog-input:focus { outline: 2px solid ${T.accent}; outline-offset: 1px; border-color: transparent !important; }
            /* Success state */
            .clog-success { background: rgba(34,197,94,0.10); border: 1px solid rgba(34,197,94,0.20); border-radius: 6px; padding: 10px 18px; font-size: 13px; color: #22C55E; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; }
        `
        document.head.appendChild(s)
    }, [isDark, accentColor])

    // -- Layout constants (identical to ComparisonPage.tsx) ---------------
    const MAX_W = "1440px"
    const PAD_X = "40px"
    const SEC_V = "96px"
    const wrap: React.CSSProperties = { maxWidth: MAX_W, margin: "0 auto", padding: isMobile ? "0 20px" : `0 ${PAD_X}` }
    const section: React.CSSProperties = { padding: `${SEC_V} 0` }

    // -- Button styles ----------------------------------------------------
    const btnPrimary: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "10px 22px", borderRadius: "6px",
        fontSize: "13px", fontWeight: 500, fontFamily: "inherit",
        background: T.accent, color: isDark ? "#000" : "#fff",
        border: "none", cursor: "pointer", textDecoration: "none",
        whiteSpace: "nowrap",
    }
    const btnNav: React.CSSProperties = {
        display: "inline-flex", alignItems: "center",
        height: "32px", padding: "0 14px", borderRadius: "6px",
        fontSize: "13px", fontWeight: 500, fontFamily: "inherit",
        background: T.accent, color: isDark ? "#000" : "#fff",
        border: "none", cursor: "pointer",
    }

    // -- SVG components ---------------------------------------------------
    // Orbit logo mark: central body, orbital ring, satellite
    const LogoSVG = ({ size = 20 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" fill={T.accent} />
            <circle cx="10" cy="10" r="7.5" stroke={T.logoStroke} strokeWidth="1.25" fill="none" />
            <circle cx="10" cy="2.5" r="1.5" fill={T.accent} fillOpacity="0.75" />
        </svg>
    )

    // -- Category tag config ----------------------------------------------
    const tagConfig: Record<string, { bg: string; text: string; border: string }> = {
        Feature:     { bg: T.accentDim,                     text: T.accent,    border: T.accentBorder },
        Fix:         { bg: "rgba(251,191,36,0.18)",         text: "#F59E0B",   border: "rgba(251,191,36,0.50)" },
        Improvement: { bg: "rgba(34,197,94,0.16)",          text: "#22C55E",   border: "rgba(34,197,94,0.45)" },
        Breaking:    { bg: "rgba(239,68,68,0.16)",          text: "#EF4444",   border: "rgba(239,68,68,0.45)" },
    }

    // -- Scroll helper ----------------------------------------------------
    const scrollToEntry = (entryId: string) => {
        const el = document.getElementById(entryId)
        if (!el) return
        const top = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top, behavior: "smooth" })
    }

    // =====================================================================
    // Render
    // =====================================================================
    return (
        <div
            ref={wrapRef}
            style={{
                fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
                background: T.bg,
                color: T.text,
                fontSize: "15px",
                lineHeight: "1.6",
                WebkitFontSmoothing: "antialiased",
                width: "100%",
                overflowX: "clip",
            }}
        >

            {/* ══ NAV ══════════════════════════════════════════════════════ */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 100,
                background: T.navBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: `1px solid ${T.border}`,
            }}>
                <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <LogoSVG />
                        <span style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.02em", color: T.text }}>
                            {productName}
                        </span>
                    </div>
                    {!isMobile && (
                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                            {["Docs", "Changelog", "API Reference", "Pricing"].map(link => (
                                <a key={link} href="#" className="clog-nav-link"
                                    style={{ color: T.muted, textDecoration: "none", fontSize: "13px" }}>
                                    {link}
                                </a>
                            ))}
                        </div>
                    )}
                    <button
                        className="clog-btn-primary"
                        style={btnNav}
                        onClick={() => {
                            const el = document.getElementById("clog-subscribe")
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
                        }}
                    >
                        Subscribe
                    </button>
                </div>
            </nav>

            {/* ══ PAGE HEADER ══════════════════════════════════════════════ */}
            <section style={{ padding: isMobile ? "48px 0 32px" : isTablet ? "64px 0 24px" : "80px 0 48px" }}>
                <div className="clog-reveal" style={wrap}>
                    <h1 style={{
                        fontSize: isMobile ? "32px" : "clamp(32px, 4vw, 48px)",
                        fontWeight: 400,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        color: T.text,
                        marginBottom: "12px",
                    }}>
                        Changelog
                    </h1>
                    <p style={{
                        fontSize: "17px",
                        color: T.muted,
                        letterSpacing: "-0.01em",
                        marginBottom: "20px",
                        lineHeight: 1.55,
                    }}>
                        Every release, every fix, every improvement.
                    </p>
                    {/* Latest version badge */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: T.accentDim,
                        border: `1px solid ${T.accentBorder}`,
                        borderRadius: "20px",
                        padding: "4px 12px",
                    }}>
                        <span style={{ fontSize: "12px", color: T.text }}>Latest:</span>
                        <span style={{
                            fontSize: "12px", fontWeight: 500, color: T.accent,
                            fontFamily: "'Geist Mono', monospace", letterSpacing: "-0.01em",
                        }}>
                            {currentVersion}
                        </span>
                    </div>
                </div>
            </section>

            {/* ══ MOBILE / TABLET PILL ROW ════════════════════════════════ */}
            {isTablet && (
                <div style={{ paddingBottom: "16px" }}>
                    <div className="clog-pill-row" style={{ padding: `2px ${isMobile ? "20px" : "40px"} 6px` }}>
                        {entries.map(e => {
                            const isActive = activeEntry === e.version
                            return (
                                <button
                                    key={e.version}
                                    className="clog-pill"
                                    onClick={() => scrollToEntry(e.id)}
                                    style={{
                                        background: isActive ? T.accentDim : T.surface,
                                        color: isActive ? T.accent : T.muted,
                                        border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                                        borderRadius: "20px",
                                        padding: "5px 12px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        fontFamily: "'Geist Mono', monospace",
                                        cursor: "pointer",
                                    }}
                                >
                                    {e.version}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ══ TWO-COLUMN LAYOUT ════════════════════════════════════════ */}
            <div style={{
                ...wrap,
                display: "grid",
                gridTemplateColumns: isTablet ? "1fr" : "220px 1fr",
                gap: isTablet ? 0 : "64px",
                alignItems: "start",
                paddingBottom: SEC_V,
            }}>
                {/* ── Sidebar ── */}
                {!isTablet && (
                    <aside style={{
                        position: "sticky",
                        top: "72px",
                        alignSelf: "start",
                        paddingTop: "8px",
                    }}>
                        <div className="clog-reveal" style={{ "--delay": "0.1s" } as React.CSSProperties}>
                            {sidebarGroups.map((group, gi) => (
                                <div key={group.month}>
                                    <div style={{
                                        fontSize: "11px",
                                        fontWeight: 500,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: T.disabled,
                                        marginBottom: "8px",
                                        marginTop: gi === 0 ? 0 : "24px",
                                    }}>
                                        {group.month}
                                    </div>
                                    {group.versions.map(v => {
                                        const isActive = activeEntry === v
                                        return (
                                            <div
                                                key={v}
                                                className="clog-sidebar-item"
                                                onClick={() => scrollToEntry(entryIdMap[v])}
                                                style={{
                                                    padding: "5px 0 5px 12px",
                                                    borderLeft: `2px solid ${isActive ? T.accent : "transparent"}`,
                                                    color: isActive ? T.text : T.muted,
                                                    fontSize: "14px",
                                                    fontFamily: "'Geist Mono', monospace",
                                                    userSelect: "none",
                                                } as React.CSSProperties}
                                            >
                                                {v}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </aside>
                )}

                {/* ── Entry feed ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
                    {entries.map((entry, i) => {
                        const tag = tagConfig[entry.category]
                        const delay = i === 0 ? "0s" : i === 1 ? "0.05s" : "0.08s"
                        const bodyParagraphs = entry.body.split("\n\n")

                        return (
                            <article
                                key={entry.id}
                                id={entry.id}
                                data-version={entry.version}
                                className="clog-card clog-reveal"
                                style={{
                                    "--delay": delay,
                                    background: T.surface,
                                    border: `1px solid ${T.border}`,
                                    borderRadius: "10px",
                                    padding: isMobile ? "24px" : "40px",
                                    minWidth: 0,
                                } as React.CSSProperties}
                            >
                                {/* Meta row */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    marginBottom: "16px",
                                }}>
                                    <span style={{
                                        background: T.accentDim,
                                        border: `1px solid ${T.accentBorder}`,
                                        color: T.accent,
                                        fontFamily: "'Geist Mono', monospace",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        padding: "3px 10px",
                                        borderRadius: "20px",
                                    }}>
                                        {entry.version}
                                    </span>
                                    <span style={{ color: T.muted, fontSize: "13px" }}>
                                        {entry.date}
                                    </span>
                                    <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: T.disabled, marginBottom: "2px", flexShrink: 0 }} />
                                    <span style={{
                                        color: tag.text,
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                    }}>
                                        {entry.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 style={{
                                    fontSize: isMobile ? "18px" : "clamp(18px, 2vw, 22px)",
                                    fontWeight: 400,
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.3,
                                    color: T.text,
                                    marginBottom: "12px",
                                }}>
                                    {entry.title}
                                </h2>

                                {/* Body */}
                                <div>
                                    {bodyParagraphs.map((p, pi) => (
                                        <p key={pi} style={{
                                            fontSize: "15px",
                                            color: T.muted,
                                            lineHeight: 1.7,
                                            letterSpacing: "-0.01em",
                                            marginBottom: pi < bodyParagraphs.length - 1 ? "12px" : 0,
                                        }}>
                                            {p}
                                        </p>
                                    ))}
                                </div>

                                {/* Code block */}
                                {entry.code && (
                                    <div style={{
                                        background: T.elevated,
                                        border: `1px solid ${T.border}`,
                                        borderRadius: "8px",
                                        padding: "16px 20px",
                                        marginTop: "20px",
                                        overflowX: "auto",
                                        maxWidth: "100%",
                                    }}>
                                        <pre style={{
                                            margin: 0,
                                            fontFamily: "'Geist Mono', 'Courier New', monospace",
                                            fontSize: "13px",
                                            lineHeight: 1.65,
                                            color: T.text,
                                            opacity: 0.9,
                                            whiteSpace: "pre",
                                        }}>
                                            <code>{entry.code}</code>
                                        </pre>
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </div>
            </div>

            {/* ══ SUBSCRIBE ════════════════════════════════════════════════ */}
            <section
                id="clog-subscribe"
                style={{
                    background: T.bg,
                    borderTop: `1px solid ${T.border}`,
                    padding: isMobile ? "56px 0" : "72px 0",
                }}
            >
                <div className="clog-reveal" style={{ ...wrap }}>

                    {/* Row 1: Badge */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: T.accentDim,
                        border: `1px solid ${T.accentBorder}`,
                        borderRadius: "20px",
                        padding: "4px 12px",
                        marginBottom: "20px",
                    }}>
                        <span style={{
                            width: "6px", height: "6px",
                            borderRadius: "50%",
                            background: T.accent,
                            display: "inline-block",
                            flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "12px", color: T.accent, fontWeight: 500, letterSpacing: "-0.01em" }}>
                            Release notifications
                        </span>
                    </div>

                    {/* Row 2: Large horizontal headline */}
                    <h2 style={{
                        fontSize: isMobile ? "30px" : "clamp(38px, 5vw, 60px)",
                        fontWeight: 400,
                        letterSpacing: "-0.04em",
                        color: T.text,
                        lineHeight: 1.0,
                        marginBottom: "32px",
                    }}>
                        Never miss a release.
                    </h2>

                    {/* Row 3: 3-column feature grid with dividers */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                        borderTop: `1px solid ${T.border}`,
                        marginBottom: "40px",
                    }}>
                        {([
                            ["Feature releases", "New capabilities shipped as they land."],
                            ["Bug fixes", "Patches and regression notes included."],
                            ["Breaking changes", "Migration guides in every notice."],
                        ] as [string, string][]).map(([label, desc], i) => (
                            <div key={label} style={{
                                padding: isMobile ? "20px 0" : "24px 0",
                                paddingRight: (!isMobile && i < 2) ? "32px" : "0",
                                paddingLeft: (!isMobile && i > 0) ? "32px" : "0",
                                borderRight: (!isMobile && i < 2) ? `1px solid ${T.border}` : "none",
                                borderTop: isMobile ? `1px solid ${T.border}` : "none",
                            }}>
                                <div style={{
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: T.text,
                                    letterSpacing: "-0.01em",
                                    marginBottom: "5px",
                                }}>
                                    {label}
                                </div>
                                <div style={{ fontSize: "13px", color: T.muted, lineHeight: 1.55 }}>
                                    {desc}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Row 4: Social proof + inline form */}
                    <div style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "stretch" : "center",
                        gap: isMobile ? "12px" : "24px",
                    }}>
                        <span style={{ fontSize: "13px", color: T.muted, flexShrink: 0, whiteSpace: "nowrap" }}>
                            2,400+ engineers subscribed.
                        </span>
                        {subscribed ? (
                            <div className="clog-success">
                                ✓ You're on the list. We'll notify you on every release.
                            </div>
                        ) : (
                            <form
                                onSubmit={(e) => { e.preventDefault(); if (subscribeEmail) setSubscribed(true) }}
                                style={{ display: "flex", gap: "8px", flex: 1 }}
                            >
                                <input
                                    type="email"
                                    className="clog-input"
                                    placeholder="you@company.com"
                                    value={subscribeEmail}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubscribeEmail(e.target.value)}
                                    required
                                    style={{
                                        flex: 1,
                                        height: "44px",
                                        background: T.surface,
                                        border: `1px solid ${T.border}`,
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontFamily: "inherit",
                                        color: T.text,
                                        padding: "0 14px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="clog-btn-primary"
                                    style={{ ...btnPrimary, height: "44px", padding: "0 20px", flexShrink: 0 }}
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
            <footer style={{
                borderTop: `1px solid ${T.border}`,
                padding: "40px 0",
            }}>
                <div style={{
                    ...wrap,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <LogoSVG size={16} />
                        <span style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em", color: T.muted }}>
                            {productName}
                        </span>
                    </div>
                    <span style={{ fontSize: "13px", color: T.disabled }}>
                        © 2026 {productName}. All rights reserved.
                    </span>
                    <div style={{ display: "flex", gap: "20px" }}>
                        {["Pricing", "Docs", "Contact"].map(link => (
                            <a key={link} href="#" className="clog-footer-link"
                                style={{ color: T.muted, textDecoration: "none", fontSize: "13px" }}>
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>

        </div>
    )
}

// -- Property controls for Framer panel -----------------------------------
addPropertyControls(ChangelogPage, {
    colorMode: {
        type: ControlType.Enum,
        title: "Color Mode",
        options: ["dark", "light"],
        optionTitles: ["Dark", "Light"],
        defaultValue: "dark",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#818CF8",
    },
    productName: {
        type: ControlType.String,
        title: "Product Name",
        defaultValue: "Orbit",
        placeholder: "Your product name",
    },
    currentVersion: {
        type: ControlType.String,
        title: "Current Version",
        defaultValue: "v2.4.0",
        placeholder: "v2.4.0",
    },
})
