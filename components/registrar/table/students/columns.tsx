"use client";

import { course } from "@/app/student/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { ColumnDef } from "@tanstack/react-table"


export type Student = {
    studentId: number,
    year: number,
    firstName: string,
    middleName?: string,
    lastName: string,
    semester: number,
    course: course,
    torReady: boolean
    isArchived: boolean;
}

export const studentColumns: ColumnDef<Student>[] = [
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
        accessorKey: "studentId",
        header: "ID",
    },
    {
        accessorKey: "lastName",
        header: "Last Name"
    },
    {
        accessorKey: "firstName",
        header: "First Name"
    },
    {
        accessorKey: "middleName",
        header: "Middle Name"
    },
    {
        accessorKey: "course",
        header: "Course"
    },
    {
        accessorKey: "year",
        header: "Year"
    },
    {
        accessorKey: "semester",
        header: "Semester"
    },
    {
        accessorKey: "torReady",
        header: "TOR",
        cell: ({ row }) => {
            const value = row.getValue("torReady") as boolean;
            if (value) {
                return <span className="text-primary font-bold">Ready</span>;
            } else {
                return <span className="text-gray-400 italic">Not Ready</span>;
            }
        }
    },
]
