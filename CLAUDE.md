# Manager Hub — Landing Page

This is the public-facing marketing landing page for **Manager Hub** by NXD Solutions.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4
**Deployed:** GitHub Pages via GitHub Actions (`main` branch → `dist/`)
**Decision log:** https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17104898/Decision+Log

---

## Git workflow

See `.claude/rules/git-workflow.md` for NXD git standards.

### Testing a PR on GitHub Pages
GitHub Pages supports one deployment at a time. To preview a feature branch live:

1. Go to **Actions** → "Deploy to GitHub Pages" in the GitHub UI
2. Click **Run workflow** and select the feature branch
3. The feature branch is deployed — replacing the `main` deployment temporarily
4. Review and approve the PR
5. Merge → `main` auto-deploys and production is restored

> One PR at a time can be live-previewed this way. Do not trigger a branch
> deployment unless the PR is ready for review — it takes production offline.
>
> This is a temporary approach until Azure environments are available.

---

## Design tokens

Defined in `src/index.css` under `@theme`. Do not hardcode colours or spacing — use the token names:

| Token | Value | Tailwind class |
|---|---|---|
| `--color-primary` | `#5C7A5C` | `bg-primary`, `text-primary` |
| `--color-primary-light` | `#EAF1EA` | `bg-primary-light` |
| `--color-accent` | `#C9956A` | `bg-accent`, `text-accent` |
| `--color-canvas` | `#FAF7F2` | `bg-canvas` |
| `--color-ink` | `#1E2922` | `text-ink` |
| `--color-muted` | `#6B7068` | `text-muted` |
| `--color-surface` | `#FFFFFF` | `bg-surface` |
| `--color-border` | `#E4DDD4` | `border-border` |

---

## Project structure

```
src/
  components/   # One file per section component
  App.tsx       # Composes all sections
  index.css     # Tailwind import + @theme tokens
  main.tsx      # React entry point
```

### Rules files (`.claude/rules/`)

Every rules file must have a matching [Confluence page](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/28442625). Changes to a rules file must include an update to the corresponding Confluence page in the same PR.

### Repo layout

This repo lives at `C:\Users\sixfu\IdeaProjects\landing-page\`. The `.github` directory is a **sibling**, not inside this repo:

```
IdeaProjects/
  .github/          # GitHub org-level config — workflows, templates
  landing-page/     # This repo
```

When looking for GitHub Actions workflows or issue templates, look in `C:\Users\sixfu\IdeaProjects\.github\`, not inside `landing-page`.

---

## Keeping AI context up to date

`.claude/rules/decisions-developer.md` is auto-generated from the NXD Decision Log in Confluence. It contains the binding constraints AI assistants must follow.

To regenerate after decisions are added or updated:

1. Go to **Actions** → "Sync decisions from Confluence"
2. Click **Run workflow** → **Run workflow**
3. Merge the PR that is automatically opened

Do not edit `decisions-developer.md` by hand — changes will be overwritten on the next sync.

---

## Key decisions

- React + Vite is the front-end standard — no framework exceptions without Architecture approval
- Tailwind CSS is the only styling mechanism — no inline styles, no CSS modules, no separate CSS files
- Design tokens live in `tailwind.config` / `@theme` — not hardcoded
- Figma is the source of truth for design once a design file exists
- Per-tenant branding must be supported via CSS custom properties at runtime — no per-tenant deployments
