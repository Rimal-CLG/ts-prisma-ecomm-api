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

interface RegisterUserInput {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = async (data: RegisterUserInput) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const { name, username, email, password, confirmPassword } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email already exists");
    }
    if (existingUser.username === username) {
      throw new Error("Username already exists");
    }
    throw new Error("User already exists");
  }

  if (!name || !username || !email || !password) {
    throw new Error("All fields are required");
  }

  if (!regex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    );
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const balance = 5000.0;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
      role: "USER",

      wallet: {
        create: {
          balance,
        },
      },
    },
  });

  return user;
};

interface LoginUserInput {
  username: string;
  password: string;
}
export const loginUser = async (data: LoginUserInput) => {
  const { username, password } = data;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("Invalid Username");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
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
    throw new Error("User Login failed");
  }
  return { token };
};

export const viewUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, username: true, email: true },
  });
  return user;
};

interface UpdateUserInput {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export const updateUserProfile = async (
  userId: number,
  data: UpdateUserInput,
) => {
  const updateData: any = {};

  if (data.name) updateData.name = data.name;
  if (data.username) updateData.username = data.username;
  if (data.email) updateData.email = data.email;

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

export const deleteUserProfile = async (userId: number) => {
  const deletedUser = await prisma.user.delete({ where: { id: userId } });
  return deletedUser;
};

export const viewPurchase = async (userId: number, data: PaginationRTN) => {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    skip: data.skip,
    take: data.take,
    orderBy: {
      totalPrice: data.orderby,
    },
  });
  return purchases;
};
