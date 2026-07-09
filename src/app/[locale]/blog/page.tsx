import Image from "next/image";
import Link from "next/link";
import { listPosts } from "@/lib/repository";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <main className="section">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
        Blog
      </p>
      <h1 className="mt-3 text-5xl font-semibold">Writing and Notes</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="relative aspect-[4/3]">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
