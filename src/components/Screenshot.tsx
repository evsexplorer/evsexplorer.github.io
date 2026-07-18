interface ScreenshotProps {
  src: string;
  alt: string;
  eager?: boolean;
}

/** Product screenshot inside a minimal browser-window frame. */
export function Screenshot({ src, alt, eager }: ScreenshotProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-navy-200 bg-white shadow-xl shadow-navy-900/10">
      <div className="flex items-center gap-1.5 border-b border-navy-100 bg-navy-50 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-navy-200" />
        <span className="size-2.5 rounded-full bg-navy-200" />
        <span className="size-2.5 rounded-full bg-navy-200" />
      </div>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className="block w-full"
        width={2880}
        height={1800}
      />
    </figure>
  );
}
