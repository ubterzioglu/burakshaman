import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const posts = await getDb().post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  try {
    const payload = (await request.json()) as {
      slug: string;
      title: string;
      excerpt: string;
      body: string;
      image?: string;
      status?: "DRAFT" | "PUBLISHED";
    };
    const post = await getDb().post.upsert({
      where: { slug: payload.slug },
      create: {
        ...payload,
        status: payload.status ?? "PUBLISHED",
        publishedAt: payload.status === "DRAFT" ? null : new Date(),
      },
      update: {
        title: payload.title,
        excerpt: payload.excerpt,
        body: payload.body,
        image: payload.image,
        status: payload.status ?? "PUBLISHED",
      },
    });
    return NextResponse.json({ post });
  } catch (error) {
    return jsonError(error, 400);
  }
}
