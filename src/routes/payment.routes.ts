import { authenticater } from "../middlewares/auth.middleware.ts";
import { isAdmin } from "../middlewares/isAdmin.middleware.ts";

import express from "express";
import { validate } from "../middlewares/validate.middleware.ts";
import { addCardController, createCustomerController } from "../controllers/payment.controller.ts";
const router = express.Router();

// post
router.post("/createuser", authenticater, isAdmin, createCustomerController);
router.post("/add-card", authenticater, isAdmin, addCardController);
// get

// patch/put

// delete

export default router;
