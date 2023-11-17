"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
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
    return { message: "Password saved successfully" };
  } catch (e) {
    console.error("Error saving password:", e);
    throw new Error("Unable to save the password");
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
    return { message: "User registered successfully" };
  } catch (e) {
    console.error("Error registering user:", e);
    throw new Error("Unable to register the user");
  }
}

export async function insertToken(email: string, token: string) {
  const hashedToken = await bcrypt.hash(token, 10);
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      token: hashedToken,
    },
  });
  return { message: "Token inserted successfully" };
}

export async function validateUser(email: string, passwd: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Usuario no registrado");
  }

  const checkPassword = bcrypt.compareSync(passwd, user.password);

  if (!checkPassword) throw new Error("Correo o contraseña no validos");

  return { message: "User validated successfully" };
}

export async function validateToken(email: string, token: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("No se ha encontrado el usuario");
  }

  const checkToken = bcrypt.compareSync(token, user.token!);

  if (!checkToken) throw new Error("Token no Valido");

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      isVerified: true,
    },
  });
}
