import { Router } from "express";
import { validateBody } from "../zod/schemas.js";
import {
  newsletterSubscribeSchema,
  ordersEmailSchema,
} from "../zod/schemas.js";
import newsletterController from "../controllers/emailsController.js";

const router = Router();

router.post(
  "/newsletter",
  validateBody(newsletterSubscribeSchema),
  newsletterController.sendNewsletterEmail
);

router.post(
  "/orders",
  validateBody(ordersEmailSchema),
  newsletterController.sendOrderEmail
);

export default router;
