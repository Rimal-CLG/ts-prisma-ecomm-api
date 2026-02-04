import prisma from "../config/db.ts";
import type { PaginationRTN } from "../utils/pagination.ts";

interface PurchaseService {
  userId: number;
  productID: number;
  quantity: number;
}

export const purchaseService = async (data: PurchaseService) => {
  const { userId, productID, quantity } = data;
  if (!userId || !productID || !quantity) {
    throw new Error("All fields are required");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const productDetails = await prisma.product.findUnique({
    where: { id: productID },
  });

  if (!productDetails) {
    throw new Error("Product not found");
  }

  if (productDetails.stock < quantity) {
    throw new Error(`Only ${productDetails.stock} quantity is available`);
  }

  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });

  if (!userDetails || !userDetails.wallet) {
    throw new Error("User or wallet not found");
  }

  const totalPrice = productDetails.price * quantity;

  if (userDetails.wallet.balance < totalPrice) {
    throw new Error("Insufficient balance");
  }

  const result = await prisma.$transaction(async (tx:any) => {
    const updatedWallet = await tx.wallet.update({
      where: { id: userDetails.wallet!.id },
      data: {
        balance: {
          decrement: totalPrice,
        },
      },
    });

    const updatedProduct = await tx.product.update({
      where: { id: productID },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    const purchase = await tx.purchase.create({
      data: {
        userId,
        productId: productID,
        quantity,
        totalPrice,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        userId,
        amount: totalPrice,
        type: "DEBIT",
        status: "SUCCESS",
        reference: `PURCHASE_${purchase.id}`,
      },
    });

    return {
      updatedWallet,
      updatedProduct,
      purchase,
      transaction,
    };
  });
  return result;
};

export const showPurchase = async (data: PaginationRTN) => {
  const purchase = await prisma.purchase.findMany({
    skip: data.skip,
    take: data.take,
    orderBy: {
      totalPrice: data.orderby,
    },
  });
  return purchase;
};

export const showPurchaseById = async (purchaseId: number) => {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });
  if (!purchase) {
    throw new Error("Purchase not found");
  }
  return purchase;
};
