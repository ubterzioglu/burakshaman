import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const payload = (await request.json()) as { handled: boolean };
    const message = await getDb().contactMessage.update({
      where: { id },
      data: { handled: Boolean(payload.handled) },
    });
    return NextResponse.json({ message });
  } catch (error) {
    return jsonError(error, 400);
  }
}
