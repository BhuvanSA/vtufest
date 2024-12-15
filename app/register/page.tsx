"use client";

import React, { useEffect, useState } from "react";

enum type {
  PARTICIPANT = "PARTICIPANT",
  ACCOMPANIST = "ACCOMPANIST",
}

interface FormData {
  name: string;
  usn: string;
  teamManager : boolean;
  events:  { eventNo: number; eventName: string; type: string }[]; // Updated to store event objects
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
    teamManager:false,
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
  const [selectedEvents, setSelectedEvents] = useState([])
  useEffect(() => {
    
    async function getEvents(){
      const res = await fetch('/api/getalleventregister',{
        method:"POST",
      });

      let {userEvents} = await res.json();
      console.log(userEvents)
      if(formData.teamManager != true){
        console.log("filtering")
        userEvents = userEvents.filter(x => x.registeredParticipant < x.maxParticipant || x.registeredAccompanist <x.maxAccompanist)
        setEventCategories(userEvents)
      }
      else{
      setEventCategories([])
      }
    }
    getEvents()
  }, [formData.teamManager])
  

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Name validation
    if (!formData.name) newErrors.name = "Name is required.";
    
    // USN validation
    if (!formData.usn) newErrors.usn = "USN is required.";
    
    // Team Manager validation
    if (!formData.teamManager) newErrors.type = "team manager type is required.";
    
    // Events validation for non-Team Managers
    if (formData.teamManager === false && formData.events.length === 0)
      newErrors.events = "Select at least one event.";
    
    // Phone validation
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone number is required.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "teamManager" ? (value === "true" ? true : false) : value;
    
      setFormData((prev) => ({ ...prev, [name]: updatedValue }));
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
    const [eventNo, eventName] = value.split("|"); // Split value into eventNo and eventName
  
    const eventNoNumber = parseInt(eventNo, 10);
  
    const updatedSelectedEvents = checked
      ? [
          ...selectedEvents,
          { eventNo: eventNoNumber, eventName, type: "" }, // Initially set role to empty
        ]
      : selectedEvents.filter((event) => event.eventNo !== eventNoNumber); // Remove event by eventNo
  
    setSelectedEvents(updatedSelectedEvents);
  
    // Update formData.events as well
    setFormData((prevFormData) => ({
      ...prevFormData,
      events: updatedSelectedEvents,
    }));
  };
  
  const handleRoleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    eventNo: number
  ) => {
    const type = e.target.value;
  
    setSelectedEvents((prevSelectedEvents) => {
      const updatedSelectedEvents = prevSelectedEvents.map((event) =>
        event.eventNo === eventNo ? { ...event, type } : event
      );
  
      // Update formData.events in sync
      setFormData((prevFormData) => ({
        ...prevFormData,
        events: updatedSelectedEvents,
      }));
  
      return updatedSelectedEvents; // Return the updated state
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {

    
    e.preventDefault();
    console.log("hit")
    console.log('Name:', formData.name);
    console.log('USN:', formData.usn);
    console.log('Team Manager:', formData.teamManager);
    console.log('Phone:', formData.phone);
    
    // Logging events array
    console.log('Events:');
    console.log(formData.events)
    // Logging file fields
    console.log('Photo:', formData.photo);
    console.log('Aadhar:', formData.aadhar);
    console.log('SSLC:', formData.sslc);
    console.log('PUC:', formData.puc);
    console.log('Admission1:', formData.admission1);
    console.log('Admission2:', formData.admission2);
    console.log('ID Card:', formData.idcard);
    

    // if (validate()) {
      console.log("val")
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "events") {
          formDataToSend.append(key, JSON.stringify(value)); // Stringify the array of event objects
        } else {
          formDataToSend.append(key, value as Blob | string); // Append files or string data
        }
      });

      console.log(formDataToSend.get("events"))
      
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
              Are you registering as Team Manager?
            </label>
            <div className="flex items-center">
              <label className="mr-4 text-black">
                <input
                  type="radio"
                  name="teamManager"
                  value="true"
                  checked={formData.teamManager === true}
                  onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="mr-4 text-black">
                <input
                  type="radio"
                  name="teamManager"
                  value="false"
                  checked={formData.teamManager === false}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
            {errors.teamManager && (
              <p className="text-red-500 text-xs mt-1">{errors.teamManager}</p>
            )}
          </div>
            </div>
          {/* Events */}
          <center>
            <h1 className="block text-2xl text-yellow-600 mb-4">Events</h1>
          </center>
          <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
          {eventCategories.map((event, index) => (
  <fieldset
    key={index}
    className="mb-4 border-2 border-black p-2 rounded-lg hover:scale-105 transform transition-all"
  >
    <legend className="font-semibold text-yellow-600">
      {event.category}
    </legend>
    <div className="flex items-center mb-1 hover:bg-gray-200 p-1 rounded-md transition-all">
      <input
        type="checkbox"
        name="events"
        value={`${event.eventNo}|${event.eventName}`}
        onChange={handleEventSelection}
        className="mr-2 accent-yellow-400"
      />
      <label className="text-sm text-black">
        {event.eventName}
      </label>
    </div>

    {selectedEvents
      .filter((e) => e.eventNo === event.eventNo)
      .map((selectedEvent) => (
        <div key={selectedEvent.eventNo} className="mt-2">
          <label className="text-sm text-black">Select Type</label>
          <select
            value={selectedEvent.type}
            onChange={(e) => handleRoleChange(e, selectedEvent.eventNo)}
            className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
          >
            <option value="">Select type</option>

            {/* Only show "Participant" if registeredParticipant < maxParticipant */}
            {event.registeredParticipant < event.maxParticipant && (
              <option value="PARTICIPANT">Participant</option>
            )}

            {/* Only show "Accompanist" if registeredAccompanist < maxAccompanist */}
            {event.registeredAccompanist < event.maxAccompanist && (
              <option value="ACCOMPANIST">Accompanist</option>
            )}
          </select>
        </div>
      ))}
  </fieldset>
))}
</div>

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
