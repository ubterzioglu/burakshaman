import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { createSessionCookie, hashPassword } from "@/lib/auth";
import { getAdminPassword } from "@/lib/admin-password";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

const adminLoginSchema = z.object({
  password: z.string().min(1).max(100),
});

async function readPayload(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return request.json();
  return Object.fromEntries((await request.formData()).entries());
}

export async function POST(request: NextRequest) {
  try {
    const payload = adminLoginSchema.parse(await readPayload(request));
    const adminPassword = getAdminPassword();

    if (!adminPassword || payload.password !== adminPassword) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    const adminEmail =
      process.env.ADMIN_EMAIL?.toLowerCase() ?? "admin@shamanlife.local";
    const db = getDb();
    const user = await db.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        name: "Shaman Life Admin",
        role: Role.ADMIN,
        passwordHash: await hashPassword(payload.password),
      },
      update: {
        role: Role.ADMIN,
        passwordHash: await hashPassword(payload.password),
      },
    });

    await createSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return NextResponse.redirect(new URL("/admin", request.url), 303);
  } catch (error) {
    return jsonError(error, 400);
  }
}
