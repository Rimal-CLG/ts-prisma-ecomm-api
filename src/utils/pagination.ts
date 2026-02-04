export interface PaginationArgs {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export interface PaginationRTN {
  skip: number;
  take: number;
  orderby: "asc" | "desc";
}

export function pagination(data: PaginationArgs): PaginationRTN {
  if (!data.page || !data.limit) {
    data.page = 1;
    data.limit = 10;
  }
  let orderby: "asc" | "desc" = "desc";
  if (data.sort === "asc" || data.sort === "desc") {
    orderby = data.sort;
  }
  const skip = (data.page - 1) * data.limit;
  const take = Number(data.limit);
  return { skip, take, orderby };
}

