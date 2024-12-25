"use client";

import Button from "@/components/Button";
import React, { useEffect, useState } from "react";

const UpdateRegister = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [phone, setPhone] = useState("");
  const [isTeamManager, setIsTeamManager] = useState(false);
  const [editOne, setEditOne] = useState(false);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch registrant details
  async function fetchRegistrant() {
    const response = await fetch("/api/getregisterbyid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrantId: "40b35a87-e856-47ee-b713-28c552e1670f" }),
    });

    const data = await response.json();

    // Set registrant details
    setName(data.registrant.name);
    setUsn(data.registrant.usn);
    setPhone(data.registrant.phone);
    setIsTeamManager(data.registrant.isTeamManager);
    setId(data.registrant.id);

    // Merge event details with event registrations
    const mergedEvents = data.registrant.events.map((event) => {
      const registration = data.registrant.eventRegistrations.find(
        (reg) => reg.eventId === event.id
      );
      return {
        ...event,
        ...registration,
        editing: false, // Add the editing state for each event
        editRole: "",  // Temporary role state for editing
      };
    });

    // Group events by category
    const grouped = mergedEvents.reduce((acc, event) => {
      acc[event.category] = acc[event.category] || [];
      acc[event.category].push(event);
      return acc;
    }, {});
    console.log(mergedEvents)
    setGroupedEvents(grouped);
    setEvents(mergedEvents);
    
  }

  useEffect(() => {
    fetchRegistrant();
  }, []);

  // Handle save action
  const handleSave = async () => {
    const response = await fetch("/api/updateregisterdetails", {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        usn: usn,
        phone: phone,
        name: name,
        selectedEvents,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    fetchRegistrant();
    setEditOne(false);
    console.log(data);
    alert(data.message);
  };

  // Handle event selection
  const handleEventSelection = (e) => {
    const [eventNo, eventName] = e.target.value.split("|");
    if (e.target.checked) {
      setSelectedEvents((prev) => [...prev, { eventNo, eventName, type: "" }]);
    } else {
      setSelectedEvents((prev) => prev.filter((event) => event.eventNo !== eventNo));
    }
  };

  // Handle role change for selected events
  const handleRoleChange = (e, eventNo) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventNo === eventNo ? { ...event, editRole: e.target.value } : event
      )
    );
  };

  // Handle Edit button click (per event)
  const handleEditClick = (eventNo) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventNo === eventNo ? { ...event, editing: true } : event
      )
    );
  };

  // Handle Save button click (per event)
  const handleSaveRole = async (event) => {
     // Create the updated event with the new role
     const updatedEvent = { ...event, type: event.editRole };
     setEvents((prevEvents) =>
       prevEvents.map((e) => (e.eventNo === event.eventNo ? updatedEvent : e))
     );
   
     // Send the updated event data to the backend
     const response = await fetch("/api/updateroleinevent", {
       method: "PATCH",  // Or use PUT if it's a complete update
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         eventId : event.id,
         registrantId : event.registrantId ,// Event name
         type: event.editRole,       // Updated role
       }),
     });
   
     const data = await response.json();
   
     // Check if the response is successful
     if (data.success) {
       alert(`Role for ${event.eventName} saved as ${event.editRole}`);
   
       // After saving, exit the editing mode and revert the button to 'Edit'
       setEvents((prevEvents) =>
         prevEvents.map((e) =>
           e.eventNo === event.eventNo ? { ...e, editing: false } : e
         )
       );
     } else {
       alert(`Failed to save role for ${event.eventName}. Please try again.`);
     }
   };
   

  return (
    <section
      id="register"
      className="min-h-screen py-16 px-4 bg-gray-200 flex justify-center items-center"
    >
      <div className="w-full max-w-4xl p-6 bg-white text-white shadow-lg rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-yellow-800 font-Barrio text-center">
          Update Registrant
        </h2>
        <div>
          <h2 className="text-yellow-600 text-lg font-semibold">Registrant Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-yellow-600 mb-2">
                Name<sup className="text-red-600 font-extrabold text-">*</sup>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                value={name}
                disabled={!editOne}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600 mb-2">
                USN / ID Number <sup className="text-red-600 font-extrabold text-">*</sup>
              </label>
              <input
                type="text"
                name="usn"
                placeholder="Enter your USN / ID Number"
                required
                value={usn}
                disabled={!editOne}
                onChange={(e) => setUsn(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-600 mb-2">
                Phone <sup className="text-red-600 font-extrabold text-">*</sup>
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                required
                value={phone}
                disabled={!editOne}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="flex flex-row gap-4 mt-5">
              <p className="block text-sm font-medium text-yellow-600 mb-2 mt-2">
                Are You Team Manager? <span className="text-black text-lg">&nbsp;{isTeamManager ? "YES" : "NO"}</span>
              </p>
              {editOne ? (
                <Button label={"Save"} OnClick={() => handleSave()} />
              ) : (
                <Button OnClick={() => setEditOne(true)} label="Edit" />
              )}
            </div>
          </div>

          <h2 className="text-yellow-600 text-lg font-semibold mt-6">Event Registrations</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="p-4 bg-gray-100 rounded-md shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-yellow-600 text-lg font-semibold">{event.eventName}</h3>
                    <p className="text-sm text-gray-500">{event.type}</p>
                  </div>

                  {/* Role Section */}
                  <div className="flex items-center mb-4">
                    <label className="text-sm text-yellow-600 mr-2">Role:</label>
                    {/* Editable Role */}
                    {event.editing ? (
                      <select
                        value={event.editRole || event.type}  // `editRole` is the editable state
                        onChange={(e) => handleRoleChange(e, event.eventNo)}
                        className="px-2 py-1 border rounded-md text-sm text-black"
                      >
                        <option value="PARTICIPANT">Participant</option>
                        <option value="ACCOMPANIST">Accompanist</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500">{event.type}</span>
                    )}
                  </div>

                  {/* Edit Button */}
                  {!event.editing && (
                    <div className="mt-4">
                      <Button
                        label={`Edit`}
                        OnClick={() => handleEditClick(event.eventNo)}
                      />
                    </div>
                  )}

                  {/* Save Button */}
                  {event.editing && (
                    <div className="mt-4">
                      <Button
                        label={`Save`}
                        OnClick={() => handleSaveRole(event)}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-yellow-600">No events available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateRegister;
