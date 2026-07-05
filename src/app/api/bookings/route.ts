import { NextRequest, NextResponse } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { sendMail } from "@/lib/mail";
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
    const db = getDb();
    if (payload.startsAt) {
      const startsAt = new Date(payload.startsAt);
      const windowStart = new Date(startsAt.getTime() - 60 * 60 * 1000);
      const windowEnd = new Date(startsAt.getTime() + 60 * 60 * 1000);
      const conflict = await db.booking.findFirst({
        where: {
          serviceSlug: payload.serviceSlug,
          startsAt: { gte: windowStart, lte: windowEnd },
          status: { in: ["REQUESTED", "CONFIRMED"] },
        },
      });
      if (conflict) {
        return NextResponse.json(
          { error: "This booking window is already requested." },
          { status: 409 },
        );
      }
    }

    const booking = await db.booking.create({
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
    await sendMail({
      subject: `New booking request: ${payload.serviceName}`,
      text: `${payload.name} <${payload.email}>\n${payload.phone}\n${payload.startsAt ?? "No requested date"}\n\n${payload.message ?? ""}`,
    });
    return NextResponse.json({ ok: true, id: booking.id });
  } catch (error) {
    return jsonError(error, 400);
  }
}
