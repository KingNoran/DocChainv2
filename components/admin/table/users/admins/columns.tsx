"use client";

import { ColumnDef } from "@tanstack/react-table"


export type Admin = {
    firstName: string,
    middleName: string,
    lastName: string,
    active: boolean
}

export const adminColumns: ColumnDef<Admin>[] = [
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
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => {
            const value = row.getValue("active") as boolean;
            if (value) {
                return <span className="text-primary italic">Online</span>;
            } else {
                return <span className="text-gray-400 italic">Offline</span>
            }
        }
    },
]
