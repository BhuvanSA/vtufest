"use client";
import axios from "axios";
import React, { useState } from "react";
const eventCategories = [
  {
    eventNo: 1,
    eventName: "Classical Vocal Solo (Hindustani/Carnatic)",
    category: "MUSIC",
    maxParticipant: 1,
    maxAccompanist: 2,
  },
  {
    eventNo: 2,
    eventName: "Classical Instrumental Solo (Percussion Tala Vadya)",
    category: "MUSIC",
    maxParticipant: 1,
    maxAccompanist: 2,
  },
  {
    eventNo: 3,
    eventName: "Classical Instrumental Solo (Non-Percussion Swara Vadya)",
    category: "MUSIC",
    maxParticipant: 1,
    maxAccompanist: 2,
  },
  {
    eventNo: 4,
    eventName: "Light Vocal Solo (Indian)",
    category: "MUSIC",
    maxParticipant: 1,
    maxAccompanist: 2,
  },
  {
    eventNo: 5,
    eventName: "Western Vocal Solo",
    category: "MUSIC",
    maxParticipant: 1,
    maxAccompanist: 2,
  },
  {
    eventNo: 6,
    eventName: "Group Song (Indian)",
    category: "MUSIC",
    maxParticipant: 6,
    maxAccompanist: 3,
  },
  {
    eventNo: 7,
    eventName: "Group Song (Western)",
    category: "MUSIC",
    maxParticipant: 6,
    maxAccompanist: 3,
  },
  {
    eventNo: 8,
    eventName: "Folk Orchestra",
    category: "MUSIC",
    maxParticipant: 12,
    maxAccompanist: 3,
  },
  {
    eventNo: 9,
    eventName: "Folk / Tribal Dance",
    category: "DANCE",
    maxParticipant: 10,
    maxAccompanist: 5,
  },
  {
    eventNo: 10,
    eventName: "Classical Dance Solo",
    category: "DANCE",
    maxParticipant: 1,
    maxAccompanist: 3,
  },
  {
    eventNo: 11,
    eventName: "Skit",
    category: "THEATRE",
    maxParticipant: 6,
    maxAccompanist: 3,
  },
  {
    eventNo: 12,
    eventName: "Mime",
    category: "THEATRE",
    maxParticipant: 6,
    maxAccompanist: 2,
  },
  {
    eventNo: 13,
    eventName: "Mimicry",
    category: "THEATRE",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 14,
    eventName: "One Act Play",
    category: "THEATRE",
    maxParticipant: 9,
    maxAccompanist: 5,
  },
  {
    eventNo: 15,
    eventName: "Quiz",
    category: "LITERARY",
    maxParticipant: 3,
    maxAccompanist: 0,
  },
  {
    eventNo: 16,
    eventName: "Debate",
    category: "LITERARY",
    maxParticipant: 2,
    maxAccompanist: 0,
  },
  {
    eventNo: 17,
    eventName: "Elocution",
    category: "LITERARY",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 18,
    eventName: "Collage",
    category: "FINE-ARTS",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 19,
    eventName: "Rangoli",
    category: "FINE-ARTS",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 20,
    eventName: "Cartooning",
    category: "FINE-ARTS",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 21,
    eventName: "Installation",
    category: "FINE-ARTS",
    maxParticipant: 4,
    maxAccompanist: 0,
  },
  {
    eventNo: 22,
    eventName: "Poster Making",
    category: "FINE-ARTS",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 23,
    eventName: "Clay Modelling",
    category: "FINE-ARTS",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 24,
    eventName: "On Spot Painting",
    category: "FINE-ARTS",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
  {
    eventNo: 25,
    eventName: "Spot Photography",
    category: "FINE-ARTS",
    maxParticipant: 1,
    maxAccompanist: 0,
  },
];

export default function EventRegister() {
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
    const [responseBody, setResponseBody] = useState<object | null>(null);
  
    // Group events by category
    const groupedEvents = eventCategories.reduce((acc, event) => {
      acc[event.category] = acc[event.category] || [];
      acc[event.category].push(event);
      return acc;
    }, {} as Record<string, typeof eventCategories>);
  
    const toggleSelection = (eventNo: number) => {
      setSelectedEvents((prev) =>
        prev.includes(eventNo)
          ? prev.filter((id) => id !== eventNo)
          : [...prev, eventNo]
      );
    };
  

    const generateResponse = async () => {
        try {
          // Format the body to include only the required fields in the correct structure
          const body = JSON.stringify({
            events: eventCategories
              .filter((event) => selectedEvents.includes(event.eventNo))
              .map((event) => ({
                eventNo: event.eventNo,
                eventName: event.eventName,
                category: event.category,
                maxParticipant: event.maxParticipant,
                maxAccompanist: event.maxAccompanist,
              })),
          });
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/eventsregister',
            data : {events:body}
          };
          
          const response = await axios.request(config);
          // Send POST request
        //   const response = await axios.post(
        //     "http://localhost:3000/api/eventsregister",{
        //         body
        //     }
        //   );
        //   console.log(response);
          // Handle success response
          if (response.status === 200 || response.status === 201) {
            console.log("Response successfully sent:", response.data);
            alert("Response sent successfully!");
          } else {
            console.error("Unexpected response status:", response.status);
            alert("Something went wrong! Please try again.");
          }
        } catch (error) {
          // Handle error
          console.error("Error while sending response:", error);
          alert("Failed to send response. Please check your connection or server.");
        }
      };
    // const generateResponse = () => {
    //   const body = {
    //     events: eventCategories.filter((event) =>
    //       selectedEvents.includes(event.eventNo)
    //     ),
    //   };
    //   setResponseBody(body);
    // };
  
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
            Select Your Events
          </h1>
          {/* Render sections by category */}
          {Object.keys(groupedEvents).map((category) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedEvents[category].map((event) => (
                  <div
                    key={event.eventNo}
                    onClick={() => toggleSelection(event.eventNo)}
                    className={`p-5 border-2 rounded-lg shadow-md cursor-pointer transition duration-300 ${
                      selectedEvents.includes(event.eventNo)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:shadow-lg"
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {event.eventName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Max Participants:{" "}
                      <span className="font-medium text-gray-800">
                        {event.maxParticipant}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Max Accompanists:{" "}
                      <span className="font-medium text-gray-800">
                        {event.maxAccompanist}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
  
          {/* Selected Events and Response Section */}
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              Selected Events
            </h2>
            <ul className="mt-4">
              {selectedEvents.length > 0 ? (
                eventCategories
                  .filter((event) => selectedEvents.includes(event.eventNo))
                  .map((event) => (
                    <li key={event.eventNo} className="text-lg text-gray-800">
                      {event.eventName}
                    </li>
                  ))
              ) : (
                <p className="text-gray-500">No events selected</p>
              )}
            </ul>
            <button
              onClick={generateResponse}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition"
            >
              Generate Response
            </button>
            {responseBody && (
              <div className="mt-6 p-4 bg-gray-100 border rounded-md">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(responseBody, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }