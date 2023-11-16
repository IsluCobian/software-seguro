"use server";

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  emailSchema,
  passwdSchema,
  userFormSchema,
} from "../validations/validations";

const prisma = new PrismaClient();

export async function savePassword(data: z.infer<typeof passwdSchema>) {
  const { passwd } = data;
  const hashedPassword = await bcrypt.hash(passwd, 10);
  try {
    await prisma.password.create({
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

export async function createUser(data: z.infer<typeof userFormSchema>) {
  const { email, passwd } = data;
  const hashedPassword = await bcrypt.hash(passwd, 10);
  try {
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    // Return a success message or some other indicator of success.
    return { message: "Usuario Registrado" };
  } catch (e) {
    console.error("Error saving password:", e);
    throw new Error("No se pudo registrar el usuario");
  }
}

export async function InsertToken(email: string, token: string) {
  const hashedToken = await bcrypt.hash(token, 10);
  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        token: hashedToken,
      },
    });
    // Return a success message or some other indicator of success.
    return { message: "Usuario Registrado" };
  } catch (e) {
    console.error("Error saving password:", e);
    throw new Error("No se pudo registrar el usuario");
  }
}
