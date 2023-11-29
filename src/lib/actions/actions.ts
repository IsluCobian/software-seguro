"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import {
  billSchema,
  emailSchema,
  passwdSchema,
  productSchema,
  userFormSchema,
} from "../validations/validations";
import { env } from "../env.mjs";

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
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 10);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      token: hashedToken,
      expires: expirationDate,
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

  const currentDateTime = new Date();
  if (user.expires && currentDateTime > user.expires) {
    throw new Error("El token ha expirado");
  }

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      isVerified: true,
    },
  });

  const session = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  const jwtToken = sign(
    { email: user.email, role: user.role },
    env.JWT_SECRET_KEY
  );

  // Set the JWT as a cookie
  cookies().set({
    name: "session",
    value: jwtToken,
    httpOnly: true,
    path: "/",
  });
}

export async function deleteSession() {
  cookies().delete("session");
}

//Product Action

export async function getAllProducts() {
  const products = await prisma.product.findMany();
  return products;
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  const { name, description, price } = data;
  try {
    await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
      },
    });
    return { message: "Producto Agregado" };
  } catch (e) {
    throw new Error("No se pudo añadir el producto");
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
  } catch (e) {}
}

//Bills Actions
export async function getAllBills() {
  const bills = await prisma.bill.findMany({
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  return bills;
}

export async function createBill(data: z.infer<typeof billSchema>) {
  try {
    const totalAmount = data.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    const createdBill = await prisma.bill.create({
      data: {
        buyer: data.buyer,
        totalAmount: totalAmount, // Calculate total amount based on price and quantity
        products: {
          create: data.products.map((product) => ({
            // Assuming 'productId' and 'quantity' are fields in the join table
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      include: {
        products: true, // Include associated products in the result
      },
    });

    return createdBill;
  } catch (error) {
    throw new Error("Error al crear la compra");
  } finally {
    await prisma.$disconnect();
  }
}
