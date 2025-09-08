import { z } from "zod";

/*
 * Generic body validator middleware factory
 */
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }
  req.body = result.data;
  next();
};

/*
 * ===================== Videogame Schemas =====================
 * Based on DB structure in db/schema.md (table: videogames + join tables)
 * Body example supplied by user.
 */

// Reusable primitives / helpers

const priceNumber = z
  .number({ required_error: "Price is required" })
  .nonnegative()
  .max(999.99, "Max price is 999.99")
  .refine((n) => /^\d{1,3}(\.\d{1,2})?$/.test(String(n)), {
    message: "Price must have max two decimal places",
  });

const promoPriceNumber = z
  .number()
  .nonnegative()
  .max(999.99)
  .refine((n) => /^\d{1,3}(\.\d{1,2})?$/.test(String(n)), {
    message: "Promo price must have max two decimal places",
  });

const voteNumber = z
  .number()
  .min(0)
  .max(9.99)
  .refine((n) => /^\d{1}(\.\d{1,2})?$/.test(String(n)), {
    message: "Vote must have max two decimal places (0.00 - 9.99)",
  });

const idArray = z
  .array(z.number().int().positive())
  .min(1, "Provide at least one id")
  .optional();

const mediaItemSchema = z.object({
  type: z.enum(["img", "video"], { required_error: "Media type required" }),
  url: z.url("Invalid media URL"),
});

const mediaArraySchema = z.array(mediaItemSchema).min(1).optional();

// Shared base fields for create / update
const videogameFieldShape = {
  slug: z
    .string({ required_error: "Slug is required" })
    .min(3)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase, alphanumeric, hyphen separated",
    }),
  name: z.string().min(1, "Name required"),
  description: z.string().min(1, "Description required"),
  price: priceNumber,
  promo_price: promoPriceNumber.optional().nullable(),
  developer: z.string().min(1, "Developer required"),
  release_date: z.iso.datetime(),
  image_url: z.url("image_url must be a valid URL"),
  quantity: z.number().int().nonnegative(),
  vote: voteNumber,
  platform_ids: idArray, // join table entries (optional for now)
  genre_ids: idArray, // join table entries (optional for now)
  media: mediaArraySchema, // media objects (optional for now)
};

// CREATE (POST) full required shape
export const videogameCreateSchema = z
  .object(videogameFieldShape)
  .refine(
    (data) =>
      data.promo_price == null ||
      (typeof data.promo_price === "number" && data.promo_price <= data.price),
    {
      message: "promo_price must be <= price",
      path: ["promo_price"],
    }
  );

// UPDATE (PUT) expects the same as create (all required except optional ones above)
export const videogameUpdateSchema = videogameCreateSchema;

// PATCH (partial) - make all fields optional but keep validations
export const videogamePatchSchema = z
  .object(
    Object.fromEntries(
      Object.entries(videogameFieldShape).map(([k, schema]) => [
        k,
        // if it's already optional keep it, else make optional
        schema instanceof z.ZodOptional ? schema : schema.optional(),
      ])
    )
  )
  .refine(
    (data) =>
      data.promo_price == null ||
      data.price == null ||
      (typeof data.promo_price === "number" &&
        typeof data.price === "number" &&
        data.promo_price <= data.price),
    {
      message: "promo_price must be <= price when both provided",
      path: ["promo_price"],
    }
  );

/*
 * ===================== Invoice Schemas =====================
 * Table: invoices (see db/schema.md)
 * Relationships handled separately (videogames join via invoice_videogame, billing address via billing_addresses.invoice_id)
 * Client sends an array of videogames (id, quantity) to attach.
 */

// Reusable invoice primitives
const currencySchema = z
  .string()
  .length(3, "Currency must be 3 letters")
  .regex(/^[A-Z]{3}$/i, "Currency must be alphabetic 3-letter code")
  .transform((s) => s.toUpperCase())
  .default("EUR");

const paymentProviderSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-z0-9-_ ]+$/i, "payment_provider has invalid characters")
  .optional();

const invoiceVideogameItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive().max(999),
});

const invoiceVideogamesArray = z
  .array(invoiceVideogameItemSchema)
  .min(1, "At least one videogame required")
  .refine(
    (arr) => new Set(arr.map((v) => v.id)).size === arr.length,
    "Duplicate videogame ids not allowed"
  );

const statusEnum = z
  .enum(["pending", "paid", "failed", "cancelled"], {
    invalid_type_error: "Invalid status value",
  })
  .optional();

// Base invoice shape (create/update common) - create requires total_amount + videogames
const invoiceBaseShape = {
  total_amount: z
    .number({ required_error: "total_amount required" })
    .int()
    .positive(), // in cents
  payment_provider: paymentProviderSchema,
  discount_id: z.number().int().positive().optional(),
  currency: currencySchema, // default applied
  videogames: invoiceVideogamesArray, // required (see create)
};

export const invoiceCreateSchema = z.object(invoiceBaseShape);

export const invoiceUpdateSchema = invoiceCreateSchema.extend({
  status: statusEnum, // allow client to set if business rules permit
  completed_at: z.iso.datetime().optional().nullable(),
});

export const invoicePatchSchema = z
  .object({
    total_amount: invoiceBaseShape.total_amount.optional(),
    payment_provider: paymentProviderSchema,
    discount_id: z.number().int().positive().optional(),
    currency: currencySchema.optional(),
    videogames: invoiceVideogamesArray.optional(),
    status: statusEnum.optional(),
    completed_at: z.iso.datetime().optional().nullable(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for patch"
  );

/*
Usage examples in a router:
  router.post('/invoices', validateBody(invoiceCreateSchema), invoicesController.store)
  router.put('/invoices/:id', validateBody(invoiceUpdateSchema), invoicesController.update)
  router.patch('/invoices/:id', validateBody(invoicePatchSchema), invoicesController.modify)
*/

/*
 * ===================== Billing Address Schemas =====================
 * Table: billing_addresses (see db/schema.md)
 * created_at handled server-side.
 */

const countrySchema = z
  .string()
  .min(2)
  .max(100)
  .refine(
    (val) =>
      /^[A-Z]{2}$/.test(val.toUpperCase()) ||
      /^[A-Za-z '()-]{3,100}$/.test(val),
    "Country must be a 2-letter code or a valid country name"
  )
  .transform((s) => (s.length === 2 ? s.toUpperCase() : s));

const billingAddressBaseShape = {
  invoice_id: z.number().int().positive().optional(),
  full_name: z.string().min(1).max(255),
  address_line: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  postal_code: z.number().int().nonnegative(),
  country: countrySchema,
};

export const billingAddressCreateSchema = z.object(billingAddressBaseShape);

export const billingAddressUpdateSchema = billingAddressCreateSchema;

export const billingAddressPatchSchema = z
  .object(
    Object.fromEntries(
      Object.entries(billingAddressBaseShape).map(([k, schema]) => [
        k,
        schema instanceof z.ZodOptional ? schema : schema.optional(),
      ])
    )
  )
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for patch"
  );

/*
Usage examples in a router:
  router.post('/billing-addresses', validateBody(billingAddressCreateSchema), billingAddressesController.store)
  router.put('/billing-addresses/:id', validateBody(billingAddressUpdateSchema), billingAddressesController.update)
  router.patch('/billing-addresses/:id', validateBody(billingAddressPatchSchema), billingAddressesController.modify)
*/
