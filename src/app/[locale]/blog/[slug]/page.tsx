import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/lib/content";
import { getPost } from "@/lib/repository";
import { HtmlContent } from "@/components/html-content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { absoluteUrl, buildMetadata, excerptText, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return buildMetadata({
    title: post.title,
    description: excerptText(post.excerpt || post.body),
    path: `/${locale}/blog/${slug}`,
    keywords: [post.title, "blog", "coaching"],
    image: post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  const dict = getDictionary(locale);
  const post = await getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: excerptText(post.excerpt || post.body),
    image: [absoluteUrl(post.image)],
    mainEntityOfPage: absoluteUrl(`/${locale}/blog/${slug}`),
    author: {
      "@type": "Person",
      name: "Burak Akcakanat",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Shaman Life",
      url: siteUrl,
    },
  };

  return (
    <main className="section max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        {dict.sections.blog}
      </p>
      <h1 className="mt-3 text-5xl font-semibold">{post.title}</h1>
      {post.excerpt && (
        <p className="mt-5 text-xl leading-8 text-stone-600">{post.excerpt}</p>
      )}
      {post.image && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <HtmlContent html={post.body} className="prose prose-stone mt-8 max-w-none text-lg leading-8 prose-a:text-amber-700 prose-img:rounded-lg" />
    </main>
  );
}
