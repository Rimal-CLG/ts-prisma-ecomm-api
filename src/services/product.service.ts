import prisma from "../config/db.ts";
import axios from "axios";
import type { PaginationRTN } from "../utils/pagination.ts";
import type { AddProductDTO, UpdateProductDTO } from "../dtos/product.dto.ts";

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

export const addProductService = async (data: AddProductDTO) => {
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

export const updateProductService = async (
  productId: number,
  data: UpdateProductDTO,
) => {
  const updateData: any = {};

  for (const key in data) {
    if (data[key as keyof UpdateProductDTO] !== undefined) {
      updateData[key] = data[key as keyof UpdateProductDTO];
    }
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
