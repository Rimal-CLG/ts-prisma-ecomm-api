import {
  addProductService,
  updateProductService,
  viewAllProduct,
  viewProductByIdService,
  deleteProductService,
  addProductsService,
} from "../services/product.service.ts";
import { pagination } from "../utils/pagination.ts";

import type { Request, Response } from "express";

export const viewProduct = async (req: Request, res: Response) => {
  try {
    const data = pagination(req.query);
    const allProduct = await viewAllProduct(data);
    return res.status(200).json(allProduct);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const viewProductById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const product = await viewProductByIdService(productId);
    return res.status(200).json(product);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { id, name, description, price, stock, isActive } = req.body;
    const product = await addProductService({
      name,
      description,
      price,
      stock,
      isActive,
    });
    return res.status(201).json(product);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const updateProductByID = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    if (!productId) {
      throw new Error("ProductId not defined");
    }
    const product = await updateProductService(productId, req.body);
    return res.status(201).json(product);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const deleteProductByID = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    if (!productId) {
      throw new Error("ProductId not defined");
    }
    const product = await deleteProductService(productId);
    return res.status(200).json(product);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};

export const addProducts = async (req: Request, res: Response) => {
  try {
    const result = await addProductsService();
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ Message: err.message });
  }
};
