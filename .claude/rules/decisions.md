# NXD Decision Log — Compiled Reference

Compiled from the NSME Decision Log. Fetch individual pages by ID for full detail.
Update this file when decisions change status or content.

---

## Standards — How we implement (binding on all code)

**Feature branches required** (24215554) — Accepted
- Never commit directly to main. All changes via feature branch + pull request.
- AI assistants must have a CLAUDE.md in the repo root enforcing this.

---

## Architectural — What we adopt (binding technology choices)

**React + Vite** (21495810) — Accepted
- Standard FE framework and build tool. TypeScript required. No exceptions without Architecture approval.

**Tailwind CSS** (21299211) — Accepted
- Only styling mechanism. No inline styles, no CSS modules, no separate CSS files.
- Design tokens in tailwind.config / @theme — never hardcoded.

**Vitest + React Testing Library** (23658506) — Accepted
- Standard FE test stack. Tests co-located with components, named ComponentName.test.tsx.
- Tests run in CI as a hard gate before build — failing tests block deployment.

**Figma** (22675457) — Accepted
- Source of truth for UI design. Design tokens must map to tailwind.config values.

**Kubernetes** (17236011) — Accepted
- Sole deployment platform. All services must run on any Kubernetes-conformant cluster.
- No cloud-provider-specific managed services without open-source substitute.

**Microservices** (17268818) — Accepted
- Each service independently deployable, independently scalable, owns its own data.
- No shared databases between services. Contracts documented in OpenAPI.

**OpenAI-compatible API** (17236032) — Accepted
- All AI model integrations via /v1/chat/completions. No provider-specific SDKs that prevent substitution.

**PostgreSQL** (18022471) — Draft
- Standard relational database. Use managed PostgreSQL-compatible services (e.g. CloudNativePG) for hosting.

**mTLS** (17235990) — Accepted
- All inter-service communication mutually authenticated. Enforced via service mesh. No fallback to plain TLS.

---

## Strategic — What and why (principles that constrain all decisions below)

**No vendor lock-in** (17170455) — Accepted
- No unsubstitutable dependency on a single vendor. Open-source alternative must exist and be feasible to switch to.

**Platform scales horizontally** (17301533) — Accepted
- Every component must be stateless or externalise state. No architecture pattern that caps capacity.

**All persistent data encrypted at rest** (18022570) — Proposed
- All storage (databases, object store, caches, vector stores) must have encryption at rest enabled.

**EU data must remain in EU** (17268775) — Accepted
- All EU customer data stored and processed exclusively on EU infrastructure. No exceptions, even temporarily.

**Customers own prompts and outputs** (17268796) — Accepted
- NXD claims no IP rights over customer inputs or outputs. Must be reflected in ToS and DPAs.

**Per-tenant branding** (22937601) — Accepted
- Platform must support per-tenant colour palette, logo, typography. Runtime and data-driven — no per-tenant deployments.

---

## Proposed (not yet Accepted — treat as direction, not binding)

**Monorepo structure** (25559041) — Proposed
- Three tiers: apps/ (FE), services/ (BE), packages/ (shared). infra/ at root for cluster-level only.
- Service-specific infra, Dockerfile, OpenAPI spec, and tests live inside each service's folder.
