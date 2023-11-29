"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductForm } from "./forms/ProductForm";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/actions/actions";
import { Product } from "@prisma/client";

export function ProductsTab({ role }: { role: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from the database
    const fetchProducts = async () => {
      const dbProducts = await getAllProducts();
      setProducts(dbProducts);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex w-full justify-end mb-3">
        <ProductForm />
      </div>
      <Table>
        <TableHeader className="bg-neutral-100">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead className="text-right">Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell className="text-right">${product.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* Assuming you want to display the total price of all products */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Price</TableCell>
            <TableCell className="text-right">
              ${products.reduce((total, product) => total + product.price, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
