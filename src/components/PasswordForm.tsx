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
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (datos: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        datos.username = datos.username.trim();
        form.reset(datos);
      } catch (err) {
        if (err instanceof Error)
          toast({
            variant: "destructive",
            title: "Hubo un error al intentar actualizar tus datos.",
            description: err.message,
          });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
          Siguiente
        </Button>
      </form>
    </Form>
  );
}
