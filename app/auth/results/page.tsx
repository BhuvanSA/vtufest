import React from "react";
import Image from "next/image";
import vtulogo from "@/public/images/vtulogo.png";
import logo1 from "@/public/images/logo1.png";
import logo2 from "@/public/images/logo2.png";
import logo3 from "@/public/images/logo3.png";
import logo4 from "@/public/images/logo4.png";
import logo5 from "@/public/images/logo5.png";
import logo6 from "@/public/images/logo6.png";
import logo7 from "@/public/images/logo7.png";
import logo8 from "@/public/images/logo8.png";
import logo9 from "@/public/images/logo9.png";
import logo10 from "@/public/images/logo10.png";
import logo11 from "@/public/images/logo11.png";
import logo12 from "@/public/images/logo12.png";
import logo13 from "@/public/images/logo13.png";
import logo14 from "@/public/images/logo14.png";
import logo15 from "@/public/images/logo15.png";
import logo16 from "@/public/images/logo16.png";
import logo17 from "@/public/images/logo17.png";
import logo18 from "@/public/images/logo18.png";
import logo19 from "@/public/images/logo19.png";
import logo20 from "@/public/images/logo20.png";
import logo21 from "@/public/images/logo21.png";
import logo22 from "@/public/images/logo22.png";
import logo23 from "@/public/images/logo23.png";
import logo24 from "@/public/images/logo24.png";
import logo25 from "@/public/images/logo25.png";
import logo26 from "@/public/images/logo26.png";
import logo27 from "@/public/images/logo27.png";
import logo28 from "@/public/images/logo28.png";
import logo29 from "@/public/images/logo29.png";
import logo30 from "@/public/images/logo30.png";
import logo31 from "@/public/images/logo31.png";
import logo32 from "@/public/images/logo32.png";
import logo33 from "@/public/images/logo33.png";
import logo34 from "@/public/images/logo34.png";
import logo35 from "@/public/images/logo35.png";
import logo36 from "@/public/images/logo36.png";
import logo37 from "@/public/images/logo37.png";
import logo38 from "@/public/images/logo38.png";
import logo39 from "@/public/images/logo39.png";
import logo40 from "@/public/images/logo40.png";
import logo41 from "@/public/images/logo41.png";
import logo42 from "@/public/images/logo42.png";
import logo43 from "@/public/images/logo43.png";
import logo44 from "@/public/images/logo44.png";
import logo45 from "@/public/images/logo45.png";
import logo46 from "@/public/images/logo46.png";
import logo47 from "@/public/images/gat-logo.png";

import type { StaticImageData } from "next/image";

// ---------------------------------------------------
// 1. College Type and Complete College List
// Each college entry has a comment with its college number.
// ---------------------------------------------------
interface College {
  code: string;
  name: string;
  logo: StaticImageData;
}

