import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticater = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if(!token){
      throw new Error("tocken not avalible")
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.locals.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err });
  }
};
