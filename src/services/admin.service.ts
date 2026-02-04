import prisma from "../config/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { PaginationRTN } from "../utils/pagination.ts";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: jwt.SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "15m";

interface RegisterAdminInput {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN";
}

export const registerAdmin = async (data: RegisterAdminInput) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (
    !data.name ||
    !data.username ||
    !data.email ||
    !data.password ||
    !data.confirmPassword ||
    !data.role
  ) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new Error("Email already exists");
    }
    if (existingUser.username === data.username) {
      throw new Error("Username already exists");
    }
    throw new Error("User already exists");
  }

  if (!regex.test(data.password)) {
    throw new Error(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    );
  }

  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords and confirmPassword are not match");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  return user;
};

interface LoginAdminInput {
  username: string;
  password: string;
}
export const loginAdmin = async (data: LoginAdminInput) => {
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });
  if (!user) {
    throw new Error("Invalid Username");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );

  if (!token) {
    throw new Error("Token generation failed");
  }

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

interface UpdateAdminInput {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export const updateAdminProfile = async (
  userId: number,
  data: UpdateAdminInput,
) => {
  const updateData: any = {};

  if (data.name) {
    updateData.name = data.name;
  }
  if (data.username) {
    updateData.username = data.username;
  }
  if (data.email) {
    updateData.email = data.email;
  }

  if (data.password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(data.password)) {
      throw new Error("Password is not strong enough");
    }

    updateData.password = await bcrypt.hash(data.password, 10);
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("Nothing to update");
  }

  if (data.email || data.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              data.email ? { email: data.email } : undefined,
              data.username ? { username: data.username } : undefined,
            ].filter(Boolean) as any,
          },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error("Email already exists");
      }
      if (existingUser.username === data.username) {
        throw new Error("Username already exists");
      }
      throw new Error("Email or username already exists");
    }
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
