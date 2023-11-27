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
import { ArrowLeft, Loader2 } from "lucide-react";
import { createUser, validateUser } from "@/lib/actions/actions";
import { useRouter } from "next/navigation";
import { userFormSchema } from "@/lib/validations/validations";
import { sendVerificationRequest } from "@/app/api/auth/authemail";

export function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      passwd: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
    startTransition(async () => {
      try {
        data.passwd = data.passwd.trim();
        data.email = data.email.trim();
        await validateUser(data.email, data.passwd);
        await sendVerificationRequest(data.email);
        router.push("/verification?email=" + data.email);
      } catch (err) {
        if (err instanceof Error)
          toast({
            variant: "destructive",
            title: "Hubo un error al intentar iniciar sesion",
            description: err.message,
          });
      }
    });
  };

  return (
    <>
      <button onClick={() => router.push("/")} className="fixed left-4 top-4">
        <ArrowLeft />
      </button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-1/4 min-w-[320px]"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electronico</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
            Iniciar Sesión
          </Button>
        </form>
      </Form>
      <a
        className="mt-10 cursor-pointer"
        onClick={() => router.push("/signup")}
      >
        ¿No tienes una cuenta? <span className="underline">Registrate</span>
      </a>
    </>
  );
}
