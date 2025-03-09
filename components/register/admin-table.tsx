"use client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowLeft,
  ArrowRight,
  Columns,
  FileDown,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export type Data = {
  id: string;
  accomodation: string;
  collegeCode: string;
  photo: string;
  name: string;
  collegeName: string;
  usn: string;
  phone: string;
  email: string;
  blood: string;
  gender: string;
  type:
    | "Team Manager"
    | "Participant/Accompanist"
    | "Participant"
    | "Accompanist"
    | "";
  events: { eventName: string; role?: "Participant" | "Accompanist" }[];
  status: "Pending" | "Processing" | "Success" | "Failed";
};

//////////////////////////
// College Name Filter  //
//////////////////////////

type CollegeNameFilterProps = {
  column: any;
  table: any;
};

const CollegeNameFilter: React.FC<CollegeNameFilterProps> = ({ column, table }) => {
  const allRows = table.getPreFilteredRowModel().rows;
  const allColleges = allRows.map((row: any) => row.original.collegeName as string);
  const uniqueColleges = Array.from(new Set(allColleges));
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOptions = uniqueColleges.filter((college) =>
    college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          College Name
          <ChevronDown className="ml-1 h-4 w-4" />
          {column.getFilterValue() ? `: ${column.getFilterValue()}` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 max-h-60 overflow-y-auto">
        <Input
          placeholder="Search college..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <DropdownMenuItem
          onClick={() => column.setFilterValue(undefined)}
          className="cursor-pointer"
        >
          All
        </DropdownMenuItem>
        {filteredOptions.map((college) => (
          <DropdownMenuItem
            key={college}
            onClick={() => column.setFilterValue(college)}
            className="cursor-pointer"
          >
            {college}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

//////////////////////////
// Type Column Filter   //
//////////////////////////

type TypeFilterProps = {
  column: any;
  table: any;
};

const TypeFilter: React.FC<TypeFilterProps> = ({ column, table }) => {
  const types = ["Team Manager", "Participant/Accompanist", "Participant", "Accompanist"];
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTypes = types.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          Type
          <ChevronDown className="ml-1 h-4 w-4" />
          {column.getFilterValue() ? `: ${column.getFilterValue()}` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 max-h-60 overflow-y-auto">
        <Input
          placeholder="Search type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <DropdownMenuItem
          onClick={() => column.setFilterValue(undefined)}
          className="cursor-pointer"
        >
          All
        </DropdownMenuItem>
        {filteredTypes.map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => column.setFilterValue(t)}
            className="cursor-pointer"
          >
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

//////////////////////////
// Events Column Filter //
//////////////////////////

type EventFilterProps = {
  column: any;
  table: any;
};

const EventFilter: React.FC<EventFilterProps> = ({ column, table }) => {
  const allRows = table.getPreFilteredRowModel().rows;
  // Flatten all event names
  const allEvents = allRows.flatMap((row: any) =>
    (row.original.events as { eventName: string }[]).map((e) => e.eventName)
  );
  const uniqueEvents = Array.from(new Set(allEvents));
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOptions = uniqueEvents.filter((event) =>
    event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          Events
          <ChevronDown className="ml-1 h-4 w-4" />
          {column.getFilterValue() ? `: ${column.getFilterValue()}` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 max-h-60 overflow-y-auto">
        <Input
          placeholder="Search event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <DropdownMenuItem
          onClick={() => column.setFilterValue(undefined)}
          className="cursor-pointer"
        >
          All
        </DropdownMenuItem>
        {filteredOptions.map((event) => (
          <DropdownMenuItem
            key={event}
            onClick={() => column.setFilterValue(event)}
            className="cursor-pointer"
          >
            {event}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

//////////////////////////
//    Colleges List     //
//////////////////////////

type CollegesListProps = {
  data: Data[];
  onBack: () => void;
};

const CollegesList: React.FC<CollegesListProps> = ({ data, onBack }) => {
  // Group data by collegeName
  const grouped = data.reduce((acc, curr) => {
    const college = curr.collegeName;
    if (!acc[college]) {
      acc[college] = {
        collegeName: college,
        events: new Set<string>(),
        collegeCode: curr.collegeCode,
        accomodation: curr.accomodation,
      };
    }
    curr.events.forEach((ev) => {
      if (ev.eventName) acc[college].events.add(ev.eventName);
    });
    return acc;
  }, {} as Record<string, { collegeName: string; events: Set<string>; collegeCode: string; accomodation: string }>);

  // Convert to array with sorted events per college
  let colleges: { collegeName: string; events: string[]; collegeCode: string; accomodation: string }[] =
    Object.values(grouped).map((col) => ({
      collegeName: col.collegeName,
      events: Array.from(col.events).sort(),
      collegeCode: col.collegeCode,
      accomodation: col.accomodation,
    }));

  // Sorting state for colleges list
  const [sortField, setSortField] = React.useState<"collegeName" | "eventCount">("collegeName");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  colleges.sort((a, b) => {
    let compareVal = 0;
    if (sortField === "collegeName") {
      compareVal = a.collegeName.localeCompare(b.collegeName);
    } else if (sortField === "eventCount") {
      compareVal = a.events.length - b.events.length;
    }
    return sortOrder === "asc" ? compareVal : -compareVal;
  });

  return (
    <div className="w-full px-5 rounded-xl my-12">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-xl font-bold">Colleges List</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Registrants
        </Button>
      </div>
      <div className="flex gap-4 mb-4">
        <div>
          <span>Sort by: </span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "collegeName" | "eventCount")}
          >
            <option value="collegeName">College Name</option>
            <option value="eventCount">Number of Events</option>
          </select>
        </div>
        <div>
          <span>Order: </span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">College Name</th>
            <th className="border p-2">College Code</th>
            <th className="border p-2">Accommodation</th>
            <th className="border p-2">Registered Events</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((college, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{college.collegeName}</td>
              <td className="border p-2">{college.collegeCode}</td>
              <td className="border p-2">{college.accomodation ? "Yes" : "No"}</td>
              <td className="border p-2">{college.events.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

//////////////////////////
//      DataTable       //
//////////////////////////

export function DataTable({ data }: { data: Data[] }) {
  const router = useRouter();
  const [rows, setRows] = React.useState<Data[]>(data);
  const [showCollegesList, setShowCollegesList] = React.useState(false);

  const handleUpdate = React.useCallback(
    (id: string) => {
      const originId = id.split("#")[0];
      router.push(`/register/updateregister/${originId}`);
    },
    [router]
  );

  const handleRemove = React.useCallback(
    async (id: string) => {
      const originId = id.split("#")[0];
      const updatedRows = rows.filter((row) => row.id !== id);
      try {
        const response = await fetch("/api/deleteregister", {
          method: "DELETE",
          body: JSON.stringify({ registrantId: originId }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        toast.success(data.message);
        setRows(updatedRows);
      } catch (err: unknown) {
        toast.error("Failed to delete registrant");
        console.error(err);
      }
    },
    [rows]
  );

  const handleDeleteSelected = React.useCallback(
    async (providedRegistrants?: string[]) => {
      let registrantIds: string[] = [];

      if (providedRegistrants && providedRegistrants.length > 0) {
        registrantIds = providedRegistrants;
      } else {
        const selectedRows = table.getSelectedRowModel().rows;
        registrantIds = Array.from(
          new Set(selectedRows.map((r) => (r.original.id as string).split("#")[0]))
        );
      }

      if (!registrantIds.length) {
        toast.error("No rows selected");
        return;
      }

      try {
        const response = await fetch("/api/deleteregister", {
          method: "DELETE",
          body: JSON.stringify({ registrantIds }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        toast.success(data.message);
        setRows((prev) =>
          prev.filter((row) => !registrantIds.includes((row.id as string).split("#")[0]))
        );
      } catch (error) {
        toast.error("Failed to delete registrants");
        console.error(error);
      }
    },
    [rows]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<Data>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row, table }) => {
          const rowRegistrantId = (row.original.id as string).split("#")[0];
          const handleCheck = (checked: boolean) => {
            const matchingRows = table
              .getRowModel()
              .rows.filter(
                (r) => (r.original.id as string).split("#")[0] === rowRegistrantId
              )
              .map((r) => r.id);
            table.setRowSelection((prev) => {
              const newSelection = { ...prev };
              matchingRows.forEach((idx) => {
                newSelection[idx] = checked;
              });
              return newSelection;
            });
          };

          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={handleCheck}
              aria-label="Select row"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "slno",
        header: "SL No",
        cell: ({ row, table }) => {
          const { pagination } = table.getState();
          return pagination.pageIndex * pagination.pageSize + row.index + 1;
        },
      },
      {
        accessorKey: "photo",
        header: "Photo",
        cell: ({ row }) => {
          const photoUrl = row.getValue("photo") as string;
          const imageUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${photoUrl}`;
          return (
            <Image
              src={imageUrl}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          );
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting((column.getIsSorted() as string) === "asc")
            }
          >
            Name
            <ArrowUpDown className="p-1" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("name") as string}</div>
        ),
      },
      {
        accessorKey: "usn",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting((column.getIsSorted() as string) === "asc")
            }
          >
            USN
            <ArrowUpDown className="p-1" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="uppercase">{row.getValue("usn") as string}</div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <div>{row.getValue("phone") as string}</div>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("email") as string}</div>,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => <div>{row.getValue("gender") as string}</div>,
      },
      {
        accessorKey: "blood",
        header: "DOB",
        cell: ({ row }) => <div>{row.getValue("blood") as string}</div>,
      },
      {
        accessorKey: "collegeName",
        header: ({ column, table }) => (
          <CollegeNameFilter column={column} table={table} />
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("collegeName") as string}</div>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const collegeName = row.getValue(columnId) as string;
          return collegeName === filterValue;
        },
      },
      {
        accessorKey: "type",
        header: ({ column, table }) => <TypeFilter column={column} table={table} />,
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("type") as string}</div>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const type = row.getValue(columnId) as string;
          return type === filterValue;
        },
      },
      {
        accessorKey: "events",
        header: ({ column, table }) => <EventFilter column={column} table={table} />,
        cell: ({ row }) => {
          const events = row.getValue("events") as { eventName: string; role?: string }[];
          const type = row.getValue("type") as string;
          return (
            <div className="capitalize">
              {type !== "Participant/Accompanist" ? (
                events.map((e) => e.eventName).join(", ")
              ) : (
                <>
                  <div className="mb-1 text-black">
                    <span className="font-bold">Participant: </span>
                    {events
                      .filter((v) => v.role === "Participant")
                      .map((e) => e.eventName)
                      .join(", ")}
                  </div>
                  <div className="text-black">
                    <span className="font-bold">Accompanist: </span>
                    {events
                      .filter((v) => v.role === "Accompanist")
                      .map((e) => e.eventName)
                      .join(", ")}
                  </div>
                </>
              )}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const events = row.getValue(columnId) as { eventName: string }[];
          return events.some((e) => e.eventName === filterValue);
        },
      },
      {
        accessorKey: "Action",
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const data = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-primary text-l">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleUpdate(data.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleDeleteSelected([(data.id as string).split("#")[0]])
                  }
                  className="text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleUpdate, handleRemove]
  );

  const table = useReactTable({
    data: rows,
    columns,
    initialState: { pagination: { pageSize: 50 } }, // default to 50 rows per page
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Compute the current (filtered) total of registrants
  const totalRegistrants = table.getFilteredRowModel().rows.length;

  // Handler to clear all filters and sorting
  const clearAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    table.resetColumnFilters();
    table.resetSorting();
  };

  const handleExportToPDF = () => {
    const filteredSortedRows = table.getRowModel().rows;
    const exportData: string[][] = filteredSortedRows.map((row) => [
      (row.getValue("name") as string) || "",
      (row.getValue("usn") as string) || "",
      (row.getValue("collegeName") as string) || "",
      (row.getValue("type") as string) || "",
      ((row.getValue("events") as { eventName: string }[])
        ?.map((event) => event.eventName)
        .join(", ")) || "",
      (row.getValue("status") as string) || "",
    ]);

    const headers = [["Name", "USN", "College Name", "Type", "Events", "Status"]];
    const doc = new jsPDF();
    const img = document.createElement("img");
    img.src = "/images/gatformat.jpg";
    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
      autoTable(doc, {
        head: headers as any,
        body: exportData as any,
        startY: 80,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [26, 188, 156] },
      });
      doc.text("Principal's Signature", 14, pageHeight - 20);
      doc.text("Coordinator's Signature", pageWidth - 80, pageHeight - 20);
      doc.save("registrants.pdf");
    };
  };

  const handleExportToExcel = () => {
    const filteredRows = table.getRowModel().rows;
    const collegeData: Record<string, Data[]> = {};
    filteredRows.forEach((row) => {
      const collegeName = row.getValue("collegeName") as string;
      if (!collegeData[collegeName]) {
        collegeData[collegeName] = [];
      }
      collegeData[collegeName].push(row.original);
    });

    const excelData: any[][] = [];
    // Overall header rows
    excelData.push(["Visveraya Technological University in association with Global Academy of Technology"]);
    excelData.push(["24th VTU Youth Fest @ GAT"]);
    excelData.push([]); // blank row

    for (const collegeName of Object.keys(collegeData)) {
      const rowsForCollege = collegeData[collegeName];
      const vtuCode = rowsForCollege[0].collegeCode || "N/A";
      const collegeAssignedCode = (rowsForCollege[0] as any).vtuCode || "N/A";
      const accomodationCollege = rowsForCollege[0].accomodation ? "Yes" : "No";

      // College header rows
      excelData.push([`College: ${collegeName}`]);
      excelData.push([`College Assigned Code: ${collegeAssignedCode}`]);
      excelData.push([`VTU Code: ${vtuCode}`]);
      excelData.push([`Accomodation: ${accomodationCollege}`]);
      excelData.push([`Accommodation Allocated: N/A`]);
      excelData.push([]);

      // Student Details Table (exclude Team Manager)
      const studentRows = rowsForCollege.filter((r) => r.type !== "Team Manager");
      if (studentRows.length > 0) {
        excelData.push(["Student Details"]);
        excelData.push(["SL No", "Student Code", "Name", "USN", "Phone", "Email", "Gender", "DOB", "Accomodation"]);
        studentRows.forEach((row, index) => {
          const studentCode = row.usn || "";
          excelData.push([
            index + 1,
            studentCode,
            row.name || "",
            row.usn || "",
            row.phone || "",
            row.email || "",
            row.gender || "",
            row.blood|| "",
            row.accomodation ? "Yes" : "No",
          ]);
        });
        excelData.push([]);
      }

      // Team Manager Details Table
      const teamManagerRows = rowsForCollege.filter((r) => r.type === "Team Manager");
      if (teamManagerRows.length > 0) {
        excelData.push(["Team Manager Details"]);
        excelData.push(["SL No", "Name", "Designation", "Phone", "Email", "Gender", "DOB"]);
        teamManagerRows.forEach((row, index) => {
          excelData.push([
            index + 1,
            row.name || "",
            row.designation || "",
            row.phone || "",
            row.email || "",
            row.gender || "",
            row.dateOfBirth || "",
          ]);
        });
        excelData.push([]);
      }

      // Event Registration Table
      const eventsMap: Record<string, { name: string; role: string }[]> = {};
      rowsForCollege.forEach((row) => {
        if (row.events && Array.isArray(row.events)) {
          row.events.forEach((ev: { eventName: string; role?: string }) => {
            if (ev.eventName) {
              if (!eventsMap[ev.eventName]) {
                eventsMap[ev.eventName] = [];
              }
              eventsMap[ev.eventName].push({
                name: row.name,
                role: ev.role || "",
              });
            }
          });
        }
      });
      for (const eventName of Object.keys(eventsMap)) {
        excelData.push([`Event: ${eventName}`]);
        excelData.push(["SL No", "Name", "Role"]);
        eventsMap[eventName].forEach((entry, index) => {
          excelData.push([index + 1, entry.name, entry.role]);
        });
        excelData.push([]);
      }
      excelData.push([]);
    }

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws["!cols"] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
    ];

    // Apply basic cell styling (if supported)
    const headerTitles = new Set([
      "SL No",
      "Student Code",
      "Name",
      "USN",
      "Phone",
      "Email",
      "Gender",
      "DOB",
      "Accomodation",
      "Designation",
    ]);
    for (let cell in ws) {
      if (ws.hasOwnProperty(cell) && cell[0] !== "!") {
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s.font = { sz: 12, name: "Calibri" };
        if (headerTitles.has(ws[cell].v)) {
          ws[cell].s.font.bold = true;
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrants");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "registrants.xlsx");
  };

  // If the Colleges List view is toggled, render that instead.
  if (showCollegesList) {
    return <CollegesList data={rows} onBack={() => setShowCollegesList(false)} />;
  }

  return (
    <div className="w-full px-5 rounded-xl my-12">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center gap-3 py-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-3 h-4 w-5 text-muted-foreground" />
          <Input
            placeholder="Search name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-10 w-[26rem]"
          />
        </div>
        <Button variant="outline" onClick={clearAllFilters} className="ml-2">
          Clear Filters
        </Button>
        {/* New button to switch to Colleges List */}
        <Button variant="outline" onClick={() => setShowCollegesList(true)}>
          Go to Colleges List
        </Button>
        <Button
          variant="outline"
          className="ml-auto bg-[#00B140] text-white hover:scale-105 hover:bg-[#00B140] hover:text-white"
          onClick={handleExportToPDF}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download current view as PDF
        </Button>
        <Button
          variant="outline"
          className="ml-auto bg-primary text-white hover:scale-105  hover:text-white"
          onClick={handleExportToExcel}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download current view as excel
        </Button>
        <Button
          variant="outline"
          className="bg-red-500 text-white hover:scale-105 hover:bg-red-500 hover:text-primary-foreground"
          onClick={() => handleDeleteSelected()}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              <Columns className="mr-2 h-4 w-4" />
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Display total registrants */}
      <div className="mb-2 text-sm text-gray-700">
        Total Registrants: {totalRegistrants}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-auto min-h-[18rem] shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-primary">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:bg-blue-50 text-black"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="min-h-[18rem] text-3xl text-center">
                  No Registrations Are Done Yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Advanced Pagination & Page Size Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded p-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
