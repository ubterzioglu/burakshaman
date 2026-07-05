import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const events = await getDb().event.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  try {
    const payload = (await request.json()) as {
      slug: string;
      title: string;
      description: string;
      startsAt?: string;
      location?: string;
      image?: string;
      status?: "DRAFT" | "PUBLISHED";
    };
    const event = await getDb().event.upsert({
      where: { slug: payload.slug },
      create: {
        slug: payload.slug,
        title: payload.title,
        description: payload.description,
        startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
        location: payload.location,
        image: payload.image,
        status: payload.status ?? "PUBLISHED",
      },
      update: {
        title: payload.title,
        description: payload.description,
        startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
        location: payload.location,
        image: payload.image,
        status: payload.status ?? "PUBLISHED",
      },
    });
    return NextResponse.json({ event });
  } catch (error) {
    return jsonError(error, 400);
  }
}
