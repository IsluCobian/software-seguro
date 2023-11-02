"use server";

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

const formSchema = z.object({
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

export async function savePassword(data: z.infer<typeof formSchema>) {
  const { passwd } = data;
  const hashedPassword = await bcrypt.hash(passwd, 10);
  try {
    const savedPassword = await prisma.password.create({
      data: {
        password: hashedPassword,
      },
    });
    // Return a success message or some other indicator of success.
    return { message: "Contraseña guardada exitosamente" };
  } catch (e) {
    console.error("Error saving password:", e);
    throw new Error("No se pudo guardar la contraseña");
  }
}
