import {
  purchaseService,
  showPurchase,
  showPurchaseById,
} from "../services/purchase.service.ts";
import { pagination } from "../utils/pagination.ts";

import type { Request, Response } from "express";

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const userId = Number(res.locals.user?.id);
    const { productID, quantity } = req.body;
    const purchase = await purchaseService({ userId, productID, quantity });

    return res.status(201).json({ purchase });
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const showAllPurchase = async (req: Request, res: Response) => {
  try {
    const data = pagination(req.query);
    const purchase = await showPurchase(data);
    return res.status(201).json(purchase);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const showPurchaseByID = async (req: Request, res: Response) => {
  try {
    const purchaseId = Number(req.params.id);
    const purchaseById = await showPurchaseById(purchaseId);
    return res.status(201).json(purchaseById);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};
