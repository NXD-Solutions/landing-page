/**
 * sync-decisions.ts
 *
 * Discovers all NXD platform decision pages by querying the Confluence
 * Decision Log space, extracts the "## AI Summary — Developer" section
 * from each, and writes .claude/rules/decisions.md grouped by classification.
 *
 * A page is treated as a decision page if its At a Glance table has a
 * recognised Status value (Accepted, Proposed, Draft, Deprecated).
 * Structural pages (folders, index pages, the template) are skipped.
 *
 * Usage:
 *   CONFLUENCE_EMAIL=you@example.com CONFLUENCE_API_TOKEN=xxx npx tsx scripts/sync-decisions.ts
 *
 * Exits with code 1 if any decision page is missing its AI Summary — Developer section.
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CONFLUENCE_BASE = "https://nordicexperiencedesign.atlassian.net";

/** Root page of the Decision Log — all descendants are scanned. */
const DECISION_LOG_ROOT = 17104898;

/**
 * Pages to skip regardless of content.
 * Add structural pages here (template, index pages) that would otherwise
 * be misidentified as decision pages.
 */
const EXCLUDED_PAGE_IDS = new Set([
  17268756, // 📋 Decision Template
]);

/** Status values that identify a page as a decision (not a folder/index). */
const KNOWN_STATUSES = new Set([
  "Accepted",
  "Proposed",
  "Draft",
  "Deprecated",
]);

const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../.claude/rules/decisions.md"
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Classification = "Standard" | "Architectural" | "Strategic" | "Unknown";

interface PageRef {
  id: number;
  title: string;
}

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

/**
 * Returns all pages that are descendants of DECISION_LOG_ROOT using CQL.
 * Paginates until all results are collected.
 */
async function fetchAllPageRefs(auth: string): Promise<PageRef[]> {
  const pages: PageRef[] = [];
  const limit = 50;
  let start = 0;

  while (true) {
    const cql = encodeURIComponent(`ancestor=${DECISION_LOG_ROOT} AND type=page`);
    const url = `${CONFLUENCE_BASE}/wiki/rest/api/content/search?cql=${cql}&limit=${limit}&start=${start}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(
        `HTTP ${res.status} fetching page list: ${await res.text()}`
      );
    }
    const data = (await res.json()) as {
      results: Array<{ id: string; title: string }>;
      size: number;
      totalSize: number;
    };

    for (const r of data.results) {
      pages.push({ id: parseInt(r.id, 10), title: r.title });
    }

    start += data.size;
    if (start >= data.totalSize) break;
  }

  return pages;
}

/** Fetches the storage-format body of a single page. */
async function fetchPageBody(id: number, auth: string): Promise<string> {
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
    body: { storage: { value: string } };
  };
  return data.body.storage.value;
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/**
 * Strips Confluence storage-format XML/HTML tags, leaving plain text.
 * Block tags are converted to newlines; everything else is stripped.
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
 * Returns empty string if no Status row is found.
 */
function extractStatus(body: string): string {
  const match = body.match(
    /<th[^>]*>\s*Status\s*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i
  );
  if (!match) return "";
  return stripTags(match[1]).trim();
}

/** Extracts the Classification value from the At a Glance table. */
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
 * In Confluence storage format headings become <h2> elements and list items
 * become <li> elements. Bullets starting with "_" are template placeholders
 * and are ignored.
 */
function extractDeveloperSummary(body: string): string[] {
  const headingPattern =
    /<h2[^>]*>[\s\S]*?AI\s+Summary\s*[—\-–]\s*Developer[\s\S]*?<\/h2>/i;
  const headingMatch = headingPattern.exec(body);
  if (!headingMatch) return [];

  const afterHeading = body.slice(headingMatch.index + headingMatch[0].length);

  // Collect content up to the next heading
  const nextHeading = /<h[1-6][^>]*>/i.exec(afterHeading);
  const section = nextHeading
    ? afterHeading.slice(0, nextHeading.index)
    : afterHeading;

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
    "Contains the actionable constraints extracted from each NXD platform",
    "decision. Read by AI coding assistants to enforce standards.",
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

  // Unknown classification at the end
  const unclassified = decisions.filter(
    (d) => !CLASSIFICATION_ORDER.includes(d.classification)
  );
  if (unclassified.length > 0) {
    lines.push("## Proposed / Unclassified", "");
    for (const d of unclassified) {
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

  console.log(`Discovering pages under Decision Log root (${DECISION_LOG_ROOT})…`);
  const allPages = await fetchAllPageRefs(auth);
  const candidates = allPages.filter((p) => !EXCLUDED_PAGE_IDS.has(p.id));
  console.log(
    `Found ${allPages.length} pages total, ${candidates.length} after exclusions. Fetching bodies…`
  );

  const bodyResults = await Promise.allSettled(
    candidates.map((p) =>
      fetchPageBody(p.id, auth).then((body) => ({ ...p, body }))
    )
  );

  const decisions: DecisionSummary[] = [];
  const missing: Array<{ id: number; title: string }> = [];
  const errors: string[] = [];

  for (const result of bodyResults) {
    if (result.status === "rejected") {
      errors.push(String(result.reason));
      continue;
    }

    const { id, title, body } = result.value;
    const status = extractStatus(body);

    // Skip pages that don't look like decision pages (no recognised Status)
    if (!KNOWN_STATUSES.has(status)) {
      console.log(`  SKIP [${id}] ${title} (no recognised status)`);
      continue;
    }

    const classification = extractClassification(body);
    const bullets = extractDeveloperSummary(body);

    if (bullets.length === 0) {
      missing.push({ id, title });
      console.warn(`  WARN [${id}] ${title} — missing AI Summary — Developer`);
    } else {
      console.log(`  OK   [${id}] ${title} (${classification}, ${status})`);
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
  console.log(`\nWrote ${OUTPUT_PATH} (${decisions.length} decisions)`);

  if (missing.length > 0) {
    console.error(
      `\n${missing.length} decision page(s) are missing ## AI Summary — Developer:`
    );
    missing.forEach(({ id, title }) => console.error(`  [${id}] ${title}`));
    process.exit(1);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
