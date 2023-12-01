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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { productSchema } from "@/lib/validations/validations";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/actions";

interface ProductFormProps {
  onProductAction: () => void;
  initialValues?: z.infer<typeof productSchema>;
}

export function ProductForm({
  onProductAction,
  initialValues,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      price: 0.0,
    },
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    startTransition(async () => {
      try {
        if (initialValues) {
          await updateProduct(initialValues.id, data);
          toast({
            title: "Producto Actualizado",
          });
        } else {
          await createProduct(data);
          toast({
            title: "Producto Añadido",
          });
        }
        form.reset();
        onProductAction();
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
        <Button className="bg-emerald-500 text-white">Añadir Producto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "Editar Producto" : "Añadir Producto"}
          </DialogTitle>
          <DialogDescription>
            {initialValues
              ? "Aquí puedes editar tu producto"
              : "Aquí puedes agregar tus productos"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del producto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
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
              {initialValues ? "Actualizar" : "Añadir"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
