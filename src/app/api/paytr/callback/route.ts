import { NextRequest, NextResponse } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { verifyPaytrCallback } from "@/lib/paytr";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const merchantOid = String(form.get("merchant_oid") ?? "");
  const status = String(form.get("status") ?? "");
  const totalAmount = String(form.get("total_amount") ?? "");
  const hash = String(form.get("hash") ?? "");

  if (
    !verifyPaytrCallback({
      merchantOid,
      status,
      totalAmount,
      hash,
    })
  ) {
    return new NextResponse("PAYTR notification failed: bad hash", {
      status: 400,
    });
  }

  if (hasDatabase()) {
    const db = getDb();
    const providerPayload = Object.fromEntries(
      Array.from(form.entries()).map(([key, value]) => [key, String(value)]),
    );
    const order = await db.order.findUnique({
      where: { merchantOid },
      include: { payments: true },
    });

    if (order) {
      await db.order.update({
        where: { id: order.id },
        data: { status: status === "success" ? "PAID" : "FAILED" },
      });
      await db.payment.create({
        data: {
          orderId: order.id,
          status,
          amountCents: Number(totalAmount),
          providerPayload,
        },
      });
      await sendMail({
        to: order.customerEmail,
        subject:
          status === "success"
            ? "Shaman Life order confirmed"
            : "Shaman Life payment failed",
        text: `Order ${order.merchantOid}: ${status}`,
      });
    }
  }

  return new NextResponse("OK", {
    headers: { "content-type": "text/plain" },
  });
}
