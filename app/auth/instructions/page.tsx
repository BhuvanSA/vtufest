"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  UserPlus,
  LogIn,
  List,
  User,
  CreditCard,
  CheckCircle,
  Clipboard,
} from "lucide-react";

interface InstructionStepProps {
  stepNumber: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  detailImage?: string;
}

function InstructionStep({
  stepNumber,
  title,
  description,
  icon,
  detailImage = "https://via.placeholder.com/400x200", // Replace with your image URL
}: InstructionStepProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-xl bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-400 rounded-lg p-6 shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-4">{icon}</div>}
        <h2 className="text-2xl font-bold tracking-wide text-red-600">
          Step {stepNumber}: {title}
        </h2>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="px-4 py-2 bg-yellow-300 text-red-600 font-bold rounded-full focus:outline-none hover:bg-yellow-400 transition-colors duration-200"
        >
          {expanded ? "Hide Details" : "Show Details"}
        </button>
      </div>
      <div
        className={`mt-4 overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-lg leading-relaxed text-red-600">{description}</p>
        {expanded && (
          <img
            src={detailImage}
            alt="Detail visual"
            className="mt-4 rounded-lg shadow-lg"
          />
        )}
      </div>
    </div>
  );
}

const instructions = [
  {
    stepNumber: 1,
    title: "College Registration",
    description:
      "Register your college on the sign-up page using your registered principal e-mail id. You will receive your login credentials on your mail ID.",
    icon: <UserPlus className="h-10 w-10 text-red-600" />,
  },
  {
    stepNumber: 2,
    title: "Login",
    description: "Use the credentials you receive via email to log in to the website.",
    icon: <LogIn className="h-10 w-10 text-red-600" />,
  },
  {
    stepNumber: 3,
    title: "Select Events",
    description:
      "Select the entire number of events that your college wants to participate in.",
    icon: <List className="h-10 w-10 text-red-600" />,
  },
  {
    stepNumber: 4,
    title: "Add Individual Participants",
    description:
      "Register individual students using the 'Add Registrant' option and select the events each student will participate in.",
    icon: <User className="h-10 w-10 text-red-600" />,
  },
  {
    stepNumber: 5,
    title: "Review & Update Registrants",
    description:
      "Review the list of registered students. Update any registrant's event selection, personal data, or documents if needed.",
    icon: <Clipboard className="h-10 w-10 text-red-600" />,
  },
  {
    stepNumber: 6,
    title: "Proceed to Payment",
    description:
      "Once all student registrations are complete, click the 'Go to Payments' button to move to the payments page.",
    icon: <CreditCard className="h-10 w-10 text-red-600" />,
  },
  {
    stepNumber: 7,
    title: "Complete Payment",
    description:
      "Complete the payment using UPI. After payment, you will receive a confirmation email along with a PDF containing the data of your registered college students.",
    icon: <CheckCircle className="h-10 w-10 text-red-600" />,
  },
];

export default function RegistrationInstructions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-900 text-yellow-300 flex flex-col items-center py-12">
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wide drop-shadow-lg">
        Registration Process Instructions
      </h1>
      <div className="flex flex-col items-center space-y-8">
        {instructions.map((instruction, index) => (
          <React.Fragment key={instruction.stepNumber}>
            <InstructionStep {...instruction} />
            {index < instructions.length - 1 && (
              <ArrowDownCircle className="h-10 w-10 text-yellow-300 animate-bounce" />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center space-y-4">
        <Link
          href="/auth/signin"
          className="inline-block px-8 py-4 bg-yellow-300 text-red-600 font-extrabold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Go to Login
        </Link>
        <Link
          href="/faqs"
          className="inline-block px-8 py-4 bg-yellow-300 text-red-600 font-extrabold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          FAQs
        </Link>
      </div>
    </div>
  );
}
