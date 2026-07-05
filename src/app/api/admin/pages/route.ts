import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const pages = await getDb().page.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  try {
    const payload = (await request.json()) as {
      slug: string;
      title: string;
      body: string;
      status?: "DRAFT" | "PUBLISHED";
    };
    const page = await getDb().page.upsert({
      where: { slug: payload.slug },
      create: { ...payload, status: payload.status ?? "PUBLISHED" },
      update: {
        title: payload.title,
        body: payload.body,
        status: payload.status ?? "PUBLISHED",
      },
    });
    return NextResponse.json({ page });
  } catch (error) {
    return jsonError(error, 400);
  }
}
