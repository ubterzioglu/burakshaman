import crypto from "node:crypto";

export type PaytrBasketItem = [name: string, price: string, quantity: number];

export type PaytrTokenInput = {
  merchantOid: string;
  email: string;
  paymentAmount: number;
  userBasket: PaytrBasketItem[];
  userName: string;
  userAddress: string;
  userPhone: string;
  userIp: string;
  okUrl: string;
  failUrl: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for PayTR integration.`);
  return value;
}

function hmacBase64(data: string, key: string) {
  return crypto.createHmac("sha256", key).update(data).digest("base64");
}

export function encodeBasket(items: PaytrBasketItem[]) {
  return Buffer.from(JSON.stringify(items)).toString("base64");
}

export function verifyPaytrCallback(input: {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}) {
  const merchantKey = requiredEnv("PAYTR_MERCHANT_KEY");
  const merchantSalt = requiredEnv("PAYTR_MERCHANT_SALT");
  const tokenSource =
    input.merchantOid + merchantSalt + input.status + input.totalAmount;
  return hmacBase64(tokenSource, merchantKey) === input.hash;
}

export async function requestPaytrIframeToken(input: PaytrTokenInput) {
  const merchantId = requiredEnv("PAYTR_MERCHANT_ID");
  const merchantKey = requiredEnv("PAYTR_MERCHANT_KEY");
  const merchantSalt = requiredEnv("PAYTR_MERCHANT_SALT");
  const testMode = process.env.PAYTR_TEST_MODE ?? "1";
  const currency = "TL";
  const noInstallment = "0";
  const maxInstallment = "0";
  const debugOn = process.env.NODE_ENV === "production" ? "0" : "1";
  const userBasket = encodeBasket(input.userBasket);

  const hashSource =
    merchantId +
    input.userIp +
    input.merchantOid +
    input.email +
    input.paymentAmount +
    userBasket +
    noInstallment +
    maxInstallment +
    currency +
    testMode;
  const paytrToken = hmacBase64(hashSource + merchantSalt, merchantKey);

  const body = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: input.userIp,
    merchant_oid: input.merchantOid,
    email: input.email,
    payment_amount: String(input.paymentAmount),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: debugOn,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: input.userName,
    user_address: input.userAddress,
    user_phone: input.userPhone,
    merchant_ok_url: input.okUrl,
    merchant_fail_url: input.failUrl,
    timeout_limit: "30",
    currency,
    test_mode: testMode,
    lang: "tr",
  });

  const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json()) as
    | { status: "success"; token: string }
    | { status: "failed"; reason: string };

  if (data.status !== "success") {
    throw new Error(data.reason);
  }

  return data.token;
}
