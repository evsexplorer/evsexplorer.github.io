import type { Language } from "../../translations";

export interface PostMeta {
  slug: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  /**
   * ISO date of the last substantive edit, from the optional `updated`
   * frontmatter key. Falls back to `date`, so an article nobody has touched
   * since publishing reports the two as equal.
   */
  updated: string;
  title: string;
  description: string;
  tags: string[];
  /** Languages this post is available in, sorted with `en` first. */
  langs: Language[];
}

export interface Post extends PostMeta {
  /** The language actually resolved (may differ from the request via fallback). */
  lang: Language;
  /** Markdown body (frontmatter stripped). */
  body: string;
}

interface RawPost {
  meta: Omit<PostMeta, "langs">;
  body: string;
}

const LANGS: Language[] = ["en", "de"];

/**
 * Parse a minimal YAML-style frontmatter block. Content is authored in-repo, so
 * we only support the few shapes we actually use: `key: value`, quoted values,
 * and inline tag arrays `[a, b, c]`. This keeps us off browser-hostile node
 * deps like gray-matter.
 */
function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim());
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((t) => unquote(t.trim()))
        .filter(Boolean);
    } else {
      data[key] = unquote(value);
    }
  }
  return { data, body: raw.slice(match[0].length) };
}

function unquote(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

// Files are named `<slug>.<lang>.md`, e.g. `ocpp-boot-notification.en.md`.
const files = import.meta.glob("./*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// slug -> lang -> RawPost
const bySlug = new Map<string, Map<Language, RawPost>>();

for (const [path, raw] of Object.entries(files)) {
  const name = path.replace(/^\.\//, "").replace(/\.md$/, "");
  const dot = name.lastIndexOf(".");
  const slug = name.slice(0, dot);
  const lang = name.slice(dot + 1) as Language;
  if (!LANGS.includes(lang)) continue;

  const { data, body } = parseFrontmatter(raw);
  const date = typeof data.date === "string" ? data.date : "";
  const meta = {
    slug,
    date,
    updated: typeof data.updated === "string" && data.updated ? data.updated : date,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    tags: Array.isArray(data.tags) ? data.tags : [],
  };

  if (!bySlug.has(slug)) bySlug.set(slug, new Map());
  bySlug.get(slug)!.set(lang, { meta, body: body.trim() });
}

function langsFor(variants: Map<Language, RawPost>): Language[] {
  return LANGS.filter((l) => variants.has(l));
}

/** Resolve a language for a post, falling back to the first available (en-first). */
function resolveLang(variants: Map<Language, RawPost>, want: Language): Language | undefined {
  if (variants.has(want)) return want;
  return langsFor(variants)[0];
}

/** All posts as list metadata for the requested language, newest first. */
export function listPosts(lang: Language): PostMeta[] {
  const posts: PostMeta[] = [];
  for (const variants of bySlug.values()) {
    const resolved = resolveLang(variants, lang);
    if (!resolved) continue;
    posts.push({ ...variants.get(resolved)!.meta, langs: langsFor(variants) });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** A single post resolved for the requested language (with en-first fallback). */
export function getPost(slug: string, lang: Language): Post | undefined {
  const variants = bySlug.get(slug);
  if (!variants) return undefined;
  const resolved = resolveLang(variants, lang);
  if (!resolved) return undefined;
  const raw = variants.get(resolved)!;
  return { ...raw.meta, langs: langsFor(variants), lang: resolved, body: raw.body };
}
