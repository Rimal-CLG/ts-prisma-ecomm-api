import {
  adminLogin,
  adminRegister,
  deleteUProfile,
  updateProfile,
  viewAllA,
  viewAllU,
  viewUProfile,
} from "../controllers/admin.controller.ts";
import { authenticater } from "../middlewares/auth.middleware.ts";
import { isAdmin } from "../middlewares/isAdmin.middleware.ts";

import express from "express";
import { validate } from "../middlewares/validate.middleware.ts";
import { loginSchema, registerSchema, updateSchema } from "../dtos/auth.dto.ts";
const router = express.Router();

// POST
router.post(
  "/register",
  authenticater,
  isAdmin,
  validate(registerSchema),
  adminRegister,
);
router.post("/login", validate(loginSchema), adminLogin);

// GET
router.get("/viewUserProfile/:id", authenticater, isAdmin, viewUProfile);
router.get("/viewAllUsers", authenticater, isAdmin, viewAllU); // http://localhost:3000/admin/viewAllUsers?page=3&limit=7&sort=desc
router.get("/viewAllAdmins", authenticater, isAdmin, viewAllA); // http://localhost:3000/admin/viewAllAdmins?page=3&limit=7&sort=desc

// PUT / PATCH
router.patch(
  "/adminUpdateProfile",
  authenticater,
  isAdmin,
  validate(updateSchema),
  updateProfile,
);

// DELETE
router.delete("/deleteUserProfile/:id", authenticater, isAdmin, deleteUProfile);

export default router;
