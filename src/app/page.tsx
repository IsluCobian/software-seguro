import { PasswordForm } from "@/components/forms/PasswordForm";
import { MainHeader } from "@/components/header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-screen">
      <MainHeader />
      <main className="flex flex-grow flex-col items-center justify-center p-10">
        <PasswordForm />
      </main>
    </div>
  );
}
