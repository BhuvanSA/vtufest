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
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
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
  accomodation: boolean;
  collegeCode: string;
  photo: string;
  name: string;
  collegeName: string;
  usn: string;
  phone: string;
  email: string;
  blood: string; // using this as DOB as per your code
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

//////////////////////////////
// Accomodation Column Filter
//////////////////////////////

type AccomodationFilterProps = {
  column: any;
  table: any;
};

const AccomodationFilter: React.FC<AccomodationFilterProps> = ({ column, table }) => {
  const options = ["Yes", "No"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          Accomodation
          <ChevronDown className="ml-1 h-4 w-4" />
          {column.getFilterValue() ? `: ${column.getFilterValue()}` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2">
        <DropdownMenuItem onClick={() => column.setFilterValue(undefined)} className="cursor-pointer">
          All
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => column.setFilterValue(option)}
            className="cursor-pointer"
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
          {column.getFilterValue() ? `: ${column.getFilterValue() as string}` : ""}
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
          {column.getFilterValue() ? `: ${column.getFilterValue() as string}` : ""}
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
// Modified Events Filter (for registrants view)
//////////////////////////

type EventFilterProps = {
  column: any;
  table: any;
};

const EventFilter: React.FC<EventFilterProps> = ({ column, table }) => {
  // Collect all rows from the pre-filtered model.
  const allRows = table.getPreFilteredRowModel().rows;
  // Create a map: event name -> set of college names (to count distinct colleges)
  const eventMap = new Map<string, Set<string>>();
  allRows.forEach((row: any) => {
    const events = row.original.events as { eventName: string }[];
    const collegeName = row.original.collegeName;
    events.forEach(e => {
      if (e.eventName) {
        if (!eventMap.has(e.eventName)) {
          eventMap.set(e.eventName, new Set());
        }
        eventMap.get(e.eventName)?.add(collegeName);
      }
    });
  });

  // Build an array of options: each option has the event and the count of colleges.
  const options = Array.from(eventMap.entries()).map(([event, collegeSet]) => ({
    event,
    count: collegeSet.size,
  }));

  // Search filtering inside the dropdown
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredOptions = options.filter(opt =>
    opt.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          Filter Events
          <ChevronDown className="ml-1 h-4 w-4" />
          {column.getFilterValue() ? `: ${column.getFilterValue() as string}` : ""}
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
        {filteredOptions
          .sort((a, b) => a.event.localeCompare(b.event))
          .map(opt => (
            <DropdownMenuItem
              key={opt.event}
              onClick={() => column.setFilterValue(opt.event)}
              className="cursor-pointer"
            >
              {opt.event} ({opt.count})
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

//////////////////////////
// College Events Filter (Dynamic)
//////////////////////////

type CollegeEventFilterProps = {
  column: any;
  table: any;
  eventsList: string[];
};

const CollegeEventFilter: React.FC<CollegeEventFilterProps> = ({ column, table, eventsList }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredOptions = eventsList.filter((event) =>
    event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
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
//      DataTable       //
//////////////////////////

export function DataTable({ data }: { data: Data[] }) {
  const router = useRouter();
  const [rows, setRows] = React.useState<Data[]>(data);

  // New view state: "registrants" (default) or "colleges"
  const [view, setView] = React.useState<"registrants" | "colleges">("registrants");

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
          <div className="capitalize text-black">{row.getValue("name") as string}</div>
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
          <div className="uppercase text-black">{row.getValue("usn") as string}</div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <div className="text-black">{row.getValue("phone") as string}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="text-black">{row.getValue("email") as string}</div>
        ),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => (
          <div className="text-black">{row.getValue("gender") as string}</div>
        ),
      },
      {
        accessorKey: "blood",
        header: "DOB",
        cell: ({ row }) => (
          <div className="text-black">{row.getValue("blood") as string}</div>
        ),
      },
      {
        // New Accomodation Column
        accessorKey: "accomodation",
        header: ({ column, table }) => <AccomodationFilter column={column} table={table} />,
        cell: ({ row }) => (
          <div className="text-black">{row.getValue("accomodation") ? "Yes" : "No"}</div>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const value = row.getValue(columnId);
          const display = value ? "Yes" : "No";
          return display === filterValue;
        },
      },
      {
        accessorKey: "collegeName",
        header: ({ column, table }) => (
          <CollegeNameFilter column={column} table={table} />
        ),
        cell: ({ row }) => (
          <div className="capitalize text-black">
            {row.getValue("collegeName") as string}
          </div>
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
          <div className="capitalize text-black">{row.getValue("type") as string}</div>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const type = row.getValue(columnId) as string;
          return type === filterValue;
        },
      },
      {
        accessorKey: "events",
        header: ({ column, table }) => {
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Events <ArrowUpDown className="p-1" />
              </Button>
              <EventFilter column={column} table={table} />
            </div>
          );
        },
        sortingFn: (rowA, rowB, columnId) => {
          const eventsA = rowA.getValue(columnId) as { eventName: string }[];
          const eventsB = rowB.getValue(columnId) as { eventName: string }[];
          // Sort each row’s events array alphabetically then join to compare as strings.
          const aStr = eventsA.map(e => e.eventName).sort().join(", ");
          const bStr = eventsB.map(e => e.eventName).sort().join(", ");
          return aStr.localeCompare(bStr);
        },
        cell: ({ row }) => {
          const events = row.getValue("events") as { eventName: string; role?: string }[];
          const type = row.getValue("type") as string;
          return (
            <div className="capitalize text-black">
              {type !== "Participant/Accompanist" ? (
                events.map((e) => e.eventName).join(", ")
              ) : (
                <>
                  <div className="mb-1">
                    <span className="font-bold">Participant: </span>
                    {events
                      .filter((v) => v.role === "Participant")
                      .map((e) => e.eventName)
                      .join(", ")}
                  </div>
                  <div>
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
          return events.some(e => e.eventName === filterValue);
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
                <DropdownMenuLabel className="text-black text-l">
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const totalRegistrants = table.getFilteredRowModel().rows.length;

  const clearAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    table.resetColumnFilters();
    table.resetSorting();
  };

  // Existing PDF export (unchanged)
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

  // New: Export Participants Excel
  const handleExportParticipantsExcel = () => {
    const filteredRows = table.getRowModel().rows;
    // Group participants (non–Team Manager) by college
    const collegeData: Record<string, Data[]> = {};
    filteredRows.forEach((row) => {
      if (row.original.type !== "Team Manager") {
        const collegeName = row.original.collegeName;
        if (!collegeData[collegeName]) {
          collegeData[collegeName] = [];
        }
        collegeData[collegeName].push(row.original);
      }
    });

    const excelData: any[][] = [];
    Object.keys(collegeData).forEach((collegeName) => {
      const participants = collegeData[collegeName];
      // College header row
      excelData.push([`College: ${collegeName}`]);
      // Header row for participants data:
      excelData.push([
        "SL No",
        "Student Code", // blank column for later insertion
        "Name",
        "USN",
        "Phone",
        "Gender",
        "DOB",
        "Email",
        "Accomodation",
        "Events Participating In",
        "Events Accompanying In",
      ]);
      participants.forEach((participant, index) => {
        let eventsParticipating = "";
        let eventsAccompanying = "";
        if (participant.type === "Participant/Accompanist") {
          eventsParticipating = participant.events
            .filter((e) => e.role === "Participant")
            .map((e) => e.eventName)
            .join(", ");
          eventsAccompanying = participant.events
            .filter((e) => e.role === "Accompanist")
            .map((e) => e.eventName)
            .join(", ");
        } else if (participant.type === "Participant") {
          eventsParticipating = Array.isArray(participant.events)
            ? participant.events.map((e) => e.eventName).join(", ")
            : "";
        } else if (participant.type === "Accompanist") {
          eventsAccompanying = Array.isArray(participant.events)
            ? participant.events.map((e) => e.eventName).join(", ")
            : "";
        } else {
          eventsParticipating = Array.isArray(participant.events)
            ? participant.events.map((e) => e.eventName).join(", ")
            : "";
        }
        excelData.push([
          index + 1,
          "", // Blank student code column
          participant.name || "",
          participant.usn || "",
          participant.phone || "",
          participant.gender || "",
          participant.blood || "",
          participant.email || "",
          participant.accomodation ? "Yes" : "No",
          eventsParticipating,
          eventsAccompanying,
        ]);
      });
      excelData.push([]); // Blank row for separation
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws["!cols"] = [
      { wch: 8 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "participants.xlsx");
  };

  // New: Export Events Excel
  const handleExportEventsExcel = () => {
    const filteredRows = table.getRowModel().rows;
    // Group events by college – each registrant’s events are added separately
    const collegeEventsData: Record<string, any[]> = {};
    filteredRows.forEach((row) => {
      const collegeName = row.original.collegeName;
      if (Array.isArray(row.original.events) && row.original.events.length > 0) {
        if (!collegeEventsData[collegeName]) {
          collegeEventsData[collegeName] = [];
        }
        row.original.events.forEach((event: { eventName: string; role?: string }) => {
          collegeEventsData[collegeName].push({
            studentName: row.original.name,
            usn: row.original.usn,
            role: event.role || "",
            eventName: event.eventName,
          });
        });
      }
    });

    const excelData: any[][] = [];
    Object.keys(collegeEventsData).forEach((collegeName) => {
      const eventsArr = collegeEventsData[collegeName];
      // College header row
      excelData.push([`College: ${collegeName}`]);
      // Header row for events data:
      excelData.push([
        "SL No",
        "Student Name",
        "USN",
        "Role",
        "Event Name",
      ]);
      eventsArr.forEach((entry, index) => {
        excelData.push([
          index + 1,
          entry.studentName,
          entry.usn,
          entry.role,
          entry.eventName,
        ]);
      });
      excelData.push([]);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws["!cols"] = [
      { wch: 8 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Events");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "events.xlsx");
  };

  // COLLEGES VIEW: Aggregate colleges from rows
  const collegesData = React.useMemo(() => {
    const map = new Map<
      string,
      {
        collegeName: string;
        collegeCode: string;
        accomodation: boolean;
        events: Set<string>;
        registrants: number;
        maleCount: number;
        femaleCount: number;
      }
    >();
    rows.forEach((row) => {
      const collegeName = row.collegeName;
      if (!map.has(collegeName)) {
        map.set(collegeName, {
          collegeName,
          collegeCode: row.collegeCode,
          accomodation: row.accomodation,
          events: new Set<string>(),
          registrants: 0,
          maleCount: 0,
          femaleCount: 0,
        });
      }
      const college = map.get(collegeName)!;
      college.registrants += 1;
      if (row.gender.toLowerCase() === "male") {
        college.maleCount += 1;
      } else if (row.gender.toLowerCase() === "female") {
        college.femaleCount += 1;
      }
      row.events.forEach((e) => {
        if (e.eventName) {
          college.events.add(e.eventName);
        }
      });
    });
    return Array.from(map.values()).map((college) => ({
      ...college,
      events: Array.from(college.events),
    }));
  }, [rows]);

  // Compute dynamic events list from collegesData
  const allCollegeEvents = React.useMemo(() => {
    const eventSet = new Set<string>();
    collegesData.forEach((college) => {
      college.events.forEach((e) => eventSet.add(e));
    });
    return Array.from(eventSet).sort();
  }, [collegesData]);

  const [collegeSorting, setCollegeSorting] = React.useState<SortingState>([]);
  const [collegeColumnFilters, setCollegeColumnFilters] = React.useState<ColumnFiltersState>([]);
  const collegeColumns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "collegeName",
        header: "College Name",
        sortingFn: (a, b) => {
          const aVal = a.getValue("collegeName") as string;
          const bVal = b.getValue("collegeName") as string;
          return aVal.localeCompare(bVal);
        },
      },
      {
        accessorKey: "collegeCode",
        header: "College Code",
        sortingFn: (a, b) => {
          const aVal = a.getValue("collegeCode") as string;
          const bVal = b.getValue("collegeCode") as string;
          return aVal.localeCompare(bVal);
        },
      },
      {
        accessorKey: "accomodation",
        header: "Accommodation",
        cell: ({ row }) => (row.getValue("accomodation") ? "Yes" : "No"),
      },
      {
        accessorKey: "events",
        header: ({ column, table }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Events <ArrowUpDown className="p-1" />
            </Button>
            <CollegeEventFilter column={column} table={table} eventsList={allCollegeEvents} />
          </div>
        ),
        sortingFn: (a, b, columnId) => {
          const aValue = (a.getValue(columnId) as string[]).join(", ");
          const bValue = (b.getValue(columnId) as string[]).join(", ");
          return aValue.localeCompare(bValue);
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const eventsArray = row.getValue(columnId) as string[];
          return eventsArray.includes(filterValue);
        },
        cell: ({ row }) => (row.getValue("events") as string[]).join(", "),
      },
      {
        accessorKey: "numEvents",
        header: "No. of Events",
        cell: ({ row }) => (row.original.events as string[]).length,
        enableSorting: true,
      },
      {
        accessorKey: "registrants",
        header: "No. of Registrants",
        cell: ({ row }) => row.original.registrants,
        enableSorting: true,
      },
      {
        accessorKey: "maleCount",
        header: "Male Participants",
        cell: ({ row }) => row.original.maleCount,
        enableSorting: true,
      },
      {
        accessorKey: "femaleCount",
        header: "Female Participants",
        cell: ({ row }) => row.original.femaleCount,
        enableSorting: true,
      },
    ],
    [allCollegeEvents]
  );

  const collegeTable = useReactTable({
    data: collegesData,
    columns: collegeColumns,
    initialState: { pagination: { pageSize: 10 } },
    onSortingChange: setCollegeSorting,
    onColumnFiltersChange: setCollegeColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: collegeSorting,
      columnFilters: collegeColumnFilters,
    },
  });

  return (
    <div className="w-full px-5 rounded-xl my-12 text-black">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center gap-3 py-4">
        {view === "registrants" ? (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-3 h-4 w-5 text-black" />
              <Input
                placeholder="Search name..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="pl-10 w-[26rem] text-black"
              />
            </div>
            <Button variant="outline" onClick={clearAllFilters} className="ml-2 text-black">
              Clear Filters
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
              className="ml-auto bg-primary text-white hover:scale-105 hover:text-white"
              onClick={handleExportParticipantsExcel}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Participants Excel
            </Button>
            <Button
              variant="outline"
              className="ml-auto bg-secondary text-white hover:scale-105 hover:text-white"
              onClick={handleExportEventsExcel}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Events Excel
            </Button>
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:scale-105 hover:bg-red-500 hover:text-primary-foreground"
              onClick={() => handleDeleteSelected()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </>
        ) : (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-3 h-4 w-5 text-black" />
              <Input
                placeholder="Search college name..."
                value={
                  (collegeTable.getColumn("collegeName")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  collegeTable.getColumn("collegeName")?.setFilterValue(e.target.value)
                }
                className="pl-10 w-[26rem] text-black"
              />
            </div>
            <Button
              variant="outline"
              className="ml-auto bg-primary text-white hover:scale-105 hover:text-white"
              onClick={() => {
                // You can add a separate download for colleges if needed
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Colleges as Excel
            </Button>
          </>
        )}
        <Button
          variant="outline"
          className="ml-2 text-black"
          onClick={() => setView(view === "registrants" ? "colleges" : "registrants")}
        >
          {view === "registrants" ? "Go to Colleges List" : "Back to Registrants"}
        </Button>
        {view === "registrants" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2 text-black">
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
                    className="capitalize text-black"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {view === "registrants" ? (
        <>
          <div className="mb-2 text-sm text-black">
            Total Registrants: {totalRegistrants}
          </div>
          <div className="rounded-md border overflow-auto min-h-[18rem] shadow-lg">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-black">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="text-black">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className="hover:bg-blue-50"
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
          <div className="flex flex-col md:flex-row items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border rounded p-1 text-black"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={1000}>1000</option>
                <option value={5000}>5000</option>
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
        </>
      ) : (
        <>
          <div className="mb-2 text-sm text-black">
            Total Colleges: {collegeTable.getFilteredRowModel().rows.length}
          </div>
          <div className="rounded-md border overflow-auto min-h-[18rem] shadow-lg">
            <Table>
              <TableHeader>
                {collegeTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-black">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="text-black">
                {collegeTable.getRowModel().rows?.length ? (
                  collegeTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={collegeColumns.length} className="min-h-[18rem] text-3xl text-center">
                      No Colleges Found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={collegeTable.getState().pagination.pageSize}
                onChange={(e) => collegeTable.setPageSize(Number(e.target.value))}
                className="border rounded p-1 text-black"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => collegeTable.previousPage()}
                disabled={!collegeTable.getCanPreviousPage()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span>
                Page {collegeTable.getState().pagination.pageIndex + 1} of {collegeTable.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => collegeTable.nextPage()}
                disabled={!collegeTable.getCanNextPage()}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
