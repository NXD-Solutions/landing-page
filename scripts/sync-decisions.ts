/**
 * sync-decisions.ts
 *
 * Fetches all NXD platform decision pages from Confluence, extracts the
 * "## AI Summary — Developer" section from each, and writes
 * .claude/rules/decisions.md grouped by classification.
 *
 * Usage:
 *   CONFLUENCE_EMAIL=you@example.com CONFLUENCE_API_TOKEN=xxx npx tsx scripts/sync-decisions.ts
 *
 * Exits with code 1 if any page is missing its AI Summary — Developer section.
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CONFLUENCE_BASE = "https://nordicexperiencedesign.atlassian.net";

// All decision page IDs in the NXD decision log
const DECISION_PAGE_IDS = [
  24215554, // Feature branches required
  21495810, // React + Vite adopted
  21299211, // Tailwind CSS adopted
  23658506, // Vitest + RTL adopted
  22675457, // Figma adopted
  17236011, // Kubernetes
  17268818, // Microservices
  17236032, // OpenAI-compatible API
  18022471, // PostgreSQL
  17235990, // mTLS
  17170455, // No vendor lock-in
  17301533, // Platform scales horizontally
  18022570, // All persistent data encrypted at rest
  17268775, // EU data must remain in EU
  17268796, // Customers own prompts and outputs
  22937601, // Per-tenant branding
  25559041, // Monorepo structure
];

const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../.claude/rules/decisions.md"
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Classification = "Standard" | "Architectural" | "Strategic" | "Unknown";

interface DecisionSummary {
  id: number;
  title: string;
  status: string;
  classification: Classification;
  bullets: string[];
}

// ---------------------------------------------------------------------------
// Confluence API helpers
// ---------------------------------------------------------------------------

function getAuth(): string {
  const email = process.env.CONFLUENCE_EMAIL;
  const token = process.env.CONFLUENCE_API_TOKEN;
  if (!email || !token) {
    console.error(
      "Error: CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must be set."
    );
    process.exit(1);
  }
  return Buffer.from(`${email}:${token}`).toString("base64");
}

async function fetchPage(
  id: number,
  auth: string
): Promise<{ title: string; body: string }> {
  const url = `${CONFLUENCE_BASE}/wiki/rest/api/content/${id}?expand=body.storage`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching page ${id}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    title: string;
    body: { storage: { value: string } };
  };
  return { title: data.title, body: data.body.storage.value };
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/**
 * Strips Confluence storage-format XML/HTML tags, leaving plain text.
 * Handles <br/>, <p>, block tags as newlines; everything else stripped.
 */
function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|li|tr|th|td|h[1-6]|div|ul|ol)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Extracts the Status value from the At a Glance table.
 * Looks for a <td> whose previous row label contains "Status".
 */
function extractStatus(body: string): string {
  // The At a Glance table has rows like: <th>Status</th><td>Accepted</td>
  const match = body.match(
    /<th[^>]*>\s*Status\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i
  );
  if (!match) return "Unknown";
  return stripTags(match[1]).trim();
}

/**
 * Extracts the Classification value from the At a Glance table.
 */
function extractClassification(body: string): Classification {
  const match = body.match(
    /<th[^>]*>\s*Classification\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i
  );
  if (!match) return "Unknown";
  const raw = stripTags(match[1]).trim();
  if (raw.includes("Standard")) return "Standard";
  if (raw.includes("Architectural")) return "Architectural";
  if (raw.includes("Strategic")) return "Strategic";
  return "Unknown";
}

/**
 * Extracts bullet points from the "## AI Summary — Developer" section.
 *
 * In Confluence storage format, a markdown-style heading becomes an <h2>
 * and list items become <li> elements.  We look for the heading and collect
 * <li> text until the next heading or end of document.
 */
