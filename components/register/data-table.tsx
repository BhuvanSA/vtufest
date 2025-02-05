"use client";

import { Columns, FileDown, Pencil, Search, Trash2 } from "lucide-react";
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

export type Data = {
    id: string;
    photo: string;
    name: string;
    usn: string;
    type: "Participant" | "Accompanist" | "Team Manager" | "Participant/Accompanist" | "";
    events: { eventName: string }[];
    status: "Pending" | "Processing" | "Success" | "Failed";
};

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
                    credentials: "include", // Ensure cookies are included
                });

                const data = await response.json();
                toast.success(data.message);
                //                table.resetData(updatedRows)
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
                // If called with an argument, use that
                registrantIds = providedRegistrants;
            } else {
                // Otherwise, use selected rows from the table
                const selectedRows = table.getSelectedRowModel().rows;
                registrantIds = Array.from(
                    new Set(
                        selectedRows.map((r) => r.original.id.split("#")[0])
                    )
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

                // Remove deleted rows from UI state
                setRows((prev) =>
                    prev.filter(
                        (row) => !registrantIds.includes(row.id.split("#")[0])
                    )
                );
            } catch (error) {
                toast.error("Failed to delete registrants");
                console.error(error);
            }
        },
        [rows]
    );

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns = React.useMemo<ColumnDef<Data>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row, table }) => {
                    const rowRegistrantId = row.original.id.split("#")[0];

                    const handleCheck = (checked: boolean) => {
                        // Find all rows with the same base registrant ID
                        const matchingRows = table
                            .getRowModel()
                            .rows.filter(
                                (r) =>
                                    r.original.id.split("#")[0] ===
                                    rowRegistrantId
                            )
                            .map((r) => r.id);

                        // Update selection state for all matching rows
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
                            className="rounded-full"
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
            {
                accessorKey: "type",
                header: ({ column }) => {
                    const filterCycle = [
                        "",
                        "Team Manager",
                        "Participant, Accompanist",
                        
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
                            {currentFilter !== ""
                                ? `: ${currentFilter}`
                                : ""}
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("type")}</div>
                ),
                filterFn: (row, columnId, filterValue) => {
                    if(!filterValue || filterValue==='') return true;
                    if (!filterValue || filterValue === "Total") {
                        const type = row.getValue('type');
                        if(type === 'Participant, Accompanist' || type==='Team Manager'){
                            return true;
                        }
                    }
                    const type = row.getValue(columnId);
                    return type === filterValue;
                },
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
                    }[];
                    return (
                        <div className="capitalize">
                            {events.map((e) => e.eventName).join(", ")}
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
            {
                accessorKey: "status",
                header: ({ column }) => {
                    const filterCycle = [
                        "ALL",
                        "Pending",
                        "Processing",
                        "Approved",
                        "Rejected",
                    ];
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
                        <Button
                            variant="ghost"
                            className="capitalize"
                            onClick={handleFilterChange}
                        >
                            Status <ListFilterIcon className="p-1" />{" "}
                            {currentFilter !== "ALL"
                                ? `: ${currentFilter}`
                                : ""}
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("status")}</div>
                ),
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "ALL") return true;
                    const status = row.getValue(columnId);
                    return status == filterValue;
                },
            },
            {
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
                                <DropdownMenuItem
                                    onClick={() => handleUpdate(data.id)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Update
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleDeleteSelected([
                                            data.id.split("#")[0],
                                        ])
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
    const handleExport = () => {
        // Pull final rows from the table’s computed row model:
        const filteredSortedRows = table
            .getRowModel()
            .rows.map((row) => row.original);

        // Prepare data for Excel
        const exportData = filteredSortedRows.map((row) => ({
            Name: row.name,
            USN: row.usn,
            Type: row.type,
            Events: row.events.map((event) => event.eventName).join(", "),
            Status: row.status,
        }));

        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");

        // Generate buffer
        const wbout = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

        // Create a Blob and trigger download
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        saveAs(blob, "registrants.xlsx");
    };

    return (
        <div className="w-full px-5 bg-white rounded-xl bg-opacity-90 h-[70rem]">
            <div className="flex items-center py-4 ">
                <div className="relative max-w-sm " >
                    <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground " />
                    <Input
                        placeholder="Search name..."
                        value={
                            (table
                                .getColumn("name")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("name")
                                ?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                </div>
                <Button
                    variant="outline"
                    className="ml-auto bg-[#00B140] text-white hover:scale-105 hover:bg-[#00B140] hover:text-white "
                    onClick={handleExport}
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download current view as Excel
                </Button>
                <Button
                    variant="outline"
                    className="ml-2 bg-red-500 text-white hover:scale-105 hover:bg-red-500 hover:text-primary-foreground"
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
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border min-h-[15rem]">
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
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} onClick={() => {
                                            if (cell.column.id === 'usn') {
                                                const cellValue = row.getValue('usn');
                                                router.push(`/register/getregister/${cellValue}`);
                                            }

                                        }}>
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
                                    className="h-[50rem] text-3xl    text-center "
                                >
                                    No results.
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
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
