import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body;
    const reqQuery = req.query;
    const reqParams = req.params;

    const combinedData = {
      ...reqBody,
      ...reqQuery,
      ...reqParams,
    };

    const result = schema.safeParse(combinedData);

    if (!result.success) {
      return res.status(400).json(result.error.format());
    }

    req.body = result.data; 
    next();
  };
