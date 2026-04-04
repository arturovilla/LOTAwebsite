# LOTA — Discoverability & Marketing Plan

> Generated 2026-04-03. Research-based plan to optimize discoverability for lidarota.app.

## Current State

**Site:** Next.js 16 marketing site for LOTA (LiDAR Over The Air) iOS app.
**Domain:** lidarota.app | **Hosting:** Vercel | **Status:** Pre-launch beta (App Store mid-April 2026)
**Pages:** `/` (landing), `/docs`, `/changelog`, `/privacy`, `/api/subscribe`

### Gaps Identified

| Item                          | Status  |
| ----------------------------- | ------- |
| robots.txt                    | Missing |
| sitemap.xml                   | Missing |
| Open Graph / Twitter cards    | Missing |
| JSON-LD structured data       | Missing |
| Per-page meta tags            | Missing |
| llms.txt / llms-full.txt      | Missing |
| security.txt                  | Missing |
| humans.txt                    | Missing |
| Blog / content hub            | Missing |
| FAQ schema                    | Missing |
| Canonical URLs                | Missing |
| AI-referred traffic tracking  | Missing |

---

## Tier 1 — Critical (Low effort, high impact)

### 1. robots.txt

Allow AI retrieval bots for search visibility. For a pre-launch product that wants maximum exposure, allow training bots too — being in training data increases citation probability.

**Bots to allow:**

- Standard: Googlebot, Bingbot
- AI Retrieval: ChatGPT-User, OAI-SearchBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Amazonbot
- AI Training: GPTBot, ClaudeBot, Google-Extended (allow for maximum exposure during launch)

**Bots to block:** Bytespider, Diffbot, img2dataset, Omgili (pure scrapers with no benefit)

### 2. sitemap.xml

Use Next.js built-in `sitemap.ts` in the app directory. List all public routes with lastmod dates and changefreq hints.

**Routes:**

- `/` — weekly
- `/docs` — weekly
- `/changelog` — weekly
- `/privacy` — monthly

### 3. Open Graph + Twitter Card Meta Tags

Every page needs `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. Critical for link previews on LinkedIn, Twitter, Discord, Slack — every channel already used for outreach.

**OG Image:** Create a 1200x630 branded image (app icon + tagline on dark background).

### 4. Per-Page Metadata

Each page needs its own `title` and `description` via Next.js Metadata API instead of inheriting the generic root description.

| Route        | Title                                     | Description                                                                                    |
| ------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `/`          | LOTA — LiDAR Over the Air                | Capture, stream, and export 3D spatial data from your iPhone's LiDAR sensor via NDI, TCP, UDP, OSC, and PLY. |
| `/docs`      | Documentation — LOTA                      | Setup guides, capture modes, streaming protocols, TouchDesigner integration, and 3D export workflows.         |
| `/changelog` | Changelog — LOTA                          | Version history and release notes for the LOTA iOS app.                                        |
| `/privacy`   | Privacy Policy — LOTA                     | Privacy policy for the LOTA iOS app. All processing on-device, no analytics or tracking.       |

---

## Tier 2 — High Value (Low-medium effort)

### 5. JSON-LD Structured Data

Add to root layout and specific pages:

- **SoftwareApplication** — iOS app: name, operatingSystem, applicationCategory, offers (free/paid)
- **Organization** — LOTA brand, logo, social profiles, contact
- **FAQPage** — On docs page (6 existing Q&As already written, just needs schema markup)
- **BreadcrumbList** — Navigation hierarchy for all pages

### 6. llms.txt + llms-full.txt

Place at site root (`/public/llms.txt` and `/public/llms-full.txt`). Format per llmstxt.org spec:

```markdown
# LOTA — LiDAR Over The Air

> iOS app that transforms iPhones into professional spatial capture tools.
> Stream real-time LiDAR data via NDI, TCP/UDP, OSC, and PLY.
> Export COLMAP datasets and train Gaussian Splats.

