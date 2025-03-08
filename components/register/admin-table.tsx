"use client";
import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Columns,
  FileDown,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
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

// Updated Data type based on your Prisma schema.
export type Data = {
  id: string;
  photo: string; // used to construct the photo URL
  name: string;
  collegeName: string;
  collegeCode?: string; // from Users.collegeCode
  usn: string;
  type:
    | "Team Manager"
    | "Participant/Accompanist"
    | "Participant"
    | "Accompanist"
    | "";
  events: { eventName: string; role?: "Participant" | "Accompanist" }[];
  status: "Pending" | "Processing" | "Success" | "Failed";
  phone: string;
  email: string;
  gender: string;
  accomodation: boolean; // from Registrants.accomodation
  designation?: string;
  dateOfBirth?: string; // extracted from database (DOB)
};

// -------------------- Helper: Convert Image URL to Base64 --------------------
async function getBase64ImageFromURL(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error in getBase64ImageFromURL:", error);
    return "";
  }
}

// -------------------- Main DataTable Component --------------------
export function DataTable({ data }: { data: Data[] }) {
  const router = useRouter();
  const [rows, setRows] = React.useState<Data[]>(data);

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

  // --- Updated Columns: now including Phone, Email, Gender, and DOB ---
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
        accessorKey: "dateOfBirth",
        header: "DOB",
        cell: ({ row }) => <div>{row.getValue("dateOfBirth") as string}</div>,
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
          if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0))
            return true;
          const collegeName = row.getValue(columnId) as string;
          return (filterValue as string[]).includes(collegeName);
        },
      },
      {
        accessorKey: "type",
        header: ({ column, table }) => <TypeFilter column={column} table={table} />,
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("type") as string}</div>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0))
            return true;
          const type = row.getValue(columnId) as string;
          return (filterValue as string[]).includes(type);
        },
      },
      {
        accessorKey: "events",
        header: ({ column, table }) => <EventFilter column={column} table={table} />,
        cell: ({ row }) => {
          const events = row.getValue("events") as {
            eventName: string;
            role?: string;
          }[];
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
          if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0))
            return true;
          const events = row.getValue(columnId) as { eventName: string }[];
          return (filterValue as string[]).some((val) =>
            events.some((e) => e.eventName === val)
          );
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
    initialState: { pagination: { pageSize: 50 } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const totalRegistrants = table.getFilteredRowModel().rows.length;

  const clearAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    table.resetColumnFilters();
    table.resetSorting();
  };

  // --------------------- Excel Export ---------------------
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
    excelData.push([
      "Visveraya technological university in association with Global Academy of technology",
    ]);
    excelData.push(["24th VTU Youth Fest @ GAT"]);
    excelData.push([]); // blank row

    // Loop through each college group
    for (const collegeName of Object.keys(collegeData)) {
      const rowsForCollege = collegeData[collegeName];
      const collegeAssignedCode = rowsForCollege[0].collegeCode || "N/A";
      const vtuCode = (rowsForCollege[0] as any).vtuCode || "N/A";
      const accomodationCollege = rowsForCollege[0].accomodation ? "Yes" : "No";

      // Five detail header rows for the college
      excelData.push([`College: ${collegeName}`]);
      excelData.push([`College Assigned Code: ${collegeAssignedCode}`]);
      excelData.push([`VTU Code: ${vtuCode}`]);
      excelData.push([`Accomodation: ${accomodationCollege}`]);
      excelData.push([`Accommodation Allocated: N/A`]); // Placeholder; update as needed
      excelData.push([]); // blank row

      // STUDENT TABLE (exclude Team Manager)
      const studentRows = rowsForCollege.filter((r) => r.type !== "Team Manager");
      if (studentRows.length > 0) {
        excelData.push(["Student Details"]);
        // Columns: SL No, Student Code, Name, USN, Phone, Email, Gender, DOB, Accomodation
        excelData.push([
          "SL No",
          "Student Code",
          "Name",
          "USN",
          "Phone",
          "Email",
          "Gender",
          "DOB",
          "Accomodation",
        ]);
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
            row.dateOfBirth || "",
            row.accomodation ? "Yes" : "No",
          ]);
        });
        excelData.push([]); // blank row
      }

      // TEAM MANAGER TABLE
      const teamManagerRows = rowsForCollege.filter((r) => r.type === "Team Manager");
      if (teamManagerRows.length > 0) {
        excelData.push(["Team Manager Details"]);
        // Columns: SL No, Name, Designation, Phone, Email, Gender, DOB
        excelData.push([
          "SL No",
          "Name",
          "Designation",
          "Phone",
          "Email",
          "Gender",
          "DOB",
        ]);
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
        excelData.push([]); // blank row
      }

      // EVENT REGISTRATION TABLE
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
        excelData.push([]); // blank row
      }
      // Extra blank row between colleges
      excelData.push([]);
    }

    // Create worksheet from array
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set default column widths for better readability.
    ws["!cols"] = [
      { wch: 8 },  // SL No
      { wch: 20 }, // Student Code / Name
      { wch: 30 }, // Name or Designation
      { wch: 20 }, // USN or Phone
      { wch: 20 }, // Phone or Email
      { wch: 30 }, // Email or Gender
      { wch: 15 }, // Gender or DOB
      { wch: 20 }, // DOB or Accomodation
      { wch: 15 }, // Accomodation (only for student table)
    ];

    // ----- Apply overall cell styling (if supported by your XLSX version) -----
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

  return (
    <div className="w-full px-5 rounded-xl my-12">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center py-4">
        <div className="flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-3 h-4 w-5 text-muted-foreground" />
            <Input
              placeholder="Search name..."
              value={(table.getColumn("name")?.getFilterValue() as string[])?.[0] ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue([event.target.value])
              }
              className="pl-10 w-[26rem]"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="px-4"
          >
            Clear Filters
          </Button>
          <Button
            variant="outline"
            className="bg-blue-500 text-white hover:scale-105 hover:bg-blue-500 hover:text-white px-4"
            onClick={handleExportToExcel}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download as Excel
          </Button>
          <Button
            variant="outline"
            className="bg-red-500 text-white hover:scale-105 hover:bg-red-500 hover:text-primary-foreground px-4"
            onClick={() => handleDeleteSelected()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      </div>

      {/* Display total registrants */}
      <div className="mb-2 text-sm text-gray-700">
        Total Registrants: {totalRegistrants}
      </div>

      {/* Data Table */}
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

      {/* Pagination & Page Size */}
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

// -------------------- Filter Components --------------------

type CollegeNameFilterProps = {
  column: any;
  table: any;
};

const CollegeNameFilter: React.FC<CollegeNameFilterProps> = ({ column, table }) => {
  const allRows = table.getPreFilteredRowModel().rows;
  const allColleges = allRows.map((row: any) => row.original.collegeName as string);
  const uniqueColleges = Array.from(new Set(allColleges)) as string[];
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredOptions: string[] = uniqueColleges.filter((college: string) =>
    college.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          College Name
          <ChevronDown className="ml-1 h-4 w-4" />
          {Array.isArray(column.getFilterValue()) && column.getFilterValue().length > 0
            ? `: ${column.getFilterValue()[0]}`
            : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 max-h-60 overflow-y-auto">
        <Input
          placeholder="Search college..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <DropdownMenuItem onClick={() => (column as any).setFilterValue([])} className="cursor-pointer">
          All
        </DropdownMenuItem>
        {filteredOptions.map((college: string) => (
          <DropdownMenuItem
            key={college}
            onClick={() => (column as any).setFilterValue([college])}
            className="cursor-pointer"
          >
            {college}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type TypeFilterProps = {
  column: any;
  table: any;
};

const TypeFilter: React.FC<TypeFilterProps> = ({ column, table }) => {
  const types: string[] = ["Team Manager", "Participant/Accompanist", "Participant", "Accompanist"];
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredTypes: string[] = types.filter((t: string) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          Type
          <ChevronDown className="ml-1 h-4 w-4" />
          {Array.isArray(column.getFilterValue()) && column.getFilterValue().length > 0
            ? `: ${column.getFilterValue()[0]}`
            : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 max-h-60 overflow-y-auto">
        <Input
          placeholder="Search type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <DropdownMenuItem onClick={() => (column as any).setFilterValue([])} className="cursor-pointer">
          All
        </DropdownMenuItem>
        {filteredTypes.map((t: string) => (
          <DropdownMenuItem key={t} onClick={() => (column as any).setFilterValue([t])} className="cursor-pointer">
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type EventFilterProps = {
  column: any;
  table: any;
};

const EventFilter: React.FC<EventFilterProps> = ({ column, table }) => {
  const allRows = table.getPreFilteredRowModel().rows;
  const allEvents = allRows.flatMap((row: any) =>
    (row.original.events as { eventName: string }[]).map((e) => e.eventName)
  ) as string[];
  const uniqueEvents = Array.from(new Set(allEvents)) as string[];
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredOptions: string[] = uniqueEvents.filter((event: string) =>
    event.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          Events
          <ChevronDown className="ml-1 h-4 w-4" />
          {Array.isArray(column.getFilterValue()) && column.getFilterValue().length > 0
            ? `: ${column.getFilterValue()[0]}`
            : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 max-h-60 overflow-y-auto">
        <Input
          placeholder="Search event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <DropdownMenuItem onClick={() => (column as any).setFilterValue([])} className="cursor-pointer">
          All
        </DropdownMenuItem>
        {filteredOptions.map((event: string) => (
          <DropdownMenuItem key={event} onClick={() => (column as any).setFilterValue([event])} className="cursor-pointer">
            {event}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
