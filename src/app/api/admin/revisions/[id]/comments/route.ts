import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

const commentSchema = z.object({
  body: z.string().min(1).max(2000),
});

async function readPayload(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return request.json();
  return Object.fromEntries((await request.formData()).entries());
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const payload = commentSchema.parse(await readPayload(request));
    await getDb().revisionComment.create({
      data: {
        revisionId: id,
        authorId: auth.session?.userId,
        body: payload.body,
      },
    });

    if ((request.headers.get("content-type") ?? "").includes("application/json")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.redirect(new URL("/admin#revisions", request.url), 303);
  } catch (error) {
    return jsonError(error, 400);
  }
}