const colleges: College[] = [
  { code: "GA-000", name: "Visvesvaraya Technological University", logo: vtulogo },  // 0
  { code: "GA-001", name: "BGS COLLEGE OF ENGINEERING & TECHNOLOGY", logo: logo1 },   // GA-001
  { code: "GA-002", name: "VIVEKANANDA COLLEGE OF ENGINEERING AND TECHNOLOGY", logo: logo2 },   // GA-002
  { code: "GA-003", name: "ADICHUNCHANAGIRI INSTITUTE OF TECHNOLOGY", logo: logo3 },   // GA-003
  { code: "GA-004", name: "GURU NANAK DEV ENGINEERING COLLEGE", logo: logo4 },   // GA-004
  { code: "GA-005", name: "M.S.RAMAIAH INSTITUTE OF TECHNIOLOGY", logo: logo5 },   // GA-005
  { code: "GA-006", name: "C.M.R INSTITUTE OF TECHNOLOGY", logo: logo6 },   // GA-006
  { code: "GA-007", name: "JYOTHY INSTITUTE OF TECHNOLOGY", logo: logo7 },   // GA-007
  { code: "GA-008", name: "DR. T THIMAIAH INSTITUTE OF TECHNOLOGY", logo: logo8 },   // GA-008
  { code: "GA-009", name: "HIRASUGAR INSTITUTE OF TECHNOLOGY", logo: logo9 },   // GA-009
  { code: "GA-010", name: "BLDEAS COLLEGE OF ENGINEERING", logo: logo10 },   // GA-010
  { code: "GA-011", name: "KALPATARU INSTITUTE OF TECHNOLOGY", logo: logo11 },   // GA-011
  { code: "GA-012", name: "SRI SAIRAM COLLEGE OF ENGINEERING", logo: logo12 },   // GA-012
  { code: "GA-013", name: "R.L.JALAPPA INSTITUTE OF TECHNOLOGY", logo: logo13 },   // GA-013
  { code: "GA-014", name: "ACHARAYA INSTITUTE OF TECHNOLOGY", logo: logo14 },   // GA-014
  { code: "GA-015", name: "NATIONAL INSTITUTE OF ENGINEERING", logo: logo15 },   // GA-015
  { code: "GA-016", name: "SEA COLLEGE OF ENGINEERING AND TECHNOLOGY", logo: logo16 },   // GA-016
  { code: "GA-017", name: "BEARYS INSTITUTE OF TECHNOLOGY", logo: logo17 },   // GA-017
  { code: "GA-018", name: "ALVAS INST. OF ENGG. AND TECHNOLOGY", logo: logo18 },   // GA-018
  { code: "GA-019", name: "JAWAHARLAL NEHRU NATIONAL COLLEGE OF ENGINERING", logo: logo19 },   // GA-019
  { code: "GA-020", name: "BMS INSTITUTE OF TECHNOLOGY", logo: logo20 },   // GA-020
  { code: "GA-021", name: "RNS INSTITUTE OF TECHNOLOGY", logo: logo21 },   // GA-021
  { code: "GA-022", name: "B.N.M.INSTITUTE OF TECHNOLOGY", logo: logo22 },   // GA-022
  { code: "GA-023", name: "BELLARY ENGINEERING COLLEGE", logo: logo23 },   // GA-023
  { code: "GA-024", name: "SAI VIDYA INSTITUTE OF TECHNOLOGY", logo: logo24 },   // GA-024
  { code: "GA-025", name: "SJM INSTITUTE OF TECHNOLOGY", logo: logo25 },   // GA-025
  { code: "GA-026", name: "VEMANA INSTITUTE OF TECHNOLOGY", logo: logo26 },   // GA-026
  { code: "GA-027", name: "Sahyadri Institute of Tech. & Mgmt., Mangaluru", logo: logo27 },   // GA-027
  { code: "GA-028", name: "PROUDADEVARAYA INSTITUTE OF TECHNOLOGY", logo: logo28 },   // GA-028
  { code: "GA-029", name: "SAMBHRAM INSTITUTE OF TECHNOLOGY", logo: logo29 },   // GA-029
  { code: "GA-030", name: "P.E.S COLLEGE OF ENGINEERING", logo: logo30 },   // GA-030
  { code: "GA-031", name: "RAJARAJESWARI COLLEGE OF ENGINEERING", logo: logo31 },   // GA-031
  { code: "GA-032", name: "JSS ACADEMY OF TECHNICIAL EDUCATION", logo: logo32 },   // GA-032
  { code: "GA-033", name: "KNS INSTITUTE OF TECHNOLOGY", logo: logo33 },   // GA-033
  { code: "GA-034", name: "ATRIA INSTITUTE OF TECHNOLOGY", logo: logo34 },   // GA-034
  { code: "GA-035", name: "K.S.INSTITUTE OF TECHNOLOGY", logo: logo35 },   // GA-035
  { code: "GA-036", name: "T. JOHN INSTITUTE OF TECHNOLOGY", logo: logo36 },   // GA-036
  { code: "GA-037", name: "VIVEKANANDA INSTITUTE OF TECHNOLOGY", logo: logo37 },   // GA-037
  { code: "GA-038", name: "SRINIVAS INSTITUTE OF TECHNOLOGY", logo: logo38 },   // GA-038
  { code: "GA-039", name: "PES INSITUTE OF TECHNOLOGY AND MGMT.", logo: logo39 },   // GA-039
  { code: "GA-040", name: "GOVT. ENGINEERING COLLEGE HASSAN", logo: logo40 },   // GA-040
  { code: "GA-041", name: "GSSS INSTITUTE OF ENGINEERING AND TECHNOLOGY FOR WOMEN", logo: logo41 },   // GA-041
  { code: "GA-042", name: "GOVT. ENGINEERING COLLEGE RAMNAGAR", logo: logo42 },   // GA-042
  { code: "GA-043", name: "DAYANANDA SAGAR COLLEGE OF ENGINEERING", logo: logo43 },   // GA-043
  { code: "GA-044", name: "S.J.C INSTITUTE OF TECHNOLOGY", logo: logo44 },   // GA-044
  { code: "GA-045", name: "DON BOSCO INSTITUTE OF TECHNOLOGY", logo: logo45 },   // GA-045
  { code: "GA-046", name: "SDM COLLEGE OF ENGINEERING AND TECHNOLOGY", logo: logo46 },   // GA-046
  { code: "GA-047", name: "GLOBAL ACADEMY OF TECHNOLOGY", logo: logo47 },   // GA-047
];

// ---------------------------------------------------
// 2. Define the Event type and Sample Events Data
// There are four days with six events per day.
// Update the winners for each event (using the comments) as needed.
// ---------------------------------------------------
interface Event {
  name: string;
  winners: College[];
}

