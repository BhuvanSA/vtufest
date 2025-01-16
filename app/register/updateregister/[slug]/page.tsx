"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadField } from "@/components/forms/file-upload";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";

const UpdateRegister = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [phone, setPhone] = useState("");
  const [isTeamManager, setIsTeamManager] = useState(false);
  const [editOne, setEditOne] = useState(false);
  const [field, setField] = useState("");
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrant, setRegistrant] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [addEvent, setaddEvent] = useState(null);
  const [addEventType, setaddEventType] = useState("");
  const [allRegisteredEvents, SetallregisteredEvents] = useState([]);
  const [gender, setGender] = useState<null | string>(null);
  const [accomodation, setAccomodation] = useState<null | boolean>(null);

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
    setGender(data.registrant.gender);
    setAccomodation(data.registrant.accomodation);

    const fetchResponse = await fetch("/api/getalleventregister", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

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
      return event.registrantId;
    });

    const updateUserEvent = userEvents.filter((event) => {
      return (
        event.registeredParticipant < event.maxParticipant ||
        event.registeredAccompanist < event.maxAccompanist
      );
    });

    console.log(userEvents);
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
        accomodation: accomodation,
        gender:gender
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    fetchRegistrant();
    setEditOne(false);
    toast.success('Register Details updated')
    if (!data.success) {
      const errorMessage = JSON.parse(data.message);
      errorMessage.forEach((message) => {
        toast.error(message.message);
      });
    }
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
    return !events.some((e) => e.eventNo === event.eventNo);
  });

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
        eventRegistrantId: event.id,
        type: event.editRole,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      toast.success(`Role for ${event.eventName} saved as ${event.editRole}`);
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.eventNo === event.eventNo ? { ...e, editing: false } : e
        )
      );
    } else {
      toast.error(`Failed to save role for ${event.eventName}. Please try again.`);
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
      toast.success(`Event ${event.eventName} deleted successfully.`);
      // Update the events state by filtering out the deleted event
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.eventNo !== event.eventNo)
      );
    } else {
      console.log(data);
      toast.error(`Failed to delete event ${event.eventName}. Please try again.`);
    }
  };

  const handleSetField = (value) => {
    setField(value); // Set the selected field
    setFileUrl(registrant[value]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
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
    console.log("the reso", response);

    const data = await response.json();

    if (data.success) {
      alert("File uploaded successfully!");
      setFileUrl(data.fileUrl); // Assuming the server returns the URL of the uploaded file
    } else {
      alert("File upload failed. Please try again.");
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/addeventregister", {
      method: "POST",
      body: JSON.stringify({
        registrantId: registrant.id,
        event: addEvent,
        type: addEventType,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    toast.success(data.message);

  };

  return (
    <div className="bg-background min-h-screen pt-24 ">
      <div className="mt-4 justify-center flex flex-col gap-4">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-primary font-bold text-center text-4xl md:text-4xl xl:text-4xl mb-6">
            Update Registrant
          </h1>

          <Card className="">
            <CardDescription className="text-center mt-8 mb-10">
              Update details for Registrant
            </CardDescription>
            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                <div >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                    <div className="w-full md:w-1/3 space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        value={name}
                        disabled={!editOne}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name - will be printed in your certificate"
                      />
                    </div>
                    <div className="w-full md:w-1/3 space-y-1.5">
                      <Label htmlFor="usn">USN / ID Number</Label>
                      <Input
                        type="text"
                        id="usn"
                        value={usn}
                        disabled={!editOne}
                        onChange={(e) => setUsn(e.target.value)}
                        placeholder="USN / ID Number "
                      />
                    </div>

                    <div className="w-full md:w-1/3 space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        type="text"
                        id="phone"
                        value={phone}
                        disabled={!editOne}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-10 mt-5">
                    <div className="w-full md:w-1/3 space-y-1.5">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={gender ?? ""}
                        onValueChange={(value) => setGender(value)}
                        disabled={!editOne}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Gender</SelectLabel>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full md:w-1/3 space-y-1.5">
                      <Label htmlFor="accommodation">Need Accommodation</Label>
                      <Select
                        value={accomodation === true ? "yes" : "no"}
                        onValueChange={(value) => setAccomodation(value === "yes")}
                        disabled={!editOne}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Accommodation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Accommodation</SelectLabel>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 mt-5">
                    <p className="block text-sm font-medium text-primary mb-2 mt-2">
                      Are You Team Manager?{" "}
                      <span className=" ">
                        &nbsp;{isTeamManager ? "YES" : "NO"}
                      </span>
                    </p>
                    {editOne ? (
                      <Button onClick={() => handleSave()}>Save</Button>
                    ) : (
                      <Button onClick={() => setEditOne(true)}>Edit</Button>
                    )}
                  </div>

                </div>

                {!isTeamManager && (
                  <>
                    <h2 className="text-primary text-2xl font-semibold mt-6">
                      Select Event
                    </h2>
                    <div className="mt-4">
                      <form onSubmit={handleAddEvent} className="flex gap-3 flex-col">
                        {/* Event Selection */}
                        <Label className="block text-sm font-medium text-primary mb-1">Select Event to Register</Label>
                        <Select onValueChange={(value) => setaddEvent(JSON.parse(value))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Event" />
                          </SelectTrigger>
                          <SelectContent>
                            {AddCategories.map((event) => (
                              <SelectItem key={event.eventNo} value={JSON.stringify(event)}>
                                {event.eventName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Type Selection */}
                        <Label className="block text-sm font-medium text-primary mb-1">Select Type</Label>
                        <Select onValueChange={(value) => setaddEventType(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {addEvent && addEvent.registeredParticipant < addEvent.maxParticipant && (
                              <SelectItem value="PARTICIPANT">Participant</SelectItem>
                            )}
                            {addEvent && addEvent.registeredAccompanist < addEvent.maxAccompanist && (
                              <SelectItem value="ACCOMPANIST">Accompanist</SelectItem>
                            )}
                          </SelectContent>
                        </Select>

                        {/* Submit Button */}
                        <Button className="bg-primary p-2 rounded-sm px-3 mt-3 text-lg" type="submit">
                          Add Event
                        </Button>
                      </form>
                    </div>

                    <h2 className="text-primary text-2xl font-semibold mt-6">
                      Event Registrations
                    </h2>
                    <div className="bg-card text-card-foreground p-4 rounded-md">
                      <Accordion type="single" collapsible className="mt-4">
                        {events.length > 0 ? (
                          events.map((event) => (
                            <AccordionItem key={event.id} value={`event-${event.id}`} className="mb-4">
                              <AccordionTrigger className="text-primary text-lg font-semibold">
                                {event.eventName}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="p-4 border-2 rounded-lg cursor-pointer transition duration-300 flex flex-col h-full"
                                >
                                  <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-500 font-bold ">{event.eventName}</p>
                                  </div>

                                  <div className="flex items-center mb-6">
                                    <label className="text-lg  text-primary mr-6">Role:</label>
                                    {event.editing ? (
                                      <Select
                                        onValueChange={(value) =>
                                          handleRoleChange({ target: { value } }, event.eventNo)
                                        }
                                        defaultValue={event.editRole || event.type}
                                      >
                                        <SelectTrigger className="w-full text-gray-500 ">
                                          <SelectValue placeholder="Select Type" className="text-gray-500" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {event.type === "PARTICIPANT" &&
                                            event.registeredAccompanist < event.maxAccompanist && (
                                              <SelectItem value="ACCOMPANIST">ACCOMPANIST</SelectItem>
                                            )}
                                          {event.type === "ACCOMPANIST" &&
                                            event.registeredParticipant < event.maxParticipant && (
                                              <SelectItem value="PARTICIPANT">PARTICIPANT</SelectItem>
                                            )}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <span className="text-sm text-gray-500">{event.type}</span>
                                    )}
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    {event.editing ? (
                                      <>
                                        <Button onClick={() => handleSaveRole(event)} className="bg-primary text-lg text-white hover:scale-105" variant="primary">
                                          Save
                                        </Button>
                                        <Button onClick={() => handleEventDelete(event)} variant="destructive" className="bg-red-500  text-lg text-white hover:scale-105">
                                          Delete
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        onClick={() => handleEditClick(event.eventNo)}
                                        variant="primary"
                                        className="bg-primary text-white hover:scale-105 text-lg"
                                      >
                                        Edit
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))
                        ) : (
                          <p className="text-gray-500">No events registered.</p>
                        )}
                      </Accordion>
                    </div>
                  </>
                )}
                <div>
                  {/* Select Field Label */}
                  <Label className="block text-sm font-medium mt-10 text-primary mb-2">
                    Select Field for Upload:
                  </Label>

                  {/* Select Field Dropdown */}
                  <Select onValueChange={(value) => handleSetField(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isTeamManager && (
                        <>

                          <SelectItem value="sslcUrl">SSLC</SelectItem>
                          <SelectItem value="pucUrl">PUC</SelectItem>
                          <SelectItem value="idcardUrl">ID Card</SelectItem>
                          <SelectItem value="aadharUrl">Aadhar</SelectItem>
                          <SelectItem value="admission1Url">Admission 1</SelectItem>
                          <SelectItem value="admission2Url">Admission 2</SelectItem>
                          <SelectItem value="photoUrl">Photo</SelectItem>
                        </>
                      )}
                      {isTeamManager && (
                        <>
                          <SelectItem value="">Select Field</SelectItem>
                          <SelectItem value="photoUrl">Photo</SelectItem>
                          <SelectItem value="idcardUrl">ID Card</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>

                  {/* View Document and Upload Section */}
                  {field && (
                    <>
                      {/* View Button */}
                      <a href={`https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${fileUrl}`} target="_blank" rel="noopener noreferrer">
                        <Button className="mt-5  w-full ">View</Button>
                      </a>

                      {/* Update Document Label */}
                      <Label className="block text-sm font-medium mt-10 text-primary mb-2">
                        Update Document:
                      </Label>

                      {/* File Upload Form */}
                      <form encType="multipart/form-data" onSubmit={handleFileUpload}>
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(
                            res
                          ) => {
                            if (res && res[0]) {
                              setFileUrl(res[0].key)
                              toast.success(
                                `document Upload Completed`
                              );
                            }
                          }}
                          onUploadError={(
                            error: Error
                          ) => {
                            toast.error(
                              `Error: ${error.message} Uploading ${doc.label}`
                            );
                          }}
                        />

                        <Button className="mt-5 w-full" type="submit">
                          Upload
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpdateRegister;