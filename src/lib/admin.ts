import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return {
      session: null,
      response: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
    };
  }
  return { session, response: null };
}
