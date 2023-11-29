"use client";

import { deleteSession } from "@/lib/actions/actions";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function LogOutButton() {
  const router = useRouter();

  const onClick = async () => {
    await deleteSession();
    router.replace("/");
  };

  return (
    <Button variant={"destructive"} onClick={onClick}>
      Cerrar sesión
    </Button>
  );
}
