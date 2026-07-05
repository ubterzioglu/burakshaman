import { NextRequest, NextResponse } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { bookingSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const payload = bookingSchema.parse(await request.json());
    if (!hasDatabase()) {
      return NextResponse.json(
        { error: "DATABASE_URL is required to store bookings." },
        { status: 503 },
      );
    }
    const booking = await getDb().booking.create({
      data: {
        serviceSlug: payload.serviceSlug,
        serviceName: payload.serviceName,
        name: payload.name,
        email: payload.email.toLowerCase(),
        phone: payload.phone,
        message: payload.message,
        startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
      },
    });
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (error) {
    return jsonError(error, 400);
  }
}
