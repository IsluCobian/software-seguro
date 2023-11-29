"use client";

import { NavigationMenu } from "@radix-ui/react-navigation-menu";
import { NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function MainHeader() {
  const router = useRouter();
  return (
    <div className="flex flex-row justify-between px-5 py-6 space-x-3">
      <h1>Software Seguro</h1>
      <div>
        <Button onClick={() => router.push("/signin")}>Sign In</Button>
        <Button variant={"outline"} onClick={() => router.push("/signup")}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}
