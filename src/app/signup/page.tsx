import { SignUpForm } from "@/components/forms/SignUpForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function SignUp() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <SignUpForm />
    </main>
  );
}
