"use client";

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

export type Data = {
    id: string;
    photo: string;
    name: string;
    usn: string;
    type: "Participant" | "Team Manager" | "Accompanist";
    events: string[];
    status: "pending" | "processing" | "success" | "failed";
};

interface DataTableProps {
    data: Data[];
    onUpdate: (id: string) => void;
    onRemove: (id: string) => void;
}

export function DataTable({ data, onUpdate, onRemove }: DataTableProps) {
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
                        "Team Manager",
                        "Accompanist",
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
                    const allEvents = allRows.flatMap(
                        (row) => row.original.events
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
                    const eventList = row.getValue("events") as string[];
                    return (
                        <div className="capitalize">{eventList.join(", ")}</div>
                    );
                },
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "ALL") return true;
                    const events: string[] = row.getValue(columnId);
                    return events.includes(filterValue);
                },
            },
            {
                accessorKey: "status",
                header: ({ column }) => {
                    const filterCycle = [
                        "ALL",
                        "pending",
                        "processing",
                        "success",
                        "failed",
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
                    return status === filterValue;
                },
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    const data = row.original;

                    const handleUpdateClick = () => {
                        onUpdate(data.id);
                    };

                    const handleRemoveClick = () => {
                        onRemove(data.id);
                    };

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={handleUpdateClick}>
                                    Update
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleRemoveClick}>
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [onUpdate, onRemove]
    );

    const table = useReactTable({
        data,
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

    return (
        <div className="w-full px-5">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search name..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
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
