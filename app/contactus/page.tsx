"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] text-[#bbc5c6]">
      <div className="container mx-auto">
        <div className="md:px-12 xl:px-6">
          <div className="relative">
            <div className="lg:w-2/3 mx-auto text-center">
              <h1 className="text-[#bbc5c6] font-bold text-4xl md:text-6xl xl:text-7xl">
                Contact
                <span className="text-primary text-[#e2af3e]"> US.</span>
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
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium">
                        Full name
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium">
                        Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="Phone Number"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="college" className="block mb-2 text-sm font-medium">
                        College
                      </label>
                      <Input
                        type="text"
                        id="college"
                        name="college"
                        placeholder="Enter your College Name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-2 text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Mention your query!"
                        required
                      />
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
                    <strong>Email:</strong> example@gat.edu
                  </p>
                  <p>
                    <strong>Phone:</strong>
                  </p>
                  <ul>
                    <li>+91 9999999999</li>
                    <li>+91 9999999999</li>
                  </ul>
                  <p>
                    <strong>Address:</strong> 4, Bangarappanagar Main Rd,
                    Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
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
