# Manager Hub — Landing Page

Public-facing marketing landing page for **Manager Hub** by NXD Solutions.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4
**Live site:** deployed to GitHub Pages from the `main` branch

---

## Prerequisites

- Node.js 20+
- npm

---

## Local development

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm test          # run tests (Vitest + Testing Library)
npm run lint      # run ESLint
```

---

## Git workflow

All changes must go through a feature branch and pull request — direct commits to `main` are not permitted. This applies to all contributors, human and AI alike. See decision [#24215554](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/24215554/Feature+branches+required+for+all+code+changes) for the rationale.

| Type | Branch pattern | Example |
|---|---|---|
| New feature | `feature/<short-description>` | `feature/hero-section` |
| Bug fix | `fix/<short-description>` | `fix/nav-mobile-overflow` |
| Chore / tooling | `chore/<short-description>` | `chore/update-tailwind` |

1. Branch from `main`
2. Commit your changes
3. Open a pull request against `main`
4. Merge after review — `main` deploys automatically

> **PR preview:** to test a branch on the live GitHub Pages environment, go to
> Actions → "Deploy to GitHub Pages" → Run workflow → select your branch.
> This temporarily replaces the production deployment, so only use it when the
> PR is ready for review.

---

## Design tokens

Colours and spacing are defined as CSS custom properties in `src/index.css`. Do not hardcode values — use the Tailwind token classes (e.g. `bg-primary`, `text-accent`). See `CLAUDE.md` for the full token reference.

---

## Further reading

- [Decision Log](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17104898/Decision+Log) — architecture and process decisions
- `CLAUDE.md` — detailed conventions for this repository (also read by AI assistants)
