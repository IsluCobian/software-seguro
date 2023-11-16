"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRef, useState, useTransition } from "react";
import { useToast } from "./ui/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { validateUser } from "@/lib/actions/actions";

const formSchema = z.object({
  number: z.string().min(1).max(1),
});

export function VerificationForm() {
  const [code, setCode] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isCodeComplete = code.length === 6;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        //const res = await validateUser(data.email, code);

        router.refresh();
      } catch (err) {
        if (err instanceof Error)
          toast({
            variant: "destructive",
            title: "Oh no, algo ha pasado",
            description: err.message,
          });
      }
    });
  };

  const reenviarCodigo = async () => {
    startTransition(async () => {
      try {
        reiniciarCodigo();
        toast({
          title: "Codigo reenviado",
        });
      } catch (err) {
        if (err instanceof Error)
          toast({
            variant: "destructive",
            title: "Oh no, algo ha pasado",
            description: err.message,
          });
      }
    });
  };

  // Refs to control each digit input element
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset all inputs and clear state
  const reiniciarCodigo = () => {
    inputRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.value = "";
      }
    });
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
    setCode("");
  };

  // Handle input
  function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    // Update code state with single digit
    const codigoNuevo = [...code];
    // Convert lowercase letters to uppercase
    if (/^[a-z]+$/.test(input.value)) {
      const uc = input.value.toUpperCase();
      codigoNuevo[index] = uc;
      if (inputRefs[index].current) {
        inputRefs[index].current!.value = uc;
      }
    } else {
      codigoNuevo[index] = input.value;
    }
    setCode(codigoNuevo.join(""));

    input.select();

    if (input.value === "") {
      // If the value is deleted, select previous input, if exists
      if (previousInput && previousInput.current) {
        previousInput.current.focus();
      }
    } else if (nextInput && nextInput.current) {
      // Select next input on entry, if exists
      nextInput.current.select();
    }
  }

  // Select the contents on focus
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  // Handle backspace key
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    const input = e.target as HTMLInputElement;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1)
      );
      if (previousInput && previousInput.current) {
        previousInput.current.focus();
      }
    }
  }

  // Capture pasted characters
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const codigoPegado = e.clipboardData.getData("text");
    if (codigoPegado.length === 6) {
      setCode(codigoPegado);
      inputRefs.forEach((inputRef, index) => {
        if (inputRef.current) {
          inputRef.current.value = codigoPegado.charAt(index);
        }
      });
    }
  };

  return (
    <div className="h-full items-center w-4/12 bg-white px-7 py-10 md:inset-0">
      <button onClick={() => router.back()} className="fixed left-4 top-4">
        <ArrowLeft />
      </button>
      <section className=" flex flex-col space-y-3">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
          Ingresa el código enviado <br /> a tu correo
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Te enviamos un codigo a tu correo: <br />
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="relative flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Input
                  className="flex h-12 w-full rounded-sm border border-input bg-background px-2 py-2 text-center text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  key={index}
                  type="text"
                  maxLength={1}
                  onChange={(e) => handleInput(e, index)}
                  ref={inputRefs[index]}
                  autoFocus={index === 0}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Button
                variant={"outline"}
                className="w-full"
                type="button"
                onClick={reenviarCodigo}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reenviar Código
              </Button>
              <Button
                disabled={!isCodeComplete || isPending}
                className="w-full"
                onClick={onSubmit}
                type="submit"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
