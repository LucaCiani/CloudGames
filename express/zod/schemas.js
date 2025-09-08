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
