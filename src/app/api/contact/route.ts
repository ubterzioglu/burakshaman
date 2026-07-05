import { NextRequest, NextResponse } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { sendMail } from "@/lib/mail";
import { contactSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const payload = contactSchema.parse(await request.json());
    if (!hasDatabase()) {
      return NextResponse.json(
        { error: "DATABASE_URL is required to store contact messages." },
        { status: 503 },
      );
    }
    const message = await getDb().contactMessage.create({ data: payload });
    await sendMail({
      subject: `Shaman Life contact: ${payload.subject ?? payload.name}`,
      text: `${payload.name} <${payload.email}>\n${payload.phone ?? ""}\n\n${payload.message}`,
    });
    return NextResponse.json({ ok: true, id: message.id });
  } catch (error) {
    return jsonError(error, 400);
  }
}
