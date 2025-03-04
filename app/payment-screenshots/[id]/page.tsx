import prisma from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Payment {
  id: string;
  collegeName: string;
  paymentUrl: string;
}

export default async function PaymentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  // Fetch payment record by id
  const payment: Payment | null = await prisma.payment.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      collegeName: true,
      paymentUrl: true,
    },
  });

  if (!payment) {
    return (
      <div className="min-h-screen p-6">
        <p>Payment record not found.</p>
        <Link href="/admin/payment-screenshots">
          <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
            Back to List
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">
        Payment Screenshot for {payment.collegeName}
      </h1>
      <div className="border p-4">
        <Image
          src={payment.paymentUrl}
          alt={`Payment screenshot for ${payment.collegeName}`}
          width={500}
          height={500}
          className="rounded"
        />
      </div>
      <Link href="/admin/payment-screenshots">
        <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
          Back to List
        </button>
      </Link>
    </div>
  );
}
