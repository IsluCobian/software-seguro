import Image from "next/image";
import { PasswordForm } from "@/components/PasswordForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PasswordForm />
    </main>
  );
}
