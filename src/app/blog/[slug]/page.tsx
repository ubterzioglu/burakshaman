import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/lib/content";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <main className="section max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        Blog
      </p>
      <h1 className="mt-3 text-5xl font-semibold">{post.title}</h1>
      <p className="mt-5 text-xl leading-8 text-stone-600">{post.excerpt}</p>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>
      <article className="prose prose-stone mt-8 max-w-none text-lg leading-8">
        <p>{post.body}</p>
      </article>
    </main>
  );
}
