import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, verifyPassword } from "@/lib/auth";
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
    const payload = authSchema
      .pick({ email: true, password: true })
      .parse(await readPayload(request));
    const db = getDb();
    const user = await db.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

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
