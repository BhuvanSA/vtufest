"use client";

import React, { useEffect, useState } from "react";

interface FormData {
  name: string;
  usn: string;
  type: string;
  events: { eventNo: number; eventName: string }[]; // Updated to store event objects
  photo: File | null;
  phone: string;
  aadhar: File | null;
  sslc: File | null;
  puc: File | null;
  admission1: File | null;
  admission2: File | null;
  idcard: File | null;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    usn: "",
    type: "",
    events: [],
    photo: null,
    phone : "",
    aadhar: null,
    sslc: null,
    puc: null,
    admission1: null,
    admission2 : null,
    idcard: null,
  });

  const [eventCategories, setEventCategories] = useState([]);

  useEffect(() => {
    
    async function getEvents(){
      const res = await fetch('/api/getalleventregister',{
        method:"POST",
      });

      let {userEvents} = await res.json();
      console.log(userEvents)
      if(formData.type === 'PARTICIPANT'){
        console.log("filtering")
        userEvents = userEvents.filter(x => x.registeredParticipant < x.maxParticipant)
      }
      else if(formData.type === 'ACCOMPANIST'){
        userEvents = userEvents.filter(x => x.registeredAccompanist < x.maxAccompanist)
      }

      setEventCategories(userEvents)
    }
    getEvents()
  }, [formData.type])
  

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.usn) newErrors.usn = "USN is required.";
    if (!formData.type) newErrors.type = "Participant type is required.";
    if (formData.events.length === 0)
      newErrors.events = "Select at least one event.";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone number is required.";
    }    
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
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSizeInKB = 150;
  
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only JPEG, PNG, or PDF files are allowed.",
        }));
      } else if (file.size > maxSizeInKB * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: `File size must be less than ${maxSizeInKB} MB.`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    }
  };
  

  const handleEventSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const [eventNo, eventName] = value.split('|'); // Split the value into eventNo and eventName
    
    // Convert eventNo to a number
    const eventNoNumber = parseInt(eventNo, 10);
  
    setFormData((prev) => ({
      ...prev,
      events: checked
        ? [...prev.events, { eventNo: eventNoNumber, eventName }]
        : prev.events.filter((event) => event.eventNo !== eventNoNumber), // Remove event by eventNo
    }));
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "events") {
          formDataToSend.append(key, JSON.stringify(value)); // Stringify the array of event objects
        } else {
          formDataToSend.append(key, value as Blob | string); // Append files or string data
        }
      });
      
      try {
        const response = await fetch('/api/register', {
          method: "POST",
          body: formDataToSend,
        });
        const data = await response.json();
  
        if (data.success) {
          alert("Registration successful!");
        } else {
          alert(data.message || "An error occurred during registration.");
        }
      } catch (err) {
        alert("Failed to register. Please try again later.");
        console.error(err);
      }
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
          <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
              <label className="block text-sm font-medium text-yellow-600 mb-2">
               Phone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.phone ? "border-red-500" : "border-[#333333]"
                } rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
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
            </div>
          {/* Events */}
          <center>
            <h1 className="block text-2xl text-yellow-600 mb-4">Events</h1>
          </center>
          <div className="mb-6">
  <div className="grid grid-cols-2 gap-4">
    {Object.entries(
      eventCategories.reduce((acc, { category, eventNo, eventName }) => {
        if (!acc[category]) acc[category] = [];
        acc[category].push({ eventNo, eventName });
        return acc;
      }, {})
    ).map(([category, events], index) => (
      <fieldset
        key={index}
        className="mb-4 border-2 border-black p-2 rounded-lg hover:scale-105 transform transition-all"
      >
        <legend className="font-semibold text-yellow-600">{category}</legend>
        {(events as { eventNo: number; eventName: string }[]).map((event, i) => (
          <div
            key={i}
            className="flex items-center mb-1 hover:bg-gray-200 p-1 rounded-md transition-all"
          >
            <input
              type="checkbox"
              name="events"
              value={`${event.eventNo}|${event.eventName}`} // Store both eventNo and eventName
              onChange={handleEventSelection}
              className="mr-2 accent-yellow-400"
            />
            <label className="text-sm text-black">{event.eventName}</label>
          </div>
        ))}
      </fieldset>
    ))}
  </div>
  {errors.events && <p className="text-red-500 text-xs mt-1">{errors.events}</p>}
</div>

  
          {/* File Uploads */}
          <fieldset className="border-2 border-black p-4 rounded-lg hover:scale-105 transform transition-all">
            <legend className="font-semibold text-yellow-600">File Uploads</legend>
            <div className="space-y-4">
              {[
                "photo",
                "aadhar",
                "sslc",
                "puc",
                "idcard",
                "admission1",
                "admission2",
              ].map((fileField) => (
                <div key={fileField}>
                  <label
                    className="block text-sm font-small text-yellow-600 mb-1"
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