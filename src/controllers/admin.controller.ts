import {
  deleteUserProfile,
  loginAdmin,
  registerAdmin,
  viewAllAdmins,
  viewAllUsers,
  viewUserProfile,
  updateAdminProfile,
} from "../services/admin.service.ts";
import { pagination } from "../utils/pagination.ts";

import type { Request, Response } from "express";

export const adminRegister = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    const admin = await registerAdmin({
      name,
      username,
      email,
      password,
      confirmPassword,
      role: "ADMIN",
    });

    res.status(201).json(admin);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await loginAdmin({ username, password });
    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const viewUProfile = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.id);
    const userDetails = await viewUserProfile(userID);
    return res.status(200).json(userDetails);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = await deleteUserProfile(userId);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const viewAllU = async (req: Request, res: Response) => {
  try {
    const data = pagination(req.query);
    const users = await viewAllUsers(data);
    return res.status(200).json(users);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const viewAllA = async (req: Request, res: Response) => {
  try {
    const data = pagination(req.query);
    const admins = await viewAllAdmins(data);
    return res.status(200).json(admins);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const userDetails = await updateAdminProfile(userId, req.body);
    return res.status(200).json({ user: userDetails });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
