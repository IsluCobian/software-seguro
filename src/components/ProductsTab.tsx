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
import { deleteProduct, getAllProducts } from "@/lib/actions/actions";
import { Product } from "@prisma/client";
import { Button } from "./ui/button";
import { PenSquare, Trash2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

export function ProductsTab({ role }: { role: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch products from the database
    const fetchProducts = async () => {
      const dbProducts = await getAllProducts();
      setProducts(dbProducts);
    };

    fetchProducts();
  }, []);

  const eraseProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Producto Eliminado",
      });
    } catch (error) {}
  };

  return (
    <>
      {role === "ADMIN" && (
        <div className="flex w-full justify-end mb-3">
          <ProductForm />
        </div>
      )}
      <Table>
        <TableHeader className="bg-neutral-100">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            {role !== "USER" && (
              <TableHead className="w-[125px]">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell className="text-right">${product.price}</TableCell>
              {role !== "USER" && (
                <TableCell className="text-white">
                  <Button size={"sm"} className="bg-red-600">
                    <Trash2 size={16} />
                  </Button>
                  <Button size={"sm"} className="bg-cyan-600 ml-2">
                    <PenSquare size={16} />
                  </Button>
                </TableCell>
              )}
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
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
