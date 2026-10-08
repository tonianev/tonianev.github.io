# tonianev.github.io

[![Live site](https://img.shields.io/badge/live-tonianev.com-141413)](https://tonianev.com)
[![Stack](https://img.shields.io/badge/stack-static_html%2Fcss%2Fjs-a8401f)](./site.css)
[![Machine readable](https://img.shields.io/badge/llms.txt-available-5c5850)](./llms.txt)
[![Profile JSON](https://img.shields.io/badge/profile.json-published-5c5850)](./profile.json)

Personal website for Toni Anev: AI platform engineering leadership, selected case studies, and contact-driven hiring conversations.

## Design

Editorial, type-led, near-monochrome ("Ledger"). Set in the native Lucida Grande stack — the same typeface as the resume — with no webfonts, no framework, no tracking, and no build step. Structure comes from the type hierarchy, 1px hairline rules, and whitespace on an 8px rhythm; one iron-red accent does all the color work. Dark and light themes follow `prefers-color-scheme`. Press `g` (or the `[grid]` footer button) to see the baseline grid.

## Site map

```mermaid
flowchart TD
    A["Homepage"] --> B["Work"]
    A --> C["CV / career summary"]
    A --> D["Contact"]
    A --> E["Agent Soul Kit"]
    B --> F["Case studies + earlier career"]
    C --> D
    A --> G["Machine-readable layer"]
    G --> H["profile.json / experience.json / skills.json"]
    G --> I["llms.txt / llms-full.txt / sitemap.xml"]
    E --> J["Interactive agent playground"]
```

## Live Site

- https://tonianev.com

## Goals

- Clear positioning for recruiters, hiring managers, and technical peers.
- Human-readable content with machine-friendly metadata and structured data.
- Search and crawler friendliness across traditional bots and LLM systems.
- Full resume access routed through direct contact; CV.html carries the public career summary.

## Stack

- Static HTML/CSS/JS
- No runtime framework, build step, or external requests (fonts included)

## Site Structure

- `index.html` - homepage: hero, figures band, about, selected work, proof, contact
- `work.html` - case studies (Sanofi, Petco, Loblaw), earlier career, education
- `CV.html` - public career summary; full resume on request
- `agent-soul-kit.html` - agent soul kit concept and interactive playground
- `about.html` / `contact.html` / `proof.html` - meta-refresh redirects to homepage anchors
- `site.css` - the "Ledger" design system (tokens, rules, print stylesheet)
- `site.js` - theme sync, nav marking, grid overlay, playground logic
- `agent-soul-kit/` - standalone scaffold for a portable soul/memory/posture repository
- `profile.json` / `experience.json` / `skills.json` - machine-readable career data
- `artifacts/` - ML platform templates (RFC, runbook, readiness scorecards, principles)

## Machine Readability

- `robots.txt` - crawler policy
- `sitemap.xml` - canonical URL index
- `llms.txt` / `llms-full.txt` - AI/LLM guidance and expanded context
- `humans.txt` - human authorship and stack metadata
- `.well-known/security.txt` - responsible disclosure contact
- `site.webmanifest` - installable web app metadata
- JSON-LD schema in page `<head>` sections

## Local Development

From repository root:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Quality Checks

```bash
npx --yes htmlhint@latest "./*.html"
node --check site.js
```

CI (`.github/workflows/site-quality.yml`) runs htmlhint, a JS syntax check, and a lychee link check on every push and pull request.

## Deployment

This repository is published via GitHub Pages with `CNAME` configured for `tonianev.com`.
