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
