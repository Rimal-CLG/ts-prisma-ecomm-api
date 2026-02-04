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
const router = express.Router();

// POST
router.post("/register", authenticater, isAdmin, adminRegister);
router.post("/login", adminLogin);

// GET
router.get("/viewUserProfile/:id", authenticater, isAdmin, viewUProfile);
router.get("/viewAllUsers", authenticater, isAdmin, viewAllU); // http://localhost:3000/admin/viewAllUsers?page=3&limit=7&sort=desc
router.get("/viewAllAdmins", authenticater, isAdmin, viewAllA); // http://localhost:3000/admin/viewAllAdmins?page=3&limit=7&sort=desc

// PUT / PATCH
router.patch("/adminUpdateProfile", authenticater, isAdmin, updateProfile);

// DELETE
router.delete("/deleteUserProfile/:id", authenticater, isAdmin, deleteUProfile);

export default router;
