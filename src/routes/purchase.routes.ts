import { authenticater } from "../middlewares/auth.middleware.ts";
import { isAdmin } from "../middlewares/isAdmin.middleware.ts";
import {
  createPurchase,
  showAllPurchase,
  showPurchaseByID,
} from "../controllers/purchase.controller.ts";

import express from "express";
const router = express.Router();

// post

router.post("/", authenticater, createPurchase);
// get
router.get("/list", authenticater, isAdmin, showAllPurchase); // http://localhost:3000/purchase/list?page=3&limit=7&sort=desc
router.get("/show/:id", authenticater, isAdmin, showPurchaseByID);

// petch/put

// delete

export default router;
