import Image from "next/image";
import { PasswordForm } from "@/components/PasswordForm";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MainHeader } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <MainHeader />
      <main className="flex flex-grow flex-col items-center justify-center p-10">
        <PasswordForm />
      </main>
    </div>
  );
}
