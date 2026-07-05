import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, hashPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { authSchema } from "@/lib/validators";

async function readPayload(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return request.json();
  return Object.fromEntries((await request.formData()).entries());
}

export async function POST(request: NextRequest) {
  try {
    const payload = authSchema.parse(await readPayload(request));
    const db = getDb();
    const user = await db.user.create({
      data: {
        email: payload.email.toLowerCase(),
        name: payload.name ?? payload.email,
        phone: payload.phone,
        passwordHash: await hashPassword(payload.password),
      },
    });
    await createSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return NextResponse.redirect(new URL("/account", request.url), 303);
  } catch (error) {
    return jsonError(error, 400);
  }
}
