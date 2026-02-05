import prisma from "../config/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { PaginationRTN } from "../utils/pagination.ts";
import type { LoginDTO, RegisterDTO, UpdateDTO } from "../dtos/auth.dto.ts";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "15m";

export const registerAdmin = async (data: RegisterDTO) => {
  const [emailUser, usernameUser] = await Promise.all([
    prisma.user.findUnique({ where: { email: data.email } }),
    prisma.user.findUnique({ where: { username: data.username } }),
  ]);

  if (emailUser) {
    throw new Error("Email already exists");
  }

  if (usernameUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return user;
};

export const loginAdmin = async (data: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return token;
};

export const viewUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const deleteUserProfile = async (userId: number) => {
  const userDetails = await prisma.user.findUnique({ where: { id: userId } });
  if (!userDetails) {
    throw new Error("User not found");
  }
  const user = await prisma.user.delete({ where: { id: userId } });
  return user;
};

export const viewAllUsers = async (data: PaginationRTN) => {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    skip: data.skip,
    take: data.take,
    orderBy: {
      name: data.orderby,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

export const viewAllAdmins = async (data: PaginationRTN) => {
  // console.log(data.orderby);
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    skip: data.skip,
    take: data.take,
    orderBy: {
      id: data.orderby,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return admins;
};

export const updateAdminProfile = async (userId: number, data: UpdateDTO) => {
  let updateData = await prisma.user.findFirst({ where: { id: userId } });

  if (!updateData) {
    throw new Error("User not found");
  }

  if (data.name) {
    updateData.name = data.name;
  }

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  if (data.email) {
    const emailUser = await prisma.user.findFirst({
      where: { email: data.email, id: { not: userId } },
    });
    if (emailUser) throw new Error("Email already exists");
  }

  if (data.username) {
    const usernameUser = await prisma.user.findFirst({
      where: { username: data.username, id: { not: userId } },
    });
    if (usernameUser) throw new Error("Username already exists");
    updateData.username = data.username;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
