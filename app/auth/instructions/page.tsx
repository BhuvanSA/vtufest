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
  detailImage = "/images/Untitled design-3.png", // Replace with your image URL if needed
}: InstructionStepProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-xl bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-400 rounded-lg p-6 shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-4">{icon}</div>}
        <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-red-600 via-[#800000] to-red-900 bg-clip-text text-transparent">
          Step {stepNumber}: {title}
        </h2>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="px-4 py-2 bg-yellow-300 text-red-800 font-bold rounded-full focus:outline-none hover:bg-yellow-400 transition-colors duration-200"
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
      "Register your college on the Sign-Up page using your official principal's email. Only verified principal email IDs are accepted. If your email isn't listed, contact support immediately at 9945864767 or via our website.",
    icon: <UserPlus className="h-10 w-10 text-red-700" />,
  },
  {
    stepNumber: 2,
    title: "Login",
    description:
      "An OTP is sent to your principal’s email for verification. Once verified, use the credentials sent to log in. If you face any issues, use the 'Forgot Password' option or contact our support team. Remember to check your spam folder.",
    icon: <LogIn className="h-10 w-10 text-red-700" />,
  },
  {
    stepNumber: 3,
    title: "Select Events",
    description:
      "After logging in, view the event categories. Click the down arrow to expand and see available events. Select the events your college wishes to participate in—the selected events will highlight in yellow, confirming your choice.",
    icon: <List className="h-10 w-10 text-red-700" />,
  },
  {
    stepNumber: 4,
    title: "Add Individual Participants",
    description:
      "Use the 'Add Registrant' option to register individual students. Ensure each student's event selection is correct. If you are a Team Manager, select the appropriate option before adding registrants.",
    icon: <User className="h-10 w-10 text-red-700" />,
  },
  {
    stepNumber: 5,
    title: "Review & Update Registrants",
    description:
      "Review the list of registered students and update any event selections, personal details, or documents as needed. Double-check all details since errors cannot be corrected after submission.",
    icon: <Clipboard className="h-10 w-10 text-red-700" />,
  },
  {
    stepNumber: 6,
    title: "Proceed to Payment",
    description:
      "Once all registrations are complete, click the 'Go to Payments' button. Provide your contingent's date & time of arrival to help us arrange accommodations and smooth event coordination.",
    icon: <CreditCard className="h-10 w-10 text-red-700" />,
  },
  {
    stepNumber: 7,
    title: "Complete Payment",
    description:
      "Make your payment via UPI (₹4,000 for up to 10 events; ₹8,000 for 11 or more events). Upload your transaction details and a screenshot for verification. Upon successful verification, your registration is confirmed.",
    icon: <CheckCircle className="h-10 w-10 text-red-700" />,
  },
];

export default function RegistrationInstructions() {
  return (
    <div className="min-h-screen bg-[#990000] text-yellow-300 flex flex-col items-center py-12">
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
      {/* Bottom Navigation Buttons */}
      <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-center space-y-4 md:space-y-0 md:space-x-8">
        <Link
          href="/auth/signin"
          className="inline-block px-8 py-4 bg-yellow-300 text-red-700 font-extrabold rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
        >
          Go to Login
        </Link>
        <Link
          href="/faqs"
          className="inline-block px-8 py-4 bg-yellow-300 text-red-700 font-extrabold rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
        >
          FAQs
        </Link>
        <a
          href="https://drive.google.com/file/d/1QBE6_h0-ug72q9CDKtZ4_B3IKWzXC6sh/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-yellow-300 text-red-700 font-extrabold rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
        >
          For more detailed Info: Registration guide
        </a>
      </div>
      {/* Additional Image at the End */}
      <div className="mt-12">
        <img
          src="/images/Untitled design-3.png"
          alt="Additional Visual"
          className="mx-auto rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
}
