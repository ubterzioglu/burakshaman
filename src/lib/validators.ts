import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(80).optional(),
  phone: z.string().max(24).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(100),
  phone: z.string().max(24).optional(),
  subject: z.string().max(120).optional(),
  message: z.string().min(10).max(3000),
});

export const newsletterSchema = z.object({
  name: z.string().max(80).optional(),
  email: z.string().email().max(100),
  locale: z.string().max(8).default("tr"),
});

export const bookingSchema = z.object({
  serviceSlug: z.string().min(2).max(120),
  serviceName: z.string().min(2).max(160),
  name: z.string().min(2).max(80),
  email: z.string().email().max(100),
  phone: z.string().min(6).max(24),
  startsAt: z.string().datetime().optional(),
  message: z.string().max(2000).optional(),
});

export const checkoutSchema = z.object({
  productSlug: z.string().min(2).max(160),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
  customerName: z.string().min(2).max(80),
  customerEmail: z.string().email().max(100),
  customerPhone: z.string().min(6).max(24),
  billingAddress: z.string().min(10).max(400),
});

export const ticketSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(100),
  phone: z.string().max(24).optional(),
  quantity: z.coerce.number().int().min(1).max(6).default(1),
});

export const checkoutItemSchema = z.object({
  slug: z.string().min(1).max(160),
  quantity: z.coerce.number().int().min(1).max(10),
});

// Multi-item (cart) checkout; also accepts the legacy single-product shape.
export const cartCheckoutSchema = z
  .object({
    items: z.array(checkoutItemSchema).min(1).max(20).optional(),
    productSlug: z.string().min(1).max(160).optional(),
    quantity: z.coerce.number().int().min(1).max(10).default(1),
    customerName: z.string().min(2).max(80),
    customerEmail: z.string().email().max(100),
    customerPhone: z.string().min(6).max(24),
    billingAddress: z.string().min(10).max(400),
  })
  .refine((d) => (d.items && d.items.length > 0) || d.productSlug, {
    message: "items or productSlug is required",
    path: ["items"],
  });
