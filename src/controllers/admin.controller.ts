import type { LoginDTO, RegisterDTO, UpdateDTO } from "../dtos/auth.dto.ts";
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
    const data: RegisterDTO = req.body;
    const admin = await registerAdmin(data);
    res.status(201).json(admin);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const data: LoginDTO = req.body;
    const token = await loginAdmin(data);
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
    return res.status(500).json({ message: err.message });
  }
};

export const viewAllU = async (req: Request, res: Response) => {
  try {
    const data = pagination(req.query);
    const users = await viewAllUsers(data);
    return res.status(200).json(users);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const viewAllA = async (req: Request, res: Response) => {
  try {
    const data = pagination(req.query);
    const admins = await viewAllAdmins(data);
    return res.status(200).json(admins);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const data: UpdateDTO = req.body;
    const userDetails = await updateAdminProfile(userId, data);
    return res.status(200).json({ user: userDetails });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
