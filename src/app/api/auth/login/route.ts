import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { createSessionCookie, hashPassword, verifyPassword } from "@/lib/auth";
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
    let user = await db.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const isEnvAdminLogin =
      adminEmail === payload.email.toLowerCase() &&
      Boolean(adminPassword) &&
      payload.password === adminPassword;

    if (isEnvAdminLogin) {
      user = await db.user.upsert({
        where: { email: payload.email.toLowerCase() },
        create: {
          email: payload.email.toLowerCase(),
          name: "Shaman Life Admin",
          role: Role.ADMIN,
          passwordHash: await hashPassword(payload.password),
        },
        update: {
          role: Role.ADMIN,
          passwordHash: await hashPassword(payload.password),
        },
      });
    }

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
