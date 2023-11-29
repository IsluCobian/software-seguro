"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { billSchema } from "@/lib/validations/validations";
import { Textarea } from "../ui/textarea";
import { createProduct, getAllProducts } from "@/lib/actions/actions";
import { Product } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function BillsForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from the database
    const fetchProducts = async () => {
      const dbProducts = await getAllProducts();
      setProducts(dbProducts);
    };

    fetchProducts();
  }, []);

  const form = useForm<z.infer<typeof billSchema>>({
    resolver: zodResolver(billSchema),
  });

  const onSubmit = async (data: z.infer<typeof billSchema>) => {
    startTransition(async () => {
      try {
        toast({
          title: "Producto Añadido",
        });
        form.reset();
        setOpen(false);
      } catch (err) {
        if (err instanceof Error)
          toast({
            variant: "destructive",
            title: "Hubo un error al intentar registrar el usuario",
            description: err.message,
          });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 text-white">Añadir Compra</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Producto</DialogTitle>
          <DialogDescription>
            Aqui puedes agregar tus productos
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="buyer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del cliente</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="products"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.name}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isDirty || isPending}
              className="w-full"
              type="submit"
              variant="outline"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Añadir
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
