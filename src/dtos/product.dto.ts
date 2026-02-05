import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  price: z
    .number({ message: "Price must be a number" })
    .positive("Price must be greater than 0"),

  stock: z
    .number({ message: "Stock must be a number" })
    .min(0, "Stock cannot be negative"),

  description: z.string().optional(),

  isActive: z.boolean().optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().min(1, "Name cannot be empty").optional(),

    description: z.string().min(1, "Description cannot be empty").optional(),

    price: z
      .number({ message: "Price must be a number" })
      .positive("Price must be greater than 0")
      .optional(),

    stock: z
      .number({ message: "Stock must be a number" })
      .min(0, "Stock cannot be negative")
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export type AddProductDTO = z.infer<typeof addProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