## Documentation
- [Getting Started](https://lidarota.app/docs): Device requirements, setup guide, capture modes
- [Streaming Protocols](https://lidarota.app/docs): NDI, TCP, UDP, OSC, PLY configuration
- [TouchDesigner Integration](https://lidarota.app/docs): NDI receiver setup, LOTAPoints.tox component
- [Export & 3D Pipelines](https://lidarota.app/docs): COLMAP, PLY export, Gaussian Splat workflows
- [Accessibility](https://lidarota.app/docs): VoiceOver, Dynamic Type, Switch Control, and more

## Product
- [Changelog](https://lidarota.app/changelog): Version history from v0.3.0 to v1.0.4
- [Privacy Policy](https://lidarota.app/privacy): On-device processing, no analytics or tracking
```

`llms-full.txt` inlines all page content so LLMs can consume without following links.

**Status:** No major AI platform officially confirms reading llms.txt yet, but adoption is growing (Cloudflare, Stripe, Vercel). Near-zero effort, forward-looking investment.

### 7. security.txt

Place at `/public/.well-known/security.txt`. IETF standard (RFC 9116), recommended by CISA.

```
Contact: mailto:privacy@lidarota.app
Expires: 2027-04-03T00:00:00.000Z
Preferred-Languages: en
```

---

## Tier 3 — Strategic (Medium-high effort, long-term traffic)

### 8. Blog / Content Hub

Pillar + cluster model targeting the niche LOTA occupies:

**Pillar pages** (1,200-1,800+ words each):

- "LiDAR Streaming for Live Visuals"
- "iPhone 3D Scanning: The Complete Guide"
- "Real-Time Point Cloud Workflows"

**Cluster articles** (800-1,200 words, 5-10 per pillar):

- TouchDesigner NDI Setup with iPhone LiDAR
- COLMAP vs Gaussian Splatting: When to Use Each
- OSC Tracking for Live Performance
- LiDAR vs Photogrammetry: Pros, Cons, and Use Cases
- How to Stream Depth Data from iPhone to Desktop
- Building Interactive Installations with LOTA
- Point Cloud Visualization in Resolume / vMix / OBS
- iPhone LiDAR Accuracy: What to Expect

**Why this works:** 92% of search volume lives in long-tail queries. LOTA's niche (LiDAR streaming for creative professionals) has low competition and high citation potential in AI search.

### 9. Generative Engine Optimization (GEO)

Structure all content for AI citation:

- Lead every section with a direct answer in the first 40-60 words
- Include concrete data points every 150-200 words (specs, FPS, latency benchmarks)
- Add FAQ sections with explicit Q&A pairs on every content page
- Create original research with proprietary data (e.g., "LiDAR Streaming Latency Benchmarks: NDI vs TCP vs UDP") — proprietary data is the #1 driver of AI citations
- Publish named frameworks (e.g., "The LOTA Spatial Capture Pipeline") — AI systems cite named concepts with clear attribution

### 10. AI-Referred Traffic Tracking

Track referrals from AI platforms in Vercel Analytics or GA4. Filter referrers:

- `perplexity.ai`
- `chatgpt.com` / `chat.openai.com`
- `claude.ai`
- `you.com`
- `phind.com`

---

## Tier 4 — Nice to Have

### 11. humans.txt

Credits the team. Low impact but signals a thoughtful web presence.

### 12. Canonical URLs

Prevent duplicate content issues as the site grows. Add `<link rel="canonical">` to every page.

### 13. apple-app-site-association

For iOS Universal Links once the app launches on the App Store. Lets links to lidarota.app open directly in the LOTA app.

---

## Key Strategic Insight

LOTA sits in a very specific technical niche (LiDAR streaming for creative professionals / TouchDesigner users). This is ideal for AI search optimization because:

- **Low competition** for long-tail queries ("iPhone LiDAR NDI streaming", "real-time point cloud TouchDesigner")
- **High citation potential** — AI systems need authoritative sources for niche technical topics
- **Content-rich documentation** already exists — it just needs proper markup and structure

The biggest wins are the low-effort technical fixes (Tiers 1-2), followed by a content strategy (Tier 3) that establishes LOTA as the authoritative source for iPhone LiDAR streaming workflows.
