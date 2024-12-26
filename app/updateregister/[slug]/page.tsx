"use client";

import Button from "@/components/Button";
import { eventCategories } from "@/data/eventCategories";
import React, { useEffect, useState } from "react";

const UpdateRegister = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [phone, setPhone] = useState("");
  const [isTeamManager, setIsTeamManager] = useState(false);
  const [editOne, setEditOne] = useState(false);
  const [field, setField] = useState("")
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrant, setRegistrant] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [addEvent, setaddEvent] = useState(null);
  const [addEventType, setaddEventType] = useState("");
  const [allRegisteredEvents, SetallregisteredEvents] = useState([]);



  // Fetch registrant details
  async function fetchRegistrant() {
    const id = (await params).slug;
    const response = await fetch("/api/getregisterbyid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrantId: id,
      }),
    });

    const data = await response.json();
    console.log(data);

    setName(data.registrant.name);
    setUsn(data.registrant.usn);
    setPhone(data.registrant.phone);
    setIsTeamManager(data.registrant.teamManager);
    setId(data.registrant.id);
    setRegistrant(data.registrant);

    const fetchResponse = await fetch("/api/getalleventregister", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    const { userEvents } = await fetchResponse.json();

    let mergedEvents = data.registrant.events.map((event) => {
      const registration = data.registrant.eventRegistrations.find(
        (reg) => reg.eventId === event.id
      );
      return {
        ...event,
        ...registration,
        editing: false,
        editRole: "",
      };
    });

    mergedEvents = mergedEvents.filter((event) => {
      return event.registrantId
    })

    const updateUserEvent = userEvents.filter((event)=>
    {
      return event.registeredParticipant < event.maxParticipant || event.registeredAccompanist <event.maxAccompanist
    })

    console.log(userEvents)
    console.log(mergedEvents);
    SetallregisteredEvents(updateUserEvent);
    setEvents(mergedEvents);
  }

  useEffect(() => {
    fetchRegistrant();
  }, [, setEvents]);

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
      setSelectedEvents((prev) =>
        prev.filter((event) => event.eventNo !== eventNo)
      );
    }
  };

  const AddCategories = allRegisteredEvents.filter((event) => {
    return !events.some((e) => e.eventNo === event.eventNo)
  })

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
    const updatedEvent = { ...event, type: event.editRole };
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.eventNo === event.eventNo ? updatedEvent : e))
    );

    const response = await fetch("/api/updateroleinevent", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: event.id,
        registrantId: event.registrantId,
        type: event.editRole,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(`Role for ${event.eventName} saved as ${event.editRole}`);
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.eventNo === event.eventNo ? { ...e, editing: false } : e
        )
      );
    } else {
      alert(`Failed to save role for ${event.eventName}. Please try again.`);
    }
  };

  const handleEventDelete = async (event) => {
    const response = await fetch("/api/deleteregistrantevent", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: event.id,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(`Event ${event.eventName} deleted successfully.`);
      // Update the events state by filtering out the deleted event
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.eventNo !== event.eventNo)
      );
    } else {
      console.log(data)
      alert(`Failed to delete event ${event.eventName}. Please try again. because `);
    }
  }

  const handleSetField = (value) => {

    setField(value);  // Set the selected field

    if (value === "sslc") {
      // Assuming registrant.sslcUrl contains the URL of the SSLC file
      setFileUrl(registrant.sslcUrl);  // Set the file URL for SSLC
    } else if (value === "puc") {
      // Assuming registrant.pucUrl contains the URL of the PUC file
      setFileUrl(registrant.pucUrl);  // Set the file URL for PUC
    } else if (value === "idcard") {
      // Assuming registrant.idcardUrl contains the URL of the ID Card file
      setFileUrl(registrant.idcardUrl);  // Set the file URL for ID Card
    } else if (value === "aadhar") {
      // Assuming registrant.aadharUrl contains the URL of the Aadhar file
      setFileUrl(registrant.aadharUrl);  // Set the file URL for Aadhar
    } else if (value === "admission1") {
      // Assuming registrant.admission1Url contains the URL of the Admission 1 file
      setFileUrl(registrant.admission1Url);  // Set the file URL for Admission 1
    } else if (value === "admission2") {
      // Assuming registrant.admission2Url contains the URL of the Admission 2 file
      setFileUrl(registrant.admission2Url);  // Set the file URL for Admission 2
    } else if (value === "photo") {
      // Assuming registrant.photoUrl contains the URL of the Photo file
      setFileUrl(registrant.photoUrl);  // Set the file URL for Photo
    } else {
      // If no valid field is selected, reset the file URL
      setFileUrl("");
    }
  };

  const handleFileUpload = async () => {
    console.log("fdafkjsdjfkl")
    if (!fileUpload) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileUpload);
    formData.append("field", field);
    formData.append("registrantId", registrant.id);

    const response = await fetch(`/api/updateregisterfiles`, {
      method: "PATCH",
      body: formData,
    });
    console.log("the reso", response)

    const data = await response.json();

    if (data.success) {
      alert("File uploaded successfully!");
      setFileUrl(data.fileUrl); // Assuming the server returns the URL of the uploaded file
    } else {
      alert("File upload failed. Please try again.");
    }
  }


  const handleAddEvent = async(e) => {
    e.preventDefault();
    const response = await fetch('/api/addeventregister',{
      method:"POST",
      body: JSON.stringify({registrantId : registrant.id,event :addEvent,type:addEventType}),
      headers: {
        "Content-Type": "application/json",
      }
    })

    const data = await response.json();
    console.log(data);

    
    alert(data.message);
  }

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
          <h2 className="text-yellow-600 text-lg font-semibold">
            Registrant Details
          </h2>
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
                USN / ID Number{" "}
                <sup className="text-red-600 font-extrabold text-">*</sup>
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
                Are You Team Manager?{" "}
                <span className="text-black text-lg">
                  &nbsp;{isTeamManager ? "YES" : "NO"}
                </span>
              </p>
              {editOne ? (
                <Button label={"Save"} OnClick={() => handleSave()} />
              ) : (
                <Button OnClick={() => setEditOne(true)} label="Edit" />
              )}
            </div>
          </div>
          {!isTeamManager &&<>
          <h2 className="text-yellow-600 text-lg font-semibold mt-6">Select Event</h2>
          <div className="mt-4">
            <form onSubmit={handleAddEvent} className="flex gap-4 flex-col">
              <label className="block text-sm font-medium text-yellow-600 mb-2">
                Select Event to Register
              </label>
              <select
                onChange={(e) => setaddEvent(JSON.parse(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select Event</option>
                {AddCategories.map((event) => (
                  <option key={event.eventNo} value={JSON.stringify(event)} >
                    {event.eventName}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-yellow-600 mb-2">Select Type</label>
              
              <select
                onChange={(e) => setaddEventType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select Type</option>
                {addEvent && addEvent.registeredParticipant < addEvent.maxParticipant && (
                  <option value="PARTICIPANT">Participant</option>
                )}

                {addEvent && addEvent.registeredAccompanist <addEvent.maxAccompanist && (
                  <option value="ACCOMPANIST">Accompanist</option>
                )}
              </select>


              <button
                className="bg-yellow-600 p-2 rounded-sm px-3 mt-3 text-lg"
              >
                Add Event
              </button>
            </form>
          </div>

          <h2 className="text-yellow-600 text-lg font-semibold mt-6">
            Event Registrations
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-gray-100 rounded-md shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-yellow-600 text-lg font-semibold">
                      {event.eventName}
                    </h3>
                    <p className="text-sm text-gray-500">{event.type}</p>
                  </div>

                  <div className="flex items-center mb-4">
                    <label className="text-sm text-yellow-600 mr-2">Role:</label>
                    {event.editing ? (
                      <select
                        value={event.editRole || event.type}
                        onChange={(e) => handleRoleChange(e, event.eventNo)}
                        className="px-2 py-1 border rounded-md text-sm text-black"
                      >
                        <option value="">Select Type</option>
                        {
                          event.type === 'PARTICIPANT' && event.registeredAccompanist < event.maxAccompanist
                          && <option value="ACCOMPANIST">ACCOMPANIST</option>
                        }
                        {
                          event.type === 'ACCOMPANIST' && event.registeredParticipant < event.maxParticipant
                          && <option value="PARTICIPANT">PARTICIPANT</option>
                        }
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500">
                        {event.type}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    {event.editing ? (
                      <>
                        <button
                          onClick={() => handleSaveRole(event)}
                          className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleEventDelete(event)}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md">
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(event.eventNo)}
                        className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-md"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events registered.</p>
            )}
          </div>
          </>
          }
          <div>
            <label className="block text-sm font-medium mt-10 text-yellow-600 mb-2">
              Select Field for Upload:
            </label>
            <select
              onChange={(e) => handleSetField(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
            >
              {!isTeamManager &&<>
              <option value="">Select Field</option>
              <option value="sslc">SSLC</option>
              <option value="puc">PUC</option>
              <option value="idcard">ID Card</option>
              <option value="aadhar">Aadhar</option>
              <option value="admission1">Admission 1</option>
              <option value="admission2">Admission 2</option>
              <option value="photo">Photo</option>
              </>}
              {isTeamManager && 
              <>
              <option value="">Select Field</option>
              <option value="photo">Photo</option>
              <option value="idcard">ID Card</option>
              </>}
            </select>

            {
              field &&
              <>
                <a href={fileUrl} target="_blank">
                  <button
                    className="bg-yellow-600 p-2 rounded-sm px-3  mt-3 text-lg">
                    View
                  </button></a>
                <label className="block text-sm font-medium mt-10 text-yellow-600 mb-2">
                  Update Document:
                </label>
                <form encType="multipart/form-data" onSubmit={handleFileUpload}>
                  <input
                    type="file"
                    onChange={(e) => setFileUpload(e.target.files[0])}
                    className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
                  />
                  <button className="bg-yellow-600 p-2 rounded-sm px-3  mt-3 text-lg">
                    Upload
                  </button>
                </form>
              </>
            }

          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateRegister;
