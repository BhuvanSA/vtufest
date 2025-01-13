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

export type Data = {
    id: string;
    photo: string;
    name: string;
    usn: string;
    type: "Participant" | "Accompanist" | "Team Manager" | "";
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
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "photo",
                header: "Photo",
                cell: ({ row }) => (
                    <img
                        src={row.getValue("photo")}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                ),
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
                        "ALL",
                        "Participant",
                        "Accompanist",
                        "Team Manager",
                    ];
                    const currentFilter =
                        (column.getFilterValue() as string) ?? "ALL";
                    const currentIndex = filterCycle.indexOf(currentFilter);
                    const nextIndex = (currentIndex + 1) % filterCycle.length;
                    const nextFilter = filterCycle[nextIndex];

                    const handleFilterChange = () => {
                        if (nextFilter === "ALL") {
                            column.setFilterValue(undefined); // Clears the filter
                        } else {
                            column.setFilterValue(nextFilter);
                        }
                    };

                    return (
                        <Button variant="ghost" onClick={handleFilterChange}>
                            Type <ListFilterIcon className="p-1" />{" "}
                            {currentFilter !== "ALL"
                                ? `: ${currentFilter}`
                                : ""}
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue("type")}</div>
                ),
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "ALL") return true;
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
                                    onClick={() => handleRemove(data.id)}
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
        <div className="w-full px-5">
            <div className="flex items-center py-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
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
                    className="ml-auto hover:bg-[#00B140] hover:text-primary-foreground border hover:border-green-500"
                    onClick={handleExport}
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download current view as Excel
                </Button>
                <Button
                    variant="outline"
                    className="ml-2 hover:bg-red-500 hover:text-primary-foreground"
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
            <div className="rounded-md border">
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
                                        <TableCell key={cell.id}>
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
                                    className="h-24 text-center"
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
