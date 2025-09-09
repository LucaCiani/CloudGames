import { Router } from "express";
import { validateBody } from "../zod/schemas.js";
import { newsletterSubscribeSchema } from "../zod/schemas.js";
import newsletterController from "../controllers/newsletterController.js";

const router = Router();

router.post(
  "/newsletter",
  validateBody(newsletterSubscribeSchema),
  newsletterController.sendNewsletterEmail
);

export default router;
