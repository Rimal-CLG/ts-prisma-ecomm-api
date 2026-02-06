import { addCardService, createCustomerService } from "../services/payment.service.ts";
import { pagination } from "../utils/pagination.ts";

import type { Request, Response } from "express";

export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const data: any = req.body;
    const customer = await createCustomerService(data);
    res.status(201).json(customer);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const addCardController = async (req: Request, res: Response) => {
  try {
    const data= req.body;
    const card = await addCardService(data);
    res.status(201).json(card);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
