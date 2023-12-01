import { z } from "zod";

export const passwdSchema = z.object({
  passwd: z
    .string()
    .min(8, {
      message: "La contraseña debe de contener por los menos 8 caracteres",
    })
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
          value
        ),
      {
        message:
          "La contraseña debe contener al menos una letra mayúscula, \nuna letra minúscula, \nun carácter especial \ny un número.",
      }
    ),
});

export const userFormSchema = z.object({
  passwd: z
    .string()
    .min(8, {
      message: "La contraseña debe de contener por los menos 8 caracteres",
    })
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
          value
        ),
      {
        message:
          "La contraseña debe contener al menos una letra mayúscula, \nuna letra minúscula, \nun carácter especial \ny un número.",
      }
    ),
  email: z.string().email("Correo electronico no valido"),
});

export const emailSchema = z.object({
  token: z.string(),
  email: z.string().email("Correo electronico no valido"),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
});

// Define a schema for a product on a bill
const productOnBillSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
});

// Define the main bill schema
export const billSchema = z.object({
  id: z.number(),
  buyer: z.string(),
  createdAt: z.date(),
  totalAmount: z.number(),
  products: z.array(productOnBillSchema),
});
