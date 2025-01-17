import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

const Page = () => {
  return (
    <div className=" mt-24 flex items-center justify-center bg-gray-50 p-4 ">
      <Card className="w-full max-w-2xl shadow-lg border">
        <CardHeader className="text-xl font-bold  text-primary text-center border-b p-4 bg-gray-100">
          General Instructions
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-gray-700 text-justify w-full font-semibold tracking-tight    ">
          <p>1. The 21st VTU Youth Festival will be held from 29th to 31st July 2022.</p>
          <p>2. Registrations will open from 25th June 2022. Last date for participating teams to register is 11th July 2022.</p>
          <p>3. Late entries will not be accepted under any circumstances.</p>
          <p>4. Requests for changes in registration details after submission will not be entertained whatsoever.</p>
          <p>5. The maximum contingent size inclusive of officials, participants and accompanists is fixed at 45.</p>
          <p>6. Registration fees for participation in up to 10 events will be Rs. 4000/- and for 11 events and above will be Rs. 8000/-.</p>
          <p>7. Payment shall be made through Net Banking only. The account details will be provided during registration.</p>
          <p>8. Accommodation facilities will be provided for the contingents that opt for it on a need-basis only. Meals will be provided for all participants and officials. Contingents are advised to bring light bedding and locks.</p>
          <p>9. Accommodation will only be provided to the registered contingent members during the dates of the fest only.</p>
          <p>10. All necessary musical instruments and other materials required for the performances shall be brought by the participants/contingent members.</p>
          <p>11. The accompanying Team Manager shall be a faculty having a minimum of 5 years of experience and/or shall be the Physical Education Director.</p>
          <p>12. Every college must pay cash of Rs. 3000/- as a caution deposit at arrival.</p>
          <p>13. Usage of any form of Tobacco, Alcohol, or Narcotic substances is entirely prohibited.</p>
          <p>14. All members of the contingent are expected to maintain discipline and decorum inside and outside the college premises. Failure to do so or engagement in any misadventure will result in penal action.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
