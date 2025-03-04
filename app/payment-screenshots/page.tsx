import prisma from "@/lib/db";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PaymentScreenshotsPage() {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  // Query all payment records (adjust the model name/fields as needed)
  const payments = await prisma.payment.findMany({
    select: {
      id: true,
      collegeName: true,
      paymentUrl: true,
    },
    orderBy: { collegeName: "asc" },
  });

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">All Payment Screenshots</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Sl No</th>
            <th className="border p-2">College Name</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment.id}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{payment.collegeName}</td>
              <td className="border p-2 text-center">
                <Link href={`/admin/payment-screenshots/${payment.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    View
                  </button>
                </Link>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td className="border p-2 text-center" colSpan={3}>
                No payment records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
