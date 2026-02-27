# Resume Fix Checklist (2026)

## Why this matters

Current DOCX extraction indicates duplicated content blocks and stale document metadata, which can reduce ATS parsing quality and trust signals.

## Immediate Fixes

1. Use the ATS source text as the canonical baseline:
   - `resume/Toni_Anev_Resume_ATS_2026.md`
2. Rebuild DOCX in single-column layout (no floating text boxes, no multi-column containers).
3. Ensure these fields are clean in document properties:
   - Title: `Toni Anev Resume 2026`
   - Author: `Toni Anev`
   - Subject: `Machine Learning Engineering Lead Resume`
4. Keep role dates and metrics identical across resume, website, and LinkedIn.
5. Keep projects current (replace legacy typoed repo links with flagship repositories).

## ATS Layout Rules

- One column only
- Standard headings (`Summary`, `Experience`, `Skills`, `Education`)
- Simple bullets and plain section separators
- No text boxes, icons, tables for core content
- Consistent date format (`Mon YYYY - Mon YYYY`)

## Final QA Before Sending

- Parse with plain-text export and verify no duplicated sections.
- Confirm all links are live and typo-free.
- Confirm PDF and DOCX show identical wording and metrics.
- Save filename as `Toni_Anev_Resume_2026_ATS.docx`.