function extractDeveloperSummary(body: string): string[] {
  // Locate the AI Summary — Developer heading (h2)
  const headingPattern =
    /<h2[^>]*>[\s\S]*?AI\s+Summary\s*[—\-–]\s*Developer[\s\S]*?<\/h2>/i;
  const headingMatch = headingPattern.exec(body);
  if (!headingMatch) return [];

  const afterHeading = body.slice(headingMatch.index + headingMatch[0].length);

  // Take content up to the next heading (h1–h6) or end of document
  const nextHeading = /<h[1-6][^>]*>/i.exec(afterHeading);
  const section = nextHeading
    ? afterHeading.slice(0, nextHeading.index)
    : afterHeading;

  // Extract <li> items
  const bullets: string[] = [];
  const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch: RegExpExecArray | null;
  while ((liMatch = liPattern.exec(section)) !== null) {
    const text = stripTags(liMatch[1]).trim().replace(/\s+/g, " ");
    if (text && !text.startsWith("_")) {
      bullets.push(text);
    }
  }
  return bullets;
}

// ---------------------------------------------------------------------------
// Output formatter
// ---------------------------------------------------------------------------

const CLASSIFICATION_ORDER: Classification[] = [
  "Standard",
  "Architectural",
  "Strategic",
];

function buildMarkdown(decisions: DecisionSummary[]): string {
  const lines: string[] = [
    "# NXD Decision Log — Developer AI Reference",
    "",
    "<!-- AUTO-GENERATED — do not edit by hand.",
    "     Run `npm run sync-decisions` to regenerate from Confluence. -->",
    "",
    "Contains the actionable constraints extracted from each accepted NXD",
    "platform decision. Read by AI coding assistants to enforce standards.",
    "",
    "---",
    "",
  ];

  for (const classification of CLASSIFICATION_ORDER) {
    const group = decisions.filter((d) => d.classification === classification);
    if (group.length === 0) continue;

    const sectionLabel =
      classification === "Standard"
        ? "Standards — How we implement (binding on all code)"
        : classification === "Architectural"
        ? "Architectural — What we adopt (binding technology choices)"
        : "Strategic — What and why (principles that constrain all decisions)";

    lines.push(`## ${sectionLabel}`, "");

    for (const d of group) {
      lines.push(`**${d.title}** (${d.id}) — ${d.status}`);
      for (const bullet of d.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }

    lines.push("---", "");
  }

  // Proposed / Unknown at the end
  const other = decisions.filter(
    (d) => !CLASSIFICATION_ORDER.includes(d.classification)
  );
  if (other.length > 0) {
    lines.push("## Proposed / Unclassified", "");
    for (const d of other) {
      lines.push(`**${d.title}** (${d.id}) — ${d.status}`);
      for (const bullet of d.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }
    lines.push("---", "");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const auth = getAuth();

  console.log(`Fetching ${DECISION_PAGE_IDS.length} decision pages…`);

  const results = await Promise.allSettled(
    DECISION_PAGE_IDS.map((id) => fetchPage(id, auth).then((page) => ({ id, ...page })))
  );

  const decisions: DecisionSummary[] = [];
  const missing: number[] = [];
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "rejected") {
      errors.push(String(result.reason));
      continue;
    }

    const { id, title, body } = result.value;
    const bullets = extractDeveloperSummary(body);
    const status = extractStatus(body);
    const classification = extractClassification(body);

    if (bullets.length === 0) {
      missing.push(id);
      console.warn(`  MISSING AI Summary — Developer: [${id}] ${title}`);
    } else {
      console.log(`  OK  [${id}] ${title} (${classification}, ${status})`);
    }

    decisions.push({ id, title, status, classification, bullets });
  }

  if (errors.length > 0) {
    console.error("\nErrors fetching pages:");
    errors.forEach((e) => console.error("  " + e));
    process.exit(1);
  }

  const markdown = buildMarkdown(decisions);
  writeFileSync(OUTPUT_PATH, markdown, "utf-8");
  console.log(`\nWrote ${OUTPUT_PATH}`);

  if (missing.length > 0) {
    console.error(
      `\n${missing.length} page(s) are missing ## AI Summary — Developer sections:`
    );
    missing.forEach((id) => console.error(`  ${id}`));
    process.exit(1);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
