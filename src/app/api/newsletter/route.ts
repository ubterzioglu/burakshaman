import { NextRequest, NextResponse } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const payload = newsletterSchema.parse(await request.json());
    if (!hasDatabase()) {
      return NextResponse.json(
        { error: "DATABASE_URL is required to store subscribers." },
        { status: 503 },
      );
    }
    const subscriber = await getDb().newsletterSubscriber.upsert({
      where: { email: payload.email.toLowerCase() },
      create: { ...payload, email: payload.email.toLowerCase() },
      update: { name: payload.name, locale: payload.locale },
    });
    return NextResponse.json({ ok: true, id: subscriber.id });
  } catch (error) {
    return jsonError(error, 400);
  }
}
