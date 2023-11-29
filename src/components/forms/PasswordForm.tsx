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
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { savePassword } from "@/lib/actions/actions";

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

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwd: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        data.passwd = data.passwd.trim();
        await savePassword(data);
        form.reset();
        toast({
          title: "Contraseña Guardada",
        });
      } catch (err) {
        if (err instanceof Error)
          toast({
            variant: "destructive",
            title: "Hubo un error al intentar guardar la contraseña.",
            description: err.message,
          });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-1/4 min-w-[320px]"
      >
        <FormField
          control={form.control}
          name="passwd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input {...field} />
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
          Guardar
        </Button>
      </form>
    </Form>
  );
}
