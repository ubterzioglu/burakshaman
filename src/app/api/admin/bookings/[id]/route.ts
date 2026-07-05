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
    const payload = (await request.json()) as {
      status: "REQUESTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    };
    const booking = await getDb().booking.update({
      where: { id },
      data: { status: payload.status },
    });
    return NextResponse.json({ booking });
  } catch (error) {
    return jsonError(error, 400);
  }
}
