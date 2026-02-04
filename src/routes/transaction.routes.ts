import { viewTransactions } from "../controllers/transaction.controller.ts";
import { authenticater } from "../middlewares/auth.middleware.ts";
import { isAdmin } from "../middlewares/isAdmin.middleware.ts";

import express from "express";
const router = express.Router();

//POST

//GET
router.get("/list", authenticater, isAdmin, viewTransactions); // http://localhost:3000/transaction/list?page=3&limit=7&sort=desc

//PUT/PETCH

//DELETE

export default router;

// prisma pagination :- https://www.prisma.io/docs/orm/prisma-client/queries/pagination