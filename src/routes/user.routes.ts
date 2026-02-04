import {
  userLogin,
  viewProfile,
  userRegister,
  deleteProfile,
  updateProfile,
  viewMyPurchase,
} from "../controllers/user.controller.ts";
import { authenticater } from "../middlewares/auth.middleware.ts";

import express from "express";
const router = express.Router();

// POSTS
router.post("/register", userRegister);
router.post("/login", userLogin);

// GETS
router.get("/viewProfile", authenticater, viewProfile);
router.get("/myPurchases", authenticater, viewMyPurchase); // http://localhost:3000/user/myPurchases?page=3&limit=7&sort=desc

// PETCHES
router.patch("/updateProfile", authenticater, updateProfile);

// DELETE
router.delete("/deleteProfile", authenticater, deleteProfile);  

export default router;
