import {
  registerUser,
  loginUser,
  viewUserProfile,
  deleteUserProfile,
  updateUserProfile,
  viewPurchase,
} from "../services/user.service.ts";
import { pagination } from "../utils/pagination.ts";

import type { Request, Response } from "express";

function getUserId(res: Response): number {
  const user = res.locals.user;

  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  return Number(user.id);
}

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    const user = await registerUser({
      name,
      username,
      email,
      password,
      confirmPassword,
    });

    res.status(201).json(user);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const tocken = await loginUser({ username, password });
    return res.status(200).json(tocken);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const viewProfile = async (req: Request, res: Response) => {
  try {
    const userDetails = await viewUserProfile(getUserId(res));
    res.json({ userDetails });
  } catch (err: any) {
    console.error("VIEW PROFILE ERROR:", err);
    return res.status(500).json({ Message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userDetails = await updateUserProfile(getUserId(res), req.body);
    return res.status(200).json({ user: userDetails });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userDetails = await deleteUserProfile(getUserId(res));
    res.json({ message: "User deleted successfully", userDetails });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const viewMyPurchase = async (req: Request, res: Response) => {
  try {
    const data = pagination(req.query);
    const purchase = await viewPurchase(getUserId(res), data);
    res.status(200).json(purchase);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
