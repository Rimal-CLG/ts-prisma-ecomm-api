import prisma from "../config/db.ts";
import axios from "axios";
import type { PaginationRTN } from "../utils/pagination.ts";

export const viewAllProduct = async (data: PaginationRTN) => {
  const product = await prisma.product.findMany({
    skip: data.skip,
    take: data.take,
    orderBy: {
      price: data.orderby,
    },
  });
  return product;
};

export const viewProductByIdService = async (productId: number) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Product Not Found");
  }
  return product;
};

interface AddProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  isActive?: boolean;
}

export const addProductService = async (data: AddProduct) => {
  if (!data.name || data.price === undefined || data.stock === undefined) {
    throw new Error("All Field Are Require");
  }

  if (data.price <= 0) {
    throw new Error("Price must be greater than 0");
  }

  if (data.stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const newData: any = {
    name: data.name,
    price: data.price,
    stock: data.stock,
  };

  if (data.description !== undefined) {
    newData.description = data.description;
  }

  if (data.isActive !== undefined) {
    newData.isActive = data.isActive;
  }

  const product = await prisma.product.create({
    data: newData,
  });

  return product;
};

interface UpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
}

export const updateProductService = async (
  productId: number,
  data: UpdateProduct,
) => {
  const updateData: any = {};

  if (data.name) {
    updateData.name = data.name;
  }
  if (data.description) {
    updateData.description = data.description;
  }
  if (data.price) {
    updateData.price = data.price;
  }
  if (data.stock) {
    updateData.stock = data.stock;
  }
  if (data.isActive) {
    updateData.isActive = data.isActive;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("Nothing to update");
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: updateData,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      isActive: true,
      updatedAt: true,
    },
  });
  return updatedProduct;
};

export const deleteProductService = async (productId: number) => {
  const productDetails = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!productDetails) {
    throw new Error("Product not found");
  }
  const product = await prisma.product.delete({ where: { id: productId } });
  return product;
};

export const addProductsService = async () => {
  const fetchResponse = await axios.get("https://dummyjson.com/products");
  const products = fetchResponse.data.products;

  type DummyProduct = {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
  };

  await Promise.all(
    products.map((prod: DummyProduct) => {
      return prisma.product.upsert({
        where: { apiId: prod.id },
        update: {
          name: prod.title,
          description: prod.description,
          price: prod.price * 92,
          stock: prod.stock,
        },
        create: {
          apiId: prod.id,
          name: prod.title,
          description: prod.description,
          price: prod.price * 92,
          stock: prod.stock,
        },
      });
    }),
  );
};
