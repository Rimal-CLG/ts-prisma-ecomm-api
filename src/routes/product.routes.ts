import { authenticater } from "../middlewares/auth.middleware.ts";
import { isAdmin } from "../middlewares/isAdmin.middleware.ts";
import { addProductSchema, updateProductSchema } from "../dtos/product.dto.ts";
import {
  addProduct,
  updateProductByID,
  viewProduct,
  viewProductById,
  deleteProductByID,
  addProducts,
} from "../controllers/product.controller.ts";

import express from "express";
import { validate } from "../middlewares/validate.middleware.ts";
const router = express.Router();

// POST
router.post(
  "/add",
  authenticater,
  isAdmin,
  validate(addProductSchema),
  addProduct,
);
router.post("/addProducts", authenticater, isAdmin, addProducts);

// GET
router.get("/list", viewProduct); // http://localhost:3000/product/list?page=3&limit=7&sort=desc
router.get("/:id", viewProductById);

// PUT / PATCH
router.patch(
  "/update/:id",
  authenticater,
  isAdmin,
  validate(updateProductSchema),
  updateProductByID,
);

// DELETE
router.delete("/:id", authenticater, isAdmin, deleteProductByID);

export default router;
