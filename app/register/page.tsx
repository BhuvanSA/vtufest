"use client";

import React, { useState } from "react";

const eventCategories = {
  MUSIC: [
    "Classical Vocal Solo (Hindustani/Carnatic)",
    "Classical Instrumental Solo (Percussion Tala Vadya)",
    "Classical Instrumental Solo (Non-Percussion Swara Vadya)",
    "Light Vocal Solo (Indian)",
    "Western Vocal Solo",
    "Group Song (Indian)",
    "Group Song (Western)",
    "Folk Orchestra",
  ],
  DANCE: ["Folk / Tribal Dance", "Classical Dance Solo"],
  THEATRE: ["Skit", "Mime", "Mimicry", "One Act Play"],
  LITERARY: ["Quiz", "Debate", "Elocution"],
  "FINE-ARTS": [
    "Collage",
    "Rangoli",
    "Cartooning",
    "Installation",
    "Poster Making",
    "Clay Modelling",
    "On Spot Painting",
    "Spot Photography",
  ],
};

interface FormData {
  name: string;
  usn: string;
  type: string;
  events: string[];
  photo: File | null;
  aadhar: File | null;
  sslc: File | null;
  puc: File | null;
  admission: File | null;
  idcard: File | null;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    usn: "",
    type: "",
    events: [],
    photo: null,
    aadhar: null,
    sslc: null,
    puc: null,
    admission: null,
    idcard: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.usn) newErrors.usn = "USN is required.";
    if (!formData.type) newErrors.type = "Participant type is required.";
    if (formData.events.length === 0)
      newErrors.events = "Select at least one event.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleEventSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      events: checked
        ? [...prev.events, value]
        : prev.events.filter((event) => event !== value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data:", formData);
      // Perform API call here
    }
  };

  return (
    <section
      id="register"
      className="min-h-screen py-16 px-4 bg-gray-200 flex justify-center items-center"
    >
      <div className="w-full max-w-4xl p-6 bg-white text-white shadow-lg rounded-md">
        <h2
          className="text-2xl font-bold mb-6 text-yellow-800 font-Barrio text-center"
          style={{
            textShadow: "2px 2px 8px rgba(255, 255, 0, 0.7)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Registrant Page
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name and USN */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-yellow-600 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.name ? "border-red-500" : "border-[#333333]"
                } rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600 mb-2">
                USN
              </label>
              <input
                type="text"
                name="usn"
                placeholder="Enter your USN"
                value={formData.usn}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.usn ? "border-red-500" : "border-[#333333]"
                } rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500`}
              />
              {errors.usn && (
                <p className="text-red-500 text-xs mt-1">{errors.usn}</p>
              )}
            </div>
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-yellow-600 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.type ? "border-red-500" : "border-[#333333]"
              } rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500`}
            >
              <option value="">Select type</option>
              <option value="PARTICIPANT">PARTICIPANT</option>
              <option value="TEAMMANAGER">TEAM MANAGER</option>
              <option value="ACCOMPANIST">ACCOMPANIST</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          {/* Events */}
          <center>
            <h1 className="block text-2xl text-yellow-600 mb-4">Events</h1>
          </center>

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Event Categories */}
              {Object.entries(eventCategories).map(([category, events]) => (
                <fieldset
                  key={category}
                  className="mb-4 border-2 border-black p-2 rounded-lg hover:scale-105 transform transition-all"
                >
                  <legend className="font-semibold text-yellow-600">
                    {category}
                  </legend>
                  {events.map((event) => (
                    <div
                      key={event}
                      className="flex items-center mb-1 hover:bg-gray-200 p-1 rounded-md transition-all"
                    >
                      <input
                        type="checkbox"
                        name="events"
                        value={event}
                        onChange={handleEventSelection}
                        className="mr-2 accent-yellow-400"
                      />
                      <label className="text-sm text-black">{event}</label>
                    </div>
                  ))}
                </fieldset>
              ))}

              {/* File Uploads */}
              <fieldset className="border-2 border-black p-4 rounded-lg hover:scale-105 transform transition-all">
                <legend className="font-semibold text-yellow-600">
                  File Uploads
                </legend>
                <div className="space-y-4">
                  {[
                    "photo",
                    "aadhar",
                    "sslc",
                    "puc",
                    "idcard",
                    "proof of admission [first semester]",
                    "proof of admission [current semester]",
                  ].map((fileField) => (
                    <div key={fileField}>
                      <label
                        className="block text-sm font-small text-yellow-600 mb-1 "
                        htmlFor={fileField}
                      >
                        {fileField.toUpperCase()}:
                      </label>
                      <input
                        type="file"
                        id={fileField}
                        name={fileField}
                        onChange={handleFileChange}
                        className="w-full text-sm text-black bg-white-600 p-0 rounded-lg focus:outline-white hover:bg-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            {errors.events && (
              <p className="text-red-500 text-xs mt-1">{errors.events}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
