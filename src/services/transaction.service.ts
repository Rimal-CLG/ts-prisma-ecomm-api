import prisma from "../config/db.ts";
import type { PaginationRTN } from "../utils/pagination.ts";
import type { FilterRTN } from "../utils/filter.ts";

type ViewTransactionInput = PaginationRTN & FilterRTN;
export const viewTransactionsService = async (data: ViewTransactionInput) => {
  const where: any = {};
  if (data.filter) {
    where.user = {
      OR: [
        {
          username: {
            contains: data.filter,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: data.filter,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    skip: data.skip,
    take: data.take,
    orderBy: {
      amount: data.orderby,
    },
    select: {
      id: true,
      userId: true,
      amount: true,
      type: true,
      status: true,
      reference: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return transactions;
};
