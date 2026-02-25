# NXD Decision Log — Developer AI Reference

<!-- AUTO-GENERATED — do not edit by hand.
     Run `npm run sync-decisions` to regenerate from Confluence. -->

Contains the actionable constraints extracted from each NXD platform
decision. Read by AI coding assistants to enforce standards.

---

## Standards — How we implement (binding on all code)

**[Feature branches required for all code changes](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/24215554)** — Accepted
- Never commit directly to main — all changes via feature branch and pull request.
- Repos with AI coding assistants must have a CLAUDE.md at the root enforcing this policy.
- Automation-created branches (e.g. from GitHub Actions) must use the automated/<description> prefix.

---

## Architectural — What we adopt (binding technology choices)

**[Monorepo with three-tier folder structure adopted for platform development](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/25559041)** — Proposed
- Three tiers: apps/ (FE), services/ (BE), packages/ (shared). infra/ at root for cluster-level only.
- Service-specific infra, Dockerfile, OpenAPI spec, and tests live inside each service's folder.
- .claude/rules/ holds compiled decision constraints — update rules/decisions.md when decisions change.

**[Vitest and React Testing Library adopted as the front-end test stack](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/23658506)** — Accepted
- Vitest + React Testing Library is the standard FE test stack.
- Test files co-located with components, named ComponentName.test.tsx.
- Tests run in CI as a blocking gate before build — failing tests prevent deployment.

**[Figma adopted as the UI design tool](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/22675457)** — Accepted
- Figma is the source of truth for UI design. Follow the Figma design when implementing UI.
- Design tokens exported from Figma must map to tailwind.config values — not hardcoded.

**[React + Vite adopted for front-end development](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/21495810)** — Accepted
- React + Vite is the only permitted FE framework and build tool. TypeScript required.
- No exceptions without explicit Architecture approval.

**[Tailwind CSS adopted as the styling framework for FE Dev](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/21299211)** — Accepted
- Tailwind is the only styling mechanism — no inline styles, no CSS modules, no separate CSS files.
- Design tokens (colours, spacing, typography) must be defined in tailwind.config / @theme — never hardcoded.

**[PostgreSQL adopted as standard relational database](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/18022471)** — Draft
- PostgreSQL is the standard relational database. No other engine without formal exception.
- Use managed PostgreSQL-compatible services (e.g. CloudNativePG) for hosting.

**[Microservices architecture adopted](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17268818)** — Accepted
- Each service is independently deployable and owns its own data.
- No shared databases between services. Service contracts documented in OpenAPI.

**[OpenAI-compatible API standard adopted for all model integrations](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17236032)** — Accepted
- All AI model integrations must use /v1/chat/completions (OpenAI-compatible).
- No provider-specific SDKs that prevent model substitution without code changes.

**[Kubernetes chosen as sole deployment platform](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17236011)** — Accepted
- All services must be deployable on any Kubernetes-conformant cluster.
- No dependency on cloud-provider-specific managed services without an open-source substitute.

**[mTLS enforced for all inter-service communication](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17235990)** — Accepted
- All inter-service communication must use mutual TLS — no fallback to plain TLS or one-way TLS.
- Enforcement is via the service mesh. New services cannot be deployed without mTLS in place.

---

## Strategic — What and why (principles that constrain all decisions)

**[Per-tenant branding supported as a platform capability](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/22937601)** — Accepted
- Per-tenant branding (colour palette, logo, typography) must be runtime and data-driven.
- No per-tenant deployments. Use CSS custom properties or equivalent token layer at runtime.

**[All persistent data must be encrypted at rest](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/18022570)** — Proposed
- All persistent storage must have encryption at rest enabled — databases, object store, caches, vector stores.
- This is a non-negotiable deployment requirement — encryption cannot be added to an existing unencrypted store without recreation.

**[Platform scales horizontally without limit](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17301533)** — Accepted
- All services must be stateless — no local state, no in-memory sessions.
- Externalise all state to a shared, scalable store (e.g. Redis, PostgreSQL).

**[Customers own their prompts and outputs](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17268796)** — Accepted
- NXD claims no IP rights over customer prompts or outputs.
- Prompt logs must be treated as personal data — anonymisation or redaction required before storage.

**[All EU customer data must remain within EU boundaries](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17268775)** — Accepted
- All EU customer data must be stored and processed exclusively on EU infrastructure.
- No EU data may route through or be stored on non-EU infrastructure, even temporarily.

**[No vendor lock-in permitted](https://nordicexperiencedesign.atlassian.net/wiki/spaces/NSME/pages/17170455)** — Accepted
- No unsubstitutable dependency on a single vendor is permitted.
- For every proprietary service used, an open-source alternative must exist and be feasible to switch to.

---
