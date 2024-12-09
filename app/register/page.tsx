"use client";

import { RegistrationForm } from "@/components/forms/registration-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <RegistrationForm />
      </div>
    </div>
  );
}