const eventsData: { [day: string]: Event[] } = {
  "Day 1": [
    // Day 1, Event 1: update winners below:
    { name: "Event 1: Sample Event", winners: [colleges[0], colleges[1], colleges[2]] },
    { name: "Event 2: Sample Event", winners: [colleges[3], colleges[4], colleges[5]] },
    { name: "Event 3: Sample Event", winners: [colleges[6], colleges[7], colleges[8]] },
    { name: "Event 4: Sample Event", winners: [colleges[9], colleges[10], colleges[11]] },
    { name: "Event 5: Sample Event", winners: [colleges[12], colleges[13], colleges[14]] },
    { name: "Event 6: Sample Event", winners: [colleges[15], colleges[16], colleges[17]] },
  ],
  "Day 2": [
    { name: "Event 1: Sample Event", winners: [colleges[18], colleges[19], colleges[20]] },
    { name: "Event 2: Sample Event", winners: [colleges[21], colleges[22], colleges[23]] },
    { name: "Event 3: Sample Event", winners: [colleges[24], colleges[25], colleges[26]] },
    { name: "Event 4: Sample Event", winners: [colleges[27], colleges[28], colleges[29]] },
    { name: "Event 5: Sample Event", winners: [colleges[30], colleges[31], colleges[32]] },
    { name: "Event 6: Sample Event", winners: [colleges[33], colleges[34], colleges[35]] },
  ],
  "Day 3": [
    { name: "Event 1: Sample Event", winners: [colleges[36], colleges[37], colleges[38]] },
    { name: "Event 2: Sample Event", winners: [colleges[39], colleges[40], colleges[41]] },
    { name: "Event 3: Sample Event", winners: [colleges[42], colleges[43], colleges[44]] },
    { name: "Event 4: Sample Event", winners: [colleges[45], colleges[46], colleges[47]] },
    { name: "Event 5: Sample Event", winners: [colleges[1], colleges[2], colleges[3]] },
    { name: "Event 6: Sample Event", winners: [colleges[4], colleges[5], colleges[6]] },
  ],
  "Day 4": [
    { name: "Event 1: Sample Event", winners: [colleges[7], colleges[8], colleges[9]] },
    { name: "Event 2: Sample Event", winners: [colleges[10], colleges[11], colleges[12]] },
    { name: "Event 3: Sample Event", winners: [colleges[13], colleges[14], colleges[15]] },
    { name: "Event 4: Sample Event", winners: [colleges[16], colleges[17], colleges[18]] },
    { name: "Event 5: Sample Event", winners: [colleges[19], colleges[20], colleges[21]] },
    { name: "Event 6: Sample Event", winners: [colleges[22], colleges[23], colleges[24]] },
  ],
};

// ---------------------------------------------------
// 3. Layout Components with Enhanced Styling and Animations
// ---------------------------------------------------

// Banner: A header with a red background, bold yellow text, and smooth hover animations.
const Banner: React.FC = () => (
  <div className="bg-red-800 p-8 rounded-lg text-center mb-8 transform transition duration-700 hover:scale-105">
    <h1 className="text-4xl md:text-5xl font-bold text-yellow-300">Daily Event Results</h1>
    <p className="mt-2 text-lg md:text-xl text-yellow-300">
      Update winners daily. Contact appeals committee for issues.
    </p>
  </div>
);

// EventCard: A larger, smartly designed card with a red background that displays each winner in a compact horizontal row.
// The layout: Left: ranking icon; center: a column with the college logo (with code below) and right: college name.
const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    return (
      <div className="bg-red-800 rounded-lg shadow-xl p-8 mb-6 transform transition duration-700 hover:scale-105 hover:shadow-2xl">
        {/* Event Title */}
        <h3 className="text-4xl font-extrabold text-yellow-300 mb-6 tracking-wide">
          {event.name}
        </h3>
        {/* Map through winners */}
        {event.winners.map((winner, idx) => {
          if (!winner) return null;
          return (
            <div
              key={idx}
              className="flex items-center p-4 bg-red-700 rounded-lg mb-4 space-x-4"
            >
              {/* Ranking Icon */}
              <div className="w-16 flex justify-center items-center">
                <span className="text-3xl font-bold">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                </span>
              </div>
              {/* College Logo & Code */}
              <div className="flex flex-col items-center">
                <div className="relative h-24 w-24">
                  <Image
                    src={winner.logo}
                    alt={winner.name}
                    fill
                    className="object-cover rounded-full transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <p className="text-base text-yellow-300 mt-2">{winner.code}</p>
              </div>
              {/* College Name */}
              <div className="flex-1">
                <p className="text-2xl font-bold text-yellow-300">
                  {winner.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  

// ---------------------------------------------------
// 4. Main Page Component: Loop through each day and event.
// Update the winners for each event using the comments in the eventsData object.
// ---------------------------------------------------
export default function DailyEventResults() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-r from-yellow-400 to-yellow-600">
      <div className="max-w-4xl mx-auto">
        <Banner />
        {Object.entries(eventsData).map(([day, events]) => (
          <section key={day} className="mb-8">
            <h2 className="text-6xl font-extrabold text-center mb-6 tracking-wide bg-gradient-to-r from-red-600 via-red-800 to-red-900 bg-clip-text text-transparent">{day}</h2>
            {events.map((event, index) => (
              <div key={index}>
                {/* For {day}, update winners for Event {index + 1} in eventsData */}
                <EventCard event={event} />
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
