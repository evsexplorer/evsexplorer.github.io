import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Language } from "../translations";
import { localizeHref } from "../lib/router";

/**
 * Renders trusted, in-repo Markdown as an article body. Styling comes from the
 * Tailwind typography plugin (`prose`), tuned to the EVSExplorer palette.
 * Outbound links open in a new tab, and language-neutral in-app links
 * (`/blog/...`) are localized to the current language.
 */
export function Markdown({ children, lang }: { children: string; lang: Language }) {
  return (
    <div className="prose prose-navy max-w-none prose-headings:text-navy-900 prose-headings:font-semibold prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-code:text-navy-800 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-navy-900 prose-pre:text-navy-50 prose-pre:shadow-sm prose-strong:text-navy-900 [&_pre_code]:text-navy-50 [&_pre_code]:font-normal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, href, children, ...props }) => {
            void node;
            const external = !!href && /^https?:\/\//.test(href);
            const resolved = href && href.startsWith("/") ? localizeHref(href, lang) : href;
            return (
              <a
                href={resolved}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
          // Let wide tables scroll inside their own box instead of forcing the
          // whole article (and page) to scroll horizontally on narrow screens.
          table: ({ node, ...props }) => {
            void node;
            return (
              <div className="overflow-x-auto">
                <table {...props} />
              </div>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
