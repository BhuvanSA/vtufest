"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";


import Link from "next/link";
import { ArrowLeft, EyeIcon, Pencil, PlaySquare, PlusIcon, Save, Upload, View, X } from "lucide-react";
import { LoadingButton } from "@/components/LoadingButton";
// Define interfaces for our data structures


interface Registrant {
  id: string;
  name: string;
  usn: string;
  phone: string;
  email: string;
  teamManager: boolean;
  gender: string;
  accomodation: boolean;
  blood: string;
  designation?: string;
  events: Event[];
  eventRegistrations: EventRegistration[];
  [key: string]: any; // For dynamic access to file URLs
}

interface Event {
  id: string;
  eventNo: string;
  eventName: string;
  maxParticipant: number;
  maxAccompanist: number;
  registeredParticipant: number;
  registeredAccompanist: number;
}

interface EventRegistration {
  id: string;
  eventId: string;
  registrantId: string;
  type: string;
}

interface MergedEvent extends Event, EventRegistration {
  editing: boolean;
  editRole: string;
}

interface UpdateRegisterProps {
  params: Promise<{ slug: string }>;
}



const UpdateRegister: React.FC<UpdateRegisterProps> = ({ params }) => {

  
const [isOther, setIsOther] = useState<boolean>(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      usn: "",
      email: "",
      accomodation: false,
      gender: "",
      blood: "",
      designation: "",
    },
  })
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [isTeamManager, setIsTeamManager] = useState<boolean>(false);
  const [editOne, setEditOne] = useState<boolean>(false);
  const [field, setField] = useState<string>("");
  const [events, setEvents] = useState<MergedEvent[]>([]);
  const [registrant, setRegistrant] = useState<Registrant | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [addEvent, setAddEvent] = useState<Event | null>(null);
  const [addEventType, setAddEventType] = useState<string>("");
  const [allRegisteredEvents, setAllRegisteredEvents] = useState<Event[]>([]);
  const [handleAddEventEffect, setHandleAddEventEffect] = useState<boolean>(false);

  async function handleDeleteFromUploadThing(fileId: string) {
    console.log(fileId);
    try {
      await fetch("/api/deleteFiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: [fileId] }),
      });
      console.log(fileId);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }


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

    if (data.registrant) {
      const registrant: Registrant = data.registrant;
      setValue('name', registrant.name);
      setValue('phone', registrant.phone);
      setValue('usn', registrant.usn);
      setValue('accomodation', registrant.accomodation);
      setValue('gender', registrant.gender);
      setValue("email", registrant.email);
      setValue('blood', registrant.blood);
      setValue('designation', registrant.designation || "");
      setIsTeamManager(registrant.teamManager);
      setId(registrant.id);
      setRegistrant(registrant);
      const fetchResponse = await fetch("/api/getalleventregister", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const { userEvents } = await fetchResponse.json();

      let mergedEvents: MergedEvent[] = data.registrant.events.map((event: Event) => {
        const registration = data.registrant.eventRegistrations.find(
          (reg: Registrant) => reg.eventId === event.id
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

      const updateUserEvent = userEvents.filter((event: Event) => {
        return (
          (event.registeredParticipant < event.maxParticipant ||
            event.registeredAccompanist < event.maxAccompanist) && !mergedEvents.some((events: Event) => events.eventNo === event.eventNo)
        );
      });

      console.log(userEvents);
      console.log(mergedEvents);
      setAllRegisteredEvents(updateUserEvent);
      setEvents(mergedEvents);
    }
  }

  useEffect(() => {
    fetchRegistrant();
  }, [handleAddEventEffect]);

  // Handle save action
  const handleSave = async (formData: any) => {
    console.log(formData);
    const response = await fetch("/api/updateregisterdetails", {
      method: "PATCH",
      body: JSON.stringify({
        id: id,
        usn: formData.usn,
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        accomodation: formData.accomodation,
        gender: formData.gender,
        blood: formData.blood,
        designation: formData.designation
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    fetchRegistrant();
    setEditOne(false);
    toast.success('Register Details updated')
    if (!data.success) {
      const errorMessage = JSON.parse(data.message);
      errorMessage.forEach((message: { message: string }) => {
        toast.error(message.message);
      });
    }
  };

  // Handle role change for selected events
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>, eventNo: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventNo === eventNo ? { ...event, editRole: e.target.value } : event
      )
    );
  };

  // Handle Edit button click (per event)
  const handleEditClick = (eventNo: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.eventNo === eventNo ? { ...event, editing: true } : event
      )
    );
  };


  const handleDocumentUpdate = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("registrantId", id);
    formData.append("field", field);
    formData.append("fileUrl", fileUrl);
  
    const response = await fetch("/api/updateregisterfiles", {
      method: "PATCH",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Document updated successfully");
      fetchRegistrant();
    } else {
      toast.error("Failed to update document. Please try again.");
    }
  }

  // Handle Save button click (per event)
  const handleSaveRole = async (event: MergedEvent) => {
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

  const handleEventDelete = async (event: MergedEvent) => {
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
      // setEvents((prevEvents) =>
      //   prevEvents.filter((e) => e.eventNo !== event.eventNo)
      // );
      setHandleAddEventEffect((prev: boolean) => !prev)
    } else {
      console.log(data);
      toast.error(`Failed to delete event ${event.eventName}. Please try again.`);
    }
  };

  const handleSetField = (value: string) => {
    setField(value);
    if (registrant) {
      setFileUrl(registrant[value]);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEvent || !addEventType || !registrant) return;

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
    setHandleAddEventEffect((prev: boolean) => !prev)
    toast.success(data.message);

  };

  return (
    <div className="bg-background min-h-screen pt-24 w-full ">
      <div className="mt-4 justify-center w-full flex flex-col gap-4">
        <div className="w-[90%] mx-auto p-6">
          <h1 className="text-primary font-bold text-center text-4xl md:text-4xl xl:text-4xl mb-6">
            Update Registrant
          </h1>

          <Card className="w-full">
            <CardDescription className="text-center mt-8 mb-10 text-red-500">
              Update details for Registrant for <span className=" ">{isTeamManager ? "Team Manager" : "Participant/Accompanist"}</span>
            </CardDescription>
            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                <form >
                  <div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                      <div className="w-full md:w-1/3 space-y-1.5">
                        <Label htmlFor="name">Name <small className="text-red-600">*</small></Label>
                        <Controller
                          control={control}
                          name="name"
                          rules={{ required: "Name is required" }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              id="name"
                              {...field}
                              disabled={!editOne}
                              placeholder="Full Name - will be printed in your certificate"
                            />
                          )}
                        />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                      </div>
                      {isTeamManager && (
  <div className="w-full md:w-1/3 space-y-1.5">
    <Label htmlFor="designation">
      Designation <small className="text-red-600">*</small>
    </Label>
    <Controller
      control={control}
      name="designation"
      rules={{ required: "Designation is required" }}
      render={({ field: { onChange, value, ref } }) => (
        <>
          {!isOther ? (
            <Select
              onValueChange={(selectedValue) => {
                if (selectedValue === "others") {
                  setIsOther(true);
                  // Clear the field to allow custom input.
                  onChange("");
                } else {
                  setIsOther(false);
                  onChange(selectedValue);
                }
              }}
              disabled={!editOne}
            >
              <SelectTrigger id="managerdesignation">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Designation</SelectLabel>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Associate Professor">
                    Associate Professor
                  </SelectItem>
                  <SelectItem value="Assistant Professor">
                    Assistant Professor
                  </SelectItem>
                  <SelectItem value="P.E.Director">
                   P.E.Director
                  </SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <>
              <Input
                id="managerdesignation"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Please specify your designation"
                disabled={!editOne}
                ref={ref}
              />
              <button
                type="button"
                onClick={() => {
                  // Optionally clear the designation field before switching back.
                  onChange("");
                  setIsOther(false);
                }}
                className="text-sm text-blue-600 underline mt-1"
              >
                Back to selection
              </button>
            </>
          )}
        </>
      )}
    />
    {errors.designation && (
      <p className="text-red-500">{errors.designation.message}</p>
    )}
  </div>
)}

                      <div className="w-full md:w-1/3 space-y-1.5">
                        <Label htmlFor="usn">USN / ID Number <small className="text-red-600">*</small></Label>
                        <Controller
                          control={control}
                          name="usn"
                          rules={{ required: "Usn is required" }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              id="usn"
                              {...field}
                              disabled={!editOne}
                              placeholder="USN / ID Number"
                            />
                          )}
                        />
                        {errors.usn && <p className="text-red-500">{errors.usn.message}</p>}
                      </div>
                      <div className="w-full md:w-1/3 space-y-1.5">
                        <Label htmlFor="phone">Phone Number <small className="text-red-600">*</small></Label>
                        <Controller
                          control={control}
                          name="phone"
                          rules={{
                            required: "phone is required",
                            minLength: { value: 10, message: "Must be 10 digits" },
                            maxLength: { value: 10, message: "Must be 10 digits" },
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              id="phone"
                              {...field}
                              disabled={!editOne}
                              placeholder="Enter your phone number"
                            />
                          )}
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <div className="flex flex-row gap-10 mt-5" >

                      <div className="w-full md:w-1/3 space-y-1.5">
                        <Label htmlFor="gender">Gender <small className="text-red-600">*</small></Label>
                        <Controller
                          control={control}
                          name="gender"
                          rules={{ required: "Gender is required" }}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
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
                          )}
                        />
                        {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}

                      </div>
                      <div className="w-full md:w-1/3 space-y-1.5">
                        <Label htmlFor="accomodation">Need Accommodation <small className="text-red-600">*</small></Label>
                        <Controller
                          control={control}
                          name="accomodation"
                          render={({ field }) => (
                            <Select
                              value={field.value ? "yes" : "no"}
                              onValueChange={(value) => setValue('accomodation', value === "yes")}
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
                          )}
                        />
                        {errors.accomodation && (
                          <p className="text-red-500">{errors.accomodation.message}</p>
                        )}
                      </div>

                      <div className="w-full md:w-1/3 space-y-1.5">
                        <Label htmlFor="blood">Date Of Birth <small className="text-red-600">*</small></Label>
                        <Controller
                          control={control}
                          name="blood"
                          rules={{
                            required: "Date of Birth is required",
                          }}
                          render={({ field }) => (
                            <Input
                              type="date"
                              id="blood"
                              {...field}
                              disabled={!editOne}
                              placeholder="Enter your Date of Birth"
                            />
                          )}
                        />
                        {errors.blood && <p className="text-red-500">{errors.blood.message}</p>}
                      </div>

                      <div className="w-full md:w-1/3 space-y-1.5">
                        <Label htmlFor="email">Email <small className="text-red-600">*</small></Label>
                        <Controller
                          control={control}
                          name="email"
                          rules={{
                            required: "Email is required",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: "Invalid email address",
                            }
                          }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              id="email"
                              {...field}
                              disabled={!editOne}
                              placeholder="Enter your Email"
                            />
                          )}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-5 justify-end ">

                      {editOne ? (<>
                        <Button className="px-5" type="button" onClick={handleSubmit(handleSave)}><Save className="mr-2" /> Save</Button>
                        <Button className="" type="button" onClick={() => setEditOne(false)}><X className="mr-2" />Don't Save</Button>
                      </>
                      ) : (
                        <Button className="px-6" onClick={() => setEditOne(true)} type="button"><Pencil className="mr-2 h-5 w-5" />Edit</Button>
                      )}

                    </div>
                  </div>
                </form>


                {!isTeamManager && (
                  <>
                    <h2 className="text-primary text-2xl font-semibold mt-6">
                      Select Event
                    </h2>
                    <div className="mt-4">
                      <form onSubmit={handleAddEvent} className="flex gap-3 flex-col">
                        <Label className="block text-sm font-medium text-primary mb-1">Select Event to Register</Label>
                        <Select onValueChange={(value) => setAddEvent(JSON.parse(value))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Event" />
                          </SelectTrigger>
                          <SelectContent>
                            {allRegisteredEvents.map((event) => (
                              <SelectItem key={event.eventNo} value={JSON.stringify(event)}>
                                {event.eventName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Label className="block text-sm font-medium text-primary mb-1">Select Type</Label>
                        <Select onValueChange={(value) => setAddEventType(value)}>
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
                        <div className="flex flex-wrap w-full justify-end">
                          <Button className="bg-primary  px-4 rounded-sm  text-lg" type="submit">
                            <PlusIcon />Add Event
                          </Button>
                        </div>
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
                                <div className="p-4 border-2 rounded-lg cursor-pointer transition duration-300 flex flex-col h-full">
                                  <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-500 font-bold ">{event.eventName}</p>
                                  </div>

                                  <div className="flex items-center mb-3">
                                    <label className="text-lg  text-primary mr-6">Role:</label>
                                    {event.editing ? (
                                      <Select
                                        onValueChange={(value) =>
                                          handleRoleChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>, event.eventNo)
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

                <div className="flex flex-col">
                <div className="">
                  <Label className="block text-sm font-medium mt-10 text-primary mb-2">
                    Select Field for Upload:
                  </Label>

                  <Select onValueChange={(value) => handleSetField(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {!isTeamManager && (
                        <>
                          <SelectItem value="idcardUrl">ID Card</SelectItem>
                          <SelectItem value="aadharUrl">Aadhar</SelectItem>
                          <SelectItem value="photoUrl">Photo</SelectItem>
                          <SelectItem value="sslcUrl">SSLC</SelectItem>
                          
                        </>
                      )}
                      {isTeamManager && (
                        <>
                          <SelectItem value="photoUrl">Photo</SelectItem>
                          <SelectItem value="idcardUrl">ID Card</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  
                  {field && (
                    <>
                      <a href={`https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${fileUrl}`} target="_blank" rel="noopener noreferrer">
                        <div className="flex w-full justify-center mt-5 ">
                        <Button className="w-40"><EyeIcon className="mr-2"/>View</Button>
                        </div>
                      </a>

                      <Label className="block text-sm font-medium mt-10 text-primary mb-2">
                        Update Document:
                      </Label>

                      <form encType="multipart/form-data" onSubmit={(e) => {
                        handleDocumentUpdate(e);
                      }}>
                        {isUploaded ? (
                          <div className="w-full h-[244px] border-2  flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 to-transparent">
                            <p className="text-green-500 flex items-center gap-1 pb-10">
                              Upload Complete
                            </p>
                            <LoadingButton
                              type="button"
                              className="w-40 bg-green-400"
                              onClick={async () => {
                                setIsUploaded(false);
                                await handleDeleteFromUploadThing(fileUrl);
                                setFileUrl("");
                              }}
                            >
                              Edit (Re-upload)
                            </LoadingButton>
                          </div>
                        ) : (
                          <UploadDropzone
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res && res[0]) {
                                setFileUrl(res[0].key);
                                setIsUploaded(true);
                                toast.success(
                                  `Document Upload Completed`
                                );
                              }
                            }}
                            onUploadError={(error: Error) => {
                              toast.error(`Error: ${error.message} Uploading`);
                            }}
                          />
                        )}
                        <div className="flex justify-center w-full">
                        <Button className="mt-5 w-40 bg-green-500" type="submit">
                          <Upload className="mr-2"/>Upload
                        </Button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/register/getallregister" className="w-full mx-14">
                <Button
                  className="w-full "
                >
                  <ArrowLeft className="ml-5 h-4 w-4"/>Back
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div >
  );
};

export default UpdateRegister;

