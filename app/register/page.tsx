
"use client"
import Button from "@/components/Button";
import React, { useState } from "react";

// Reusable Button Component


const StudentTable = () => {
  const [rows, setRows] = useState([
    { id: 1, name: "", phone: "", usn: "", category: "", totalEvents: 0 },
  ]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      name: "",
      phone: "",
      usn: "",
      category: "",
      totalEvents: 0,
    };
    setRows([...rows, newRow]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Student Entries</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">USN</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Total Events</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">{row.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={row.name}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].name = e.target.value;
                      setRows(updatedRows);
                    }}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={row.phone}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].phone = e.target.value;
                      setRows(updatedRows);
                    }}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={row.usn}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].usn = e.target.value;
                      setRows(updatedRows);
                    }}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    value={row.category}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].category = e.target.value;
                      setRows(updatedRows);
                    }}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {row.totalEvents}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button
                    label="Edit Details"
                    OnClick={() => alert(`Edit row with ID ${row.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <Button label="Add" OnClick={addRow} />
      </div>
    </div>
  );
};

export dfault StudentTable;

