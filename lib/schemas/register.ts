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
