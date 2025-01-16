'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import Layout from "./layout"; // Adjust the path if necessary
import Image from "next/image";



const events = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Event ${i + 1}`,
  description: `Detailed rules and regulations for Event ${i + 1}. These include key guidelines and policies that all participants need to follow. Make sure to review all the instructions before attending the event to avoid any discrepancies.`,
  coordinator: `Coordinator: John Doe`,
}));

const EventRulesPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Rules and Regulations for Events
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-6 border border-gray-300 rounded-md transition-shadow duration-300 hover:shadow-[0_4px_15px_0_rgba(0,112,243,0.75)]"
            >
              <CardHeader className="flex flex-col items-center mb-4">
                <Image
                  src="/images/college-logo.png"
                  alt="College Logo"
                  width={50}
                  height={50}
                  priority
                  className="object-contain mb-2"
                />
                <CardTitle className="text-lg font-semibold text-center">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="mb-4">
                <CardDescription className="text-gray-600 text-sm text-justify">
                  {event.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="text-gray-700 text-sm text-right">
                {event.coordinator}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default EventRulesPage;
