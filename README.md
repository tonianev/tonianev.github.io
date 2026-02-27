# tonianev.github.io

Personal website for Toni Anev: ML platform engineering leadership, selected case studies, and CV.

## Live Site

- https://tonianev.com

## Goals

- Clear positioning for recruiters, hiring managers, and technical peers.
- Human-readable content with machine-friendly metadata and structured data.
- Search and crawler friendliness across traditional bots and LLM systems.

## Stack

- Static HTML/CSS/JS
- No runtime framework or build step required

## Site Structure

- `index.html` - homepage and positioning
- `about.html` - background, approach, and stack
- `work.html` - case studies and outcomes
- `proof.html` - public proof artifacts and machine-readable references
- `CV.html` - resume/CV page and PDF preview
- `contact.html` - contact entry points
- `site.css` - shared styling
- `site.js` - interaction behavior
- `resume.pdf` - downloadable resume
- `resume-ats.txt` - ATS and parser-friendly resume text
- `profile.json` - machine-readable profile summary
- `experience.json` - machine-readable role highlights
- `skills.json` - machine-readable skills taxonomy

## Machine Readability

- `robots.txt` - crawler policy
- `sitemap.xml` - canonical URL index
- `llms.txt` - concise AI/LLM guidance
- `llms-full.txt` - expanded AI/LLM context
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
```

```bash
git status --short
```

## Deployment

This repository is published via GitHub Pages with `CNAME` configured for `tonianev.com`.
