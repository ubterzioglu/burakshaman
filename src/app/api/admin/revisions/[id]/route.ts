import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

const statusSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "DONE", "ARCHIVED"]),
});

async function readPayload(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return request.json();
  return Object.fromEntries((await request.formData()).entries());
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const payload = statusSchema.parse(await readPayload(request));
    const revision = await getDb().revisionRequest.update({
      where: { id },
      data: { status: payload.status },
    });
    return NextResponse.json({ revision });
  } catch (error) {
    return jsonError(error, 400);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const payload = statusSchema.parse(await readPayload(request));
    await getDb().revisionRequest.update({
      where: { id },
      data: { status: payload.status },
    });
    return NextResponse.redirect(new URL("/admin#revisions", request.url), 303);
  } catch (error) {
    return jsonError(error, 400);
  }
}
