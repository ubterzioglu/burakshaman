/**
 * Renders sanitized content HTML (recovered from the WordPress cache). The body
 * is already attribute-stripped to a safe tag allowlist during extraction, and
 * legacy absolute shamanlife.com links are rewritten to same-origin paths.
 */
export function HtmlContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const normalized = (html ?? "").replace(
    /https?:\/\/(?:www\.)?shamanlife\.com/gi,
    "",
  );
  return (
    <article
      className={
        className ??
        "prose prose-stone mt-8 max-w-none leading-8 prose-headings:font-semibold prose-a:text-amber-700 prose-img:rounded-lg"
      }
      dangerouslySetInnerHTML={{ __html: normalized }}
    />
  );
}
