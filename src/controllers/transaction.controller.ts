import type { Request, Response } from "express";
import { viewTransactionsService } from "../services/transaction.service.ts";
import { pagination } from "../utils/pagination.ts";
import { filter } from "../utils/filter.ts";

export const viewTransactions = async (req: Request, res: Response) => {
  try {
    // http://localhost:3000/transaction/listall?page=3&limit=7&sort=desc&filter=ik
    const data = {
      ...pagination(req.query),
      ...filter(req.query),
    };
    const trans = await viewTransactionsService(data);
    return res.status(201).json(trans);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};
