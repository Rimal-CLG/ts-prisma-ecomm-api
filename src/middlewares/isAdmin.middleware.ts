import type { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (res.locals.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};
