import type { Language, Translation } from "../translations";
import { listPosts } from "../content/blog";
import { formatDate } from "../lib/date";
import { localizeHref } from "../lib/router";

export function Blog({ t, language }: { t: Translation; language: Language }) {
  const posts = listPosts(language);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">
            {t.blog.title}
          </h1>
          <p className="mt-4 text-lg text-navy-600">{t.blog.subtitle}</p>
        </header>

        {posts.length === 0 ? (
          <p className="mt-16 text-center text-navy-500">{t.blog.empty}</p>
        ) : (
          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <a
                  href={localizeHref(`/blog/${post.slug}`, language)}
                  className="group flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
                >
                  <time
                    dateTime={post.date}
                    className="text-sm font-medium text-navy-500"
                  >
                    {formatDate(post.date, language)}
                  </time>
                  <h2 className="mt-2 text-xl font-semibold text-navy-900 transition-colors group-hover:text-brand-600">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-navy-600">{post.description}</p>
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
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                    {t.blog.readArticle}
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
