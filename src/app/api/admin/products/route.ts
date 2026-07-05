import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const products = await getDb().product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const payload = (await request.json()) as {
      slug: string;
      name: string;
      description: string;
      priceCents: number;
      image?: string;
      digital?: boolean;
      active?: boolean;
    };
    const product = await getDb().product.upsert({
      where: { slug: payload.slug },
      create: {
        slug: payload.slug,
        name: payload.name,
        description: payload.description,
        priceCents: Number(payload.priceCents),
        image: payload.image,
        digital: Boolean(payload.digital),
        active: payload.active ?? true,
      },
      update: {
        name: payload.name,
        description: payload.description,
        priceCents: Number(payload.priceCents),
        image: payload.image,
        digital: Boolean(payload.digital),
        active: payload.active ?? true,
      },
    });
    return NextResponse.json({ product });
  } catch (error) {
    return jsonError(error, 400);
  }
}
