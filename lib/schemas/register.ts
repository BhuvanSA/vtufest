import { z } from "zod";
export const EventSchema = z.array(
    z.object({
        eventNo: z.number({ message: "eventNo is required" }),
        eventName: z.string({ message: "eventName is required" }),
        maxAccompanist: z.number({ message: "max registrant is required" }),
        maxParticipant: z.number({ message: "max participant is required" }),
        category: z.string({ message: "category of event is required" }),
    })
);

export const participantFormSchema = z.object({
    name: z.string().min(1, "Name required"),
    usn: z.string().min(1, "USN required"),
    teamManager: z.boolean().default(false),
    phone: z
        .string()
        .min(10, "Enter valid phone number")
        .regex(/^\d+$/, "Phone must contain only digits"),
    events: z
        .array(
            z.object({
                eventName: z.string(),
                eventNo: z.number(),
                type: z.enum(["PARTICIPANT", "ACCOMPANIST"]),
            })
        )
        .min(1, "Select at least one event"),
    gender: z.string().min(1, "Gender is required"),
    accomodation: z.boolean(),
    documents: z.object({
        photo: z.string().min(1, "Photo is required"),
        idCard: z.string().min(1, "College ID Card is required"),
        aadhar: z.string().min(1, "Aadhar is required"),
        // sslc: z.string().min(1, "SSLC is required"),
        // puc: z.string().min(1, "PUC is required"),
        // admission1: z.string().min(1, "Admission1 is required"),
        // admission2: z.string().min(1, "Admission2 is required"),
    }),
});

export const managerFormSchema = z.object({
    name: z.string().min(1, "Name required"),
    usn: z.string().min(1, "USN required"),
    teamManager: z.boolean().default(true),
    phone: z
        .string()
        .min(10, "Enter valid phone number")
        .regex(/^\d+$/, "Phone must contain only digits"),
    documents: z.object({
        photo: z.string().min(1, "Photo is required"),
        idCard: z.string().min(1, "College ID Card is required"),
    }),
    gender: z.string().min(1, "Gender is required"),
    accomodation: z.boolean(),
});
