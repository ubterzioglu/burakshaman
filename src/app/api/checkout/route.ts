import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, hasDatabase } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { requestPaytrIframeToken, type PaytrBasketItem } from "@/lib/paytr";
import { listProducts } from "@/lib/repository";
import { cartCheckoutSchema } from "@/lib/validators";

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = cartCheckoutSchema.parse(await request.json());
    if (!hasDatabase()) {
      return NextResponse.json(
        { error: "DATABASE_URL is required to create orders." },
        { status: 503 },
      );
    }

    // Resolve requested line items against the catalogue (DB-backed via repository).
    const catalogue = await listProducts();
    const requested =
      payload.items && payload.items.length > 0
        ? payload.items
        : [{ slug: payload.productSlug as string, quantity: payload.quantity }];

    const lineItems = requested.map((item) => {
      const product = catalogue.find((p) => p.slug === item.slug);
      if (!product) return null;
      return {
        slug: product.slug,
        name: product.name,
        unitCents: product.priceCents,
        quantity: item.quantity,
      };
    });

    if (lineItems.some((i) => i === null)) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const items = lineItems as NonNullable<(typeof lineItems)[number]>[];

    const totalCents = items.reduce((sum, i) => sum + i.unitCents * i.quantity, 0);
    const merchantOid = `SL${Date.now()}`;
    const db = getDb();
    const session = await getSession();

    // Link DB product ids where available.
    const dbProducts = await db.product.findMany({
      where: { slug: { in: items.map((i) => i.slug) } },
      select: { id: true, slug: true },
    });
    const idBySlug = new Map(dbProducts.map((p) => [p.slug, p.id]));

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
          create: items.map((i) => ({
            productId: idBySlug.get(i.slug),
            name: i.name,
            unitCents: i.unitCents,
            quantity: i.quantity,
          })),
        },
      },
    });

    const userBasket: PaytrBasketItem[] = items.map((i) => [
      i.name,
      (i.unitCents / 100).toFixed(2),
      i.quantity,
    ]);

    const appUrl = process.env.APP_URL ?? new URL(request.url).origin;
    const iframeToken = await requestPaytrIframeToken({
      merchantOid,
      email: payload.customerEmail,
      paymentAmount: totalCents,
      userBasket,
      userName: payload.customerName,
      userAddress: payload.billingAddress,
      userPhone: payload.customerPhone,
      userIp: clientIp(request),
      okUrl: `${appUrl}/tr/account`,
      failUrl: `${appUrl}/tr/checkout`,
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
