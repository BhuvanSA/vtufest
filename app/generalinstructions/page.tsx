import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

const Page = () => {
  return (
    <div className="mt-24 flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg border">
        <CardHeader className="text-xl font-bold text-primary text-center border-b p-4 bg-gray-100">
          Guidelines for the 24th VTU Youth Festival
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-gray-700 text-justify w-full font-semibold tracking-tight">
          <ol className="list-decimal list-inside flex gap-4 flex-col">
            <li>The 24th VTU Youth Festival will be held during March 24 - 27, 2025.</li>
            <li>Registrations for participating teams will be opened from 10 February, 2025 and closed on 9 March, 2025.</li>
            <li>Late entries will not be accepted under any circumstances.</li>
            <li>Requests for changes in registration details after submission will not be entertained whatsoever.</li>
            <li>The maximum contingent size, inclusive of officials, participants, and accompanists, is fixed at 45.</li>
            <li>
              <strong>Registration Fee:</strong> <br />
              For up to 10 events: ₹4,000/- <br />
              For beyond 10 events: ₹8,000/-
            </li>
            <li>An additional refundable caution deposit of ₹3,000/- shall be paid online along with the registration fee.</li>
            <li>
              <strong>Accommodation Facilities:</strong> <br />
              Provided for contingents opting for it on a need basis only. Meals will be provided for all participants and
              officials. Contingents are advised to bring light bedding and locks. Accommodation will only be provided to the
              registered contingent members during the dates of the fest.
            </li>
            <li>All necessary musical instruments and other materials required for performances shall be brought by the participants/contingent members.</li>
            <li>
              The accompanying Team Manager shall be a faculty member with a minimum of 5 years of experience and/or be the
              Cultural Coordinator or Physical Education Director.
            </li>
            <li>Usage of any form of Tobacco, Alcohol, or Narcotic substances is strictly prohibited.</li>
            <li>
              All members of the contingent are expected to maintain discipline and decorum inside and outside the college
              premises. Failure to comply or engagement in any misadventure will result in penal action.
            </li>
            <li>Reporting time will be provided along with the schedule of the event.</li>
            <li>Decisions of the organizers and panel of judge(s) will be final and binding.</li>
            <li>All participants must be regular students of VTU and shall carry their identity cards.</li>
            <li>
              Submission of an Authorization Letter from the authorities of participating institutions for both participants
              and accompanists is mandatory during registration.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
