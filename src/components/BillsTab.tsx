"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getAllBills } from "@/lib/actions/actions";
import { Product } from "@prisma/client";
import { BillsForm } from "./forms/BillsForm";

interface ProductOnBill {
  productId: String;
  quantity: number;
  product: Product;
}

interface Bill {
  id: number;
  buyer: string;
  createdAt: Date;
  totalAmount: number;
  products: ProductOnBill[];
}

export function BillsTab({ role }: { role: string }) {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    // Fetch bills from the database
    const fetchBills = async () => {
      const dbBills = await getAllBills();
      setBills(dbBills);
    };

    fetchBills();
  }, []);

  return (
    <>
      <div className="flex w-full justify-end mb-3">
        <BillsForm />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>{bill.id}</TableCell>
              <TableCell>{bill.buyer}</TableCell>
              <TableCell>{bill.createdAt.toISOString()}</TableCell>
              <TableCell>{bill.totalAmount}</TableCell>
              <TableCell>
                <ul>
                  {bill.products.map((productOnBill) => (
                    <li key={productOnBill.productId.toString()}>
                      {productOnBill.product.name} (Quantity:{" "}
                      {productOnBill.quantity})
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* Assuming you want to display the total amount of all bills */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Amount</TableCell>
            <TableCell className="text-right">
              ${bills.reduce((total, bill) => total + bill.totalAmount, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
