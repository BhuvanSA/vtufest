"use client";
import React, { useEffect, useState } from "react";

// Custom Button Component
const Button = ({ label, onClick, className }) => (
  <button
    className={`bg-gray-500 text-white text-sm px-6 py-2 rounded-md transition-transform duration-300 hover:scale-105 hover:bg-gray-600 ${className}`}
    onClick={onClick}
  >
    {label}
  </button>
);

const StudentTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getAllregistrant() {
      const res = await fetch("/api/getallregister", {
        method: "GET",
      });

      const data = await res.json();
      const resData = data.registrant;
      console.log(resData);

      const ListData = resData.map((registrant, index) => ({
        slno: index + 1,
        name: registrant.name,
        usn: registrant.usn,
        phone: registrant.phone,
        totalEvents: registrant.events.length,
        id: registrant.id,
      }));

      setRows(ListData);
    }
    getAllregistrant();
  }, []);

  const handleRemove = async (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    try {
      console.log("derleaw");
      const response = await fetch("/api/deleteregister", {
        method: "DELETE",
        body: JSON.stringify({ registrantId: id }),
         headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
    }
    catch (err) {
      alert(err);
    }
    setRows(updatedRows);
  };

  return (
    <div id="webcrumbs">
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-white shadow-2xl rounded-lg overflow-hidden border border-neutral-300">
        <div className="p-5 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-title font-semibold text-neutral-950 uppercase tracking-wide">
              List of students registered for the event
            </h2>
            <span className="bg-primary-100 text-primary-950 text-sm rounded-full px-4 py-2 font-medium">
              {rows.length}/45
            </span>
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[300px] overflow-y-scroll">
              <table className="min-w-full border-t border-neutral-300">
                <thead className="sticky top-0">
                  <tr className="bg-neutral-950 shadow-sm">
                    <th className="text-left py-4 px-6 text-white font-semibold uppercase tracking-wide">
                      Sl. No
                    </th>
                    <th className="text-left py-4 px-6 text-white font-semibold uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 text-white font-semibold uppercase tracking-wide">
                      USN
                    </th>
                    <th className="text-left py-4 px-6 text-white font-semibold uppercase tracking-wide">
                      Phone
                    </th>
                    <th className="text-left py-4 px-6 text-white font-semibold uppercase tracking-wide">
                      Events Registered
                    </th>
                    <th className="text-left py-4 px-6 text-white font-semibold uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((student, index) => {
                    const colors = [
                      "text-neutral-900",
                      "text-neutral-800",
                      "text-neutral-700",
                      "text-neutral-600",
                      "text-neutral-500",
                    ];
                    const rowColor = colors[index % colors.length];
                    return (
                      <tr
                        key={student.slno}
                        className={`${index % 2 === 0 ? "bg-blue-50" : "bg-white"
                          } hover:bg-gray-200 transition-all duration-300`}
                      >
                        <td
                          className={`border-t border-neutral-300 py-4 px-6 ${rowColor}`}
                        >
                          {student.slno}
                        </td>
                        <td
                          className={`border-t border-neutral-300 py-4 px-6 ${rowColor}`}
                        >
                          {student.name}
                        </td>
                        <td
                          className={`border-t border-neutral-300 py-4 px-6 ${rowColor}`}
                        >
                          {student.usn}
                        </td>
                        <td
                          className={`border-t border-neutral-300 py-4 px-6 ${rowColor}`}
                        >
                          {student.phone}
                        </td>
                        <td
                          className={`border-t border-neutral-300 py-4 px-6 ${rowColor}`}
                        >
                          {student.totalEvents}
                        </td>
                        <td className="border-t border-neutral-300 py-4 px-6 flex items-center gap-2">
                          <Button
                            label="Update"
                            onClick={() =>
                              alert(`Edit row with ID ${student.id}`)
                            }
                          />
                          <Button
                            label="Remove"
                            onClick={() => handleRemove(student.id)}
                            className="bg-red-500 hover:bg-red-600"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <Button
              label="Add"
              onClick={() => alert("Navigate to Add Student Page")}
            />
            <Button
              label="Submit"
              onClick={() => alert("Submit All Changes")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
