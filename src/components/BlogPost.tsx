import type { Language, Translation } from "../translations";
import { getPost } from "../content/blog";
import { formatDate } from "../lib/date";
import { localizeHref } from "../lib/router";
import { Markdown } from "./Markdown";

const langNames: Record<Language, string> = { en: "English", de: "Deutsch" };

export function BlogPost({
  t,
  language,
  slug,
}: {
  t: Translation;
  language: Language;
  slug: string;
}) {
  const post = getPost(slug, language);

  if (!post) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <a
            href={localizeHref("/blog", language)}
            className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
          >
            ← {t.blog.backToList}
          </a>
          <h1 className="mt-6 text-3xl font-bold text-navy-900">
            {t.blog.notFoundTitle}
          </h1>
          <p className="mt-2 text-navy-600">{t.blog.notFoundText}</p>
        </div>
      </main>
    );
  }

  // Post exists but not in the requested language: tell the reader which
  // language they are actually seeing.
  const fallback = post.lang !== language;

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <a
          href="#blog"
          className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
        >
          ← {t.blog.backToList}
        </a>

        <header className="mt-6">
          <time dateTime={post.date} className="text-sm font-medium text-navy-500">
            {formatDate(post.date, post.lang)}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          {fallback && (
            <p className="mt-4 rounded-md bg-navy-50 px-3 py-2 text-sm text-navy-600">
              {t.blog.translationNote}: {langNames[post.lang]}
            </p>
          )}
        </header>

        <hr className="my-8 border-navy-100" />

        <Markdown lang={language}>{post.body}</Markdown>
      </article>
    </main>
  );
}
