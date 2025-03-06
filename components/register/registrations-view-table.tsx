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
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    ListFilterIcon,
} from "lucide-react";
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
import Link from "next/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

export type Data = {
    id: string;
    photo: string;
    name: string;
    collegeName: string;
    usn: string;
    email: string;
    phone: string;
    collegeRegion: string;
    collegeCode: string;
    designation?: string;
    aadharUrl: string;
    sslcUrl?: string;
    idcardUrl: string;
    gender: string;
    accomodation: boolean;
    dateOfBirth: string;
    type:
    | "Team Manager"
    | "Participant/Accompanist"
    | "Participant"
    | "Accompanist"
    | "";
    // Each event now may include a role to drive its colour:
    events: { eventName: string; role?: "Participant" | "Accompanist" }[];
    status: "Pending" | "Processing" | "Success" | "Failed";
};

export function DataTable({ data }: { data: Data[] }) {
    const router = useRouter();
    const [rows, setRows] = React.useState<Data[]>(data);


    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedField, setSelectedField] = React.useState<string | null>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging = true;
        startX = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
    };

    const handleMouseLeave = () => {
        isDragging = false;
    };

    const handleMouseUp = () => {
        isDragging = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2; // scroll-fast
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    
    
    const columns = React.useMemo<ColumnDef<Data>[]>(
        () => [
            {
                accessorKey: "slno",
                header: "SL No",
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: "photo",
                header: "Photo",
                cell: ({ row }) => {
                    const photoUrl = row.getValue("photo");
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
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
                        <ArrowUpDown className="p-1" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("name")}</div>
                ),
            },
            {
                accessorKey: "usn",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        USN
                        <ArrowUpDown className="p-1" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="uppercase">{row.getValue("usn")}</div>
                ),
            },
            // Within your columns useMemo, add the following column:
            {
                accessorKey: "collegeName",
                header: ({ column, table }) => {
                    // Collect distinct college names from the pre-filtered rows
                    const allRows = table.getPreFilteredRowModel().rows;
                    const allColleges = allRows
                        .map((row) => row.original.collegeName)
                        .sort((a, b) => a.localeCompare(b));
                    const uniqueColleges = Array.from(new Set(allColleges));
                    const filterCycle = ["ALL", ...uniqueColleges];
                    const currentFilter =
                        (column.getFilterValue() as string) ?? "ALL";
                    const currentIndex = filterCycle.indexOf(currentFilter);
                    const nextIndex = (currentIndex + 1) % filterCycle.length;
                    const nextFilter = filterCycle[nextIndex];

                    const handleFilterChange = () => {
                        if (nextFilter === "ALL") {
                            column.setFilterValue(undefined);
                        } else {
                            column.setFilterValue(nextFilter);
                        }
                    };

                    return (
                        <Button variant="ghost" onClick={handleFilterChange}>
                            College Name <ListFilterIcon className="p-1" />{" "}
                            {currentFilter !== "ALL"
                                ? `: ${currentFilter}`
                                : ""}
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">
                        {row.getValue("collegeName")}
                    </div>
                ),
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "ALL") return true;
                    const collegeName = row.getValue(columnId);
                    return collegeName === filterValue;
                },
            },
            {
                accessorKey: "collegeRegion",
                header: ({ column }) => {
                    const filterCycle = ["ALL", "Bengaluru Region (1)", "Belgavi Region (2)", "Kalaburgi Region (3)", "Mysuru Region (4)"]; // Replace with actual regions
                    const currentFilter =
                        (column.getFilterValue() as string) ?? "ALL";
                    const currentIndex = filterCycle.indexOf(currentFilter);
                    const nextIndex = (currentIndex + 1) % filterCycle.length;
                    const nextFilter = filterCycle[nextIndex];

                    const handleFilterChange = () => {
                        if (nextFilter === "ALL") {
                            column.setFilterValue(undefined);
                        } else {
                            column.setFilterValue(nextFilter);
                        }
                    };

                    return (
                        <Button variant="ghost" onClick={handleFilterChange}>
                            College Region <ListFilterIcon className="p-1" />{" "}
                            {currentFilter !== "ALL" ? `: ${currentFilter}` : ""}
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">
                        {row.getValue("collegeRegion")}
                    </div>
                ),
            },
            {
                accessorKey: "collegeCode",
                header: "College Code",
                cell: ({ row }) => row.getValue("collegeCode"),
            },
            {
                accessorKey: "type",
                header: ({ column }) => {
                    const filterCycle = [
                        "",
                        "Team Manager",
                        "Participant/Accompanist",
                        "Participant",
                        "Accompanist",
                    ];
                    const currentFilter =
                        (column.getFilterValue() as string) ?? "";
                    const currentIndex = filterCycle.indexOf(currentFilter);
                    const nextIndex = (currentIndex + 1) % filterCycle.length;
                    const nextFilter = filterCycle[nextIndex];

                    const handleFilterChange = () => {
                        if (nextFilter === "") {
                            column.setFilterValue(undefined); // Clears the filter
                        } else {
                            column.setFilterValue(nextFilter);
                        }
                    };

                    return (
                        <Button variant="ghost" onClick={handleFilterChange}>
                            Type <ListFilterIcon className="p-1" />{" "}
                            {currentFilter !== "" ? `: ${currentFilter}` : ""}
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("type")}</div>
                ),
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "") return true;

                    const type = row.getValue(columnId);
                    return type === filterValue;
                },
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => row.getValue("email"),
            },
            {
                accessorKey: "phone",
                header: "Phone",
                cell: ({ row }) => row.getValue("phone"),
            },
            {
                accessorKey: "accomodation",
                header: "Accomodation",
                cell: ({ row }) => row.getValue("accomodation") ? "Yes" : "No",
            },
            {
                accessorKey: "gender",
                header: "Gender",
                cell: ({ row }) => (<div className="capitalize">{row.getValue("gender")}</div>),
            },
            {
                accessorKey: "dateOfBirth",
                header: "Date Of Birth",
                cell: ({ row }) => row.getValue("dateOfBirth"),
            },
            {
                accessorKey: "idcardUrl",
                header: "ID Card",
                cell: ({ row }) => {
                    const imageKey = row.getValue("idcardUrl");
                    const imageUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${imageKey}`;
                    return (
                        <Link href={imageUrl} target="_blank">
                            <Button>
                                IDCARD
                            </Button>
                        </Link>
                    );
                }
            },
            {
                accessorKey: "addharUrl",
                header: "Aadhar Card",
                cell: ({ row }) => {
                    const imageKey = row.getValue("aadharUrl");
                    const imageUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${imageKey}`;
                    return (
                        <Link href={imageUrl} target="_blank">
                            <Button>
                                AADHAR
                            </Button>
                        </Link>
                    );
                }
            },
            {
                accessorKey: "sslcUrl",
                header: "SSLC Certificate",
                cell: ({ row }) => {
                    const imageKey = row.getValue("sslcUrl");
                    const type = row.getValue('type');
                    const imageUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${imageKey}`;
                    return type === "Team Manager" ? (
                        "N/A"
                    ) : (
                        <Link href={imageUrl} target="_blank">
                            <Button>
                                SSLC
                            </Button>
                        </Link>
                    );
                },
            },
            {
                accessorKey: "designation",
                header: "Designation",
                cell: ({ row }) => row.getValue("designation") || "N/A",
            },
            {
                accessorKey: "events",
                header: ({ column, table }) => {
                    const allRows = table.getPreFilteredRowModel().rows;
                    const allEvents = allRows.flatMap((row) =>
                        row.original.events.map((e) => e.eventName)
                    );
                    const uniqueEvents = Array.from(new Set(allEvents));
                    const filterCycle = ["ALL", ...uniqueEvents];
                    const currentFilter =
                        (column.getFilterValue() as string) ?? "ALL";
                    const currentIndex = filterCycle.indexOf(currentFilter);
                    const nextIndex = (currentIndex + 1) % filterCycle.length;
                    const nextFilter = filterCycle[nextIndex];

                    const handleFilterChange = () => {
                        if (nextFilter === "ALL") {
                            column.setFilterValue(undefined);
                        } else {
                            column.setFilterValue(nextFilter);
                        }
                    };

                    return (
                        <Button variant="ghost" onClick={handleFilterChange}>
                            Events <ListFilterIcon className="p-1" />{" "}
                            {currentFilter !== "ALL"
                                ? `: ${currentFilter}`
                                : ""}
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const events = row.getValue("events") as {
                        eventName: string;
                        role: string;
                    }[];
                    const type = row.getValue("type");
                    return (
                        <div className="capitalize">
                            {type !== "Participant/Accompanist" ? (
                                events.map((e) => e.eventName).join(", ")
                            ) : (
                                <>
                                    <div className="mb-3  text-black">
                                        <span className="font-bold">
                                            Participant :
                                        </span>{" "}
                                        {events
                                            .filter(
                                                (value) =>
                                                    value.role === "Participant"
                                            )
                                            .map((e) => e.eventName)
                                            .join(", ")}
                                    </div>

                                    <div className="text-black">
                                        <span className="font-bold">
                                            Accompanist :{" "}
                                        </span>
                                        {events
                                            .filter(
                                                (value) =>
                                                    value.role === "Accompanist"
                                            )
                                            .map((e) => e.eventName)
                                            .join(", ")}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                },
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "ALL") return true;
                    const events = row.getValue(columnId) as {
                        eventName: string;
                    }[];
                    return events.some((e) => e.eventName === filterValue);
                },
            },

        ],
        []
    );

    const table = useReactTable({
        data: rows,
        columns,
        initialState: { pagination: { pageSize: 10000 } }, // sets max rows per page to 10
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

    // Use the final row model to get the filtered + sorted data
    const handleExportToPDF = () => {
        // Pull final rows from the table’s computed row model:
        const filteredSortedRows = table.getRowModel().rows;

        // Prepare data for PDF
        const exportData = filteredSortedRows.map((row) => [
            row.getValue("name"),
            row.getValue("usn"),
            row.getValue("collegeName"),
            row.getValue("type"),
            row.getValue("collegeCode"),
            row.getValue("collegeRegion"),
            row.getValue("email"),
            row.getValue("phone"),
            row.getValue("accomodation") ? "Yes" : "No",
            row.getValue("dateOfBirth"),
            row.getValue("gender"),
            row.getValue("designation") || "N/A",
            (row.getValue("events") as { eventName: string }[])
                .map((event) => event.eventName)
                .join(", "),

        ]);

        // Column headers for PDF
        const headers = [
            ["Name", "USN", "College Name", "Type", "College Code", "College Region", "Email", "Phone", "Accomodation", "Date Of Birth", "Gender",
                "Designation", "Events"],
        ];

        // Initialize jsPDF
        const doc = new jsPDF();

        // Load the PNG template
        const img = document.createElement("img");
        img.src = "/images/gatformat.jpg"; // Replace with the actual template path

        img.onload = () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Add the template as a background
            doc.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);

            // Add table
            autoTable(doc, {
                head: headers,
                body: exportData,
                startY: 80, // Adjust this to fit within the template
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [26, 188, 156] }, // #1abc9c in RGB
            });

            // Add signatures at the bottom
            doc.text("Principal's Signature", 14, pageHeight - 20);
            doc.text(
                "Coordinator's Signature",
                pageWidth - 80,
                pageHeight - 20
            );

            // Save the PDF
            doc.save("registrants.pdf");
        };
    };

    const handleExportToExcel = () => {
        // Pull final rows from the table’s computed row model:
        const filteredSortedRows = table.getRowModel().rows;

        // Prepare data for Excel
        const exportData = filteredSortedRows.map((row) => ({
            Name: row.getValue("name"),
            USN: row.getValue("usn"),
            "College Name": row.getValue("collegeName"),
            Type: row.getValue("type"),
            "College Code": row.getValue("collegeCode"),
            "College Region": row.getValue("collegeRegion"),
            Email: row.getValue("email"),
            Phone: row.getValue("phone"),
            Accomodation: row.getValue("accomodation") ? "Yes" : "No",
            "Date Of Birth": row.getValue("dateOfBirth"),
            Gender: row.getValue("gender"),
            Designation: row.getValue("designation") || "N/A",
            Events: (row.getValue("events") as { eventName: string }[])
                .map((event) => event.eventName)
                .join(", "),
        }));

        // Create a new workbook and worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");

        // Write the workbook to a file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "registrants.xlsx");
    };
    return (
        <div className="w-full px-5 rounded-xl my-12">
            <div className="flex items-center py-4 flex-wrap gap-3 w-full">
            <div >
            <Select onValueChange={(value) => setSelectedField(value)}>
                <SelectTrigger className="text-black">
                    <SelectValue placeholder="Select the Filter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Columns</SelectLabel>
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <SelectItem key={column.id} value={column.id}>
                                    {column.id}
                                </SelectItem>
                            ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            </div>
        
                <div className="relative max-w-sm ">
                    <Search className="absolute left-2 top-3 h-4 w-5 text-muted-foreground " />
                    <Input
                        placeholder="Search "
                        value={
                            (table
                                .getColumn(selectedField ?? "name")
                                ?.getFilterValue() as string) ?? "".toUpperCase()
                        }
                        onChange={(event) =>
                            table
                                .getColumn(selectedField ?? "name").toUp
                                ?.setFilterValue(event.target.value)
                        }
                        className="pl-10 w-[26rem] text-black"
                    />
                </div>
                <Button
                    variant="outline"
                    className="ml-auto bg-[#00B140] text-white hover:scale-105 hover:bg-[#00B140] hover:text-white "
                    onClick={handleExportToPDF}
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download current view as PDF
                </Button>
                <Button
                    variant="outline"
                    className="ml-2 bg-[#00B140] text-white hover:scale-105 hover:bg-[#00B140] hover:text-white "
                    onClick={handleExportToExcel}
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download current view as Excel
                </Button>
                <Button
                    variant="outline"
                    className="ml-auto bg-[#00B140] text-white hover:scale-105 hover:bg-[#00B140] hover:text-white "
                        onClick={()=> router.push("/registrationTeamDashboard/collegeDetails")}
                >
                    Go To College List
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
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div >
            <div
            className="rounded-md border overflow-x-auto min-h-[18rem]"
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove} 
            className="rounded-md border overflow-auto  min-h-[18rem]">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef
                                                    .header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                        {/* ${row.getValue('type') === 'Participant' ? 'text-blue-500' : row.getValue('type') === 'Accompanist'? 'text-teal-600': row.getValue('type')=== 'Team Manager'? 'text-violet-800':'text-rose-700'}` */}
                    </TableHeader>
                    <TableBody className="text-primary ">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className={`hover:bg-blue-50 text-black `}
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                        // onClick={() => {
                                        //     if (
                                        //         cell.column.id === "usn" ||
                                        //         cell.column.id === "name" ||
                                        //         cell.column.id === "photo"
                                        //     ) {
                                        //         const cellValue =
                                        //             row.getValue("usn");
                                        //         router.push(
                                        //             `/register/getregister/${cellValue}`
                                        //         );
                                        //     }
                                        // }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="min-h-[18rem] text-3xl    text-center "
                                >
                                    No Registrations Are Done Yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
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
        </div >
    );
}
