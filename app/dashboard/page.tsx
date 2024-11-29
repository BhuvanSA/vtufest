import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome to VTU Fest Dashboard, {session.user?.name}!
                    </h1>
                    <p className="mt-4 text-gray-600">
                        You have successfully logged in to the VTU Fest
                        platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
