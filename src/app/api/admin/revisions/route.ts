import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

const revisionSchema = z.object({
  title: z.string().min(2).max(160),
  targetPath: z.string().max(240).optional(),
  description: z.string().min(5).max(4000),
  priority: z.string().max(40).default("normal"),
});

async function readPayload(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return request.json();
  return Object.fromEntries((await request.formData()).entries());
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const revisions = await getDb().revisionRequest.findMany({
    include: {
      comments: { orderBy: { createdAt: "asc" }, include: { author: true } },
      createdBy: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ revisions });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const payload = revisionSchema.parse(await readPayload(request));
    await getDb().revisionRequest.create({
      data: {
        title: payload.title,
        targetPath: payload.targetPath || null,
        description: payload.description,
        priority: payload.priority,
        createdById: auth.session?.userId,
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
