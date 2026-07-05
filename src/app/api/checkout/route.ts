import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { products } from "@/lib/content";
import { getDb, hasDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { requestPaytrIframeToken } from "@/lib/paytr";
import { checkoutSchema } from "@/lib/validators";

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const product = products.find((item) => item.slug === payload.productSlug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!hasDatabase()) {
      return NextResponse.json(
        { error: "DATABASE_URL is required to create orders." },
        { status: 503 },
      );
    }

    const totalCents = product.priceCents * payload.quantity;
    const merchantOid = `SL${Date.now()}`;
    const db = getDb();
    const session = await getSession();
    const order = await db.order.create({
      data: {
        merchantOid,
        userId: session?.userId,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail.toLowerCase(),
        customerPhone: payload.customerPhone,
        billingAddress: payload.billingAddress,
        totalCents,
        items: {
          create: {
            name: product.name,
            unitCents: product.priceCents,
            quantity: payload.quantity,
          },
        },
      },
    });

    const appUrl = process.env.APP_URL ?? new URL(request.url).origin;
    const iframeToken = await requestPaytrIframeToken({
      merchantOid,
      email: payload.customerEmail,
      paymentAmount: totalCents,
      userBasket: [[product.name, (product.priceCents / 100).toFixed(2), payload.quantity]],
      userName: payload.customerName,
      userAddress: payload.billingAddress,
      userPhone: payload.customerPhone,
      userIp: clientIp(request),
      okUrl: `${appUrl}/account`,
      failUrl: `${appUrl}/checkout`,
    });

    await db.payment.create({
      data: {
        orderId: order.id,
        providerToken: iframeToken,
        status: "token_created",
        amountCents: totalCents,
      },
    });

    return NextResponse.json({ ok: true, orderId: order.id, iframeToken });
  } catch (error) {
    return jsonError(error, 400);
  }
}
