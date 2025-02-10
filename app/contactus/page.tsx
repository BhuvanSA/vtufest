"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import bgImage from "../../components/images/GATBGIMG.png";

// Define the interface for the form fields
interface IContactForm {
  name: string;
  email: string;
  phone: string;
  college: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IContactForm>();

  const onSubmit = async (data: IContactForm) => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      alert("Form submitted and email sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  return (
    <div
      className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] text-[#bbc5c6]"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto">
        <div className="md:px-12 xl:px-6">
          <div className="relative">
            <div className="lg:w-2/3 mx-auto text-center">
              <h1 className="text-primary font-bold text-4xl md:text-6xl xl:text-7xl">
                Contact
                <span className="text-primary text-[#e2af3e]"> Us.</span>
              </h1>
            </div>

            <div className="flex flex-wrap justify-around mt-10 gap-8">
              {/* Contact Form */}
              <Card className="flex-1 max-w-lg p-6 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-600 text-center">
                    Feel free to contact us!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium">
                        Full name
                      </label>
                      <Input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        id="name"
                        placeholder="Full Name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium">
                        Email
                      </label>
                      <Input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        {...register("phone", {
                          required: "Phone is required",
                          pattern: {
                            value: /^[0-9]{10,15}$/,
                            message: "Enter a valid phone number",
                          },
                        })}
                        type="text"
                        id="phone"
                        placeholder="Phone Number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="college" className="block mb-2 text-sm font-medium">
                        College
                      </label>
                      <Input
                        {...register("college", { required: "College name is required" })}
                        type="text"
                        id="college"
                        placeholder="Enter your College Name"
                      />
                      {errors.college && (
                        <p className="text-red-500 text-sm mt-1">{errors.college.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-2 text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        {...register("message", { required: "Message is required" })}
                        id="message"
                        rows={4}
                        placeholder="Mention your query!"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Submit
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card className="flex-1 max-w-lg p-6 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-center">
                    Global Academy of Technology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>Email:</strong> vtufest@gat.ac.in
                  </p>
                  <p>
                    <strong>Phone:</strong>
                  </p>
                  {/* Two separate phone tiles */}
                  <div className="flex flex-col gap-4">
                    <div className="p-4 border rounded-md shadow-sm">
                      <p className="text-lg font-semibold">+91 9986770082</p>
                      <p className="text-sm text-gray-600">Lt. Saravannan R</p>
                      <p className="text-sm text-gray-600">Physical Education Director</p>
                    </div>
                    <div className="p-4 border rounded-md shadow-sm">
                      <p className="text-lg font-semibold">+91 8660041943</p>
                      <p className="text-sm text-gray-600">Mr. Abhishek</p>
                      <p className="text-sm text-gray-600">Junior Cultural Coordinator</p>
                    </div>
                  </div>
                  <p>
                    <strong>Address:</strong> 4, Bangarappanagar Main Rd, Rajarajeshwari Nagar,
                    Bengaluru, Karnataka 560098
                  </p>
                  <div className="mt-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7548449596075!2d77.52525822409484!3d12.923472037387445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3e4df6c0dca1%3A0x83c84d9e506b84b4!2sGlobal%20Academy%20Of%20Technology%2C%204%2C%20Bangarappanagar%20Main%20Rd%2C%20Bangarappanagar%2C%20Rajarajeshwari%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560098!5e0!3m2!1sen!2sin!4v1737016725143!5m2!1sen!2sin"
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
