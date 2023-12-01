import { BillsTab } from "@/components/BillsTab";
import { LogOutButton } from "@/components/LogoutButton";
import { ProductsTab } from "@/components/ProductsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { env } from "@/lib/env.mjs";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/");
  }

  const decodedToken: any = verify(session.value, env.JWT_SECRET_KEY);
  const userRole = decodedToken.role;
  const user = decodedToken.email;

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="flex w-full flex-row justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <LogOutButton />
      </div>
      {user}
      <Tabs
        defaultValue="products"
        className="flex flex-col mt-5 w-full items-center justify-center"
      >
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          {userRole !== "USER" && (
            <TabsTrigger value="bills">Facturas</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="products" className="flex w-full flex-col mt-3">
          <ProductsTab role={userRole} />
        </TabsContent>
        <TabsContent value="bills" className="flex w-full flex-col mt-3">
          <BillsTab role={userRole} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
