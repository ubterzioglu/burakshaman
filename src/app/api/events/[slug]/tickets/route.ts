import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb, hasDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { sendMail } from "@/lib/mail";
import { ticketSchema } from "@/lib/validators";

function ticketCode(): string {
  // Short, human-readable, URL-safe ticket token (no ambiguous chars).
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(10);
  let code = "";
  for (let i = 0; i < 10; i++) code += alphabet[bytes[i] % alphabet.length];
  return `${code.slice(0, 5)}-${code.slice(5)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const payload = ticketSchema.parse(await request.json());

    if (!hasDatabase()) {
      return NextResponse.json(
        { error: "DATABASE_URL is required to issue tickets." },
        { status: 503 },
      );
    }

    const db = getDb();
    const event = await db.event.findUnique({ where: { slug } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const tickets = [];
    for (let i = 0; i < payload.quantity; i++) {
      const ticket = await db.ticket.create({
        data: {
          eventId: event.id,
          attendeeName: payload.name,
          attendeeEmail: payload.email.toLowerCase(),
          qrToken: ticketCode(),
          status: "valid",
        },
        select: { qrToken: true },
      });
      tickets.push(ticket.qrToken);
    }

    await sendMail({
      to: payload.email,
      subject: `Biletiniz — ${event.title}`,
      text: `Merhaba ${payload.name},\n\n${event.title} etkinliği için bilet kodlarınız:\n${tickets.join("\n")}\n\nShaman Life`,
    });

    return NextResponse.json({ ok: true, tickets });
  } catch (error) {
    return jsonError(error, 400);
  }
}
