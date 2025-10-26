"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getStudentData } from "@/lib/studentGet";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export type Request = {
    studentId: number;
  id: number;
  requestContent: Record<string, string>;
  requesterId: string;
  requesterName: string;        // ✅ New
  validatorId: string | null;
  validatorName: string | null; // ✅ New
  activity: string;
  status: string;
  createdAt: string;
  validatedAt: string | null;
  isArchived: boolean;
};

function ViewStudentButton({ requesterId }: { requesterId: string }) {
  const [studentId, setStudentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getStudent = async ()=>{
        const studentId = await getStudentData(requesterId);
        setStudentId(String(studentId.studentId));
    }
    getStudent()
  }, [requesterId]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => studentId && router.push(`/registrar/requests/${studentId}`)}
      disabled={!studentId}
    >
      Click to view
    </Button>
  );
}

function toTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")  // split camelCase / PascalCase
    .replace(/^./, (char) => char.toUpperCase()) // capitalize first letter
    .trim();
}

export const requestColumns: ColumnDef<Request>[] = [
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
        accessorKey: "id",
        header: "ID"
    },
    {
        accessorKey: "requesterId",
        header: "UUID"
    },
    {
        accessorKey: "requestContent",
        header: "Content",
        cell: ({ row }) => {
            const activity = row.getValue("activity") as string;
            const value = row.getValue("requestContent") as Record<string, string>;

            if (activity === "create") {
            return (
                <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">Click to view</Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-sm whitespace-pre-wrap text-sm bg-white p-4 border border-black rounded-2xl">
                    {Object.entries(value).map(([key, val]) => (
                    <div key={key} className="mb-1 text-left">
                        <span className="font-medium">{toTitleCase(key)}:</span>{" "}
                        {val ?? <span className="text-gray-400 italic">none</span>}
                    </div>
                    ))}
                </PopoverContent>
                </Popover>
            );
            } else {
            return <ViewStudentButton requesterId={row.original.requesterId} />;
            }
        },
    },
    {
        accessorKey: "requesterName",
        header: "Requester",
        cell: ({ row }) => {
            const name = row.getValue("requesterName") as string;
            return name || <span className="text-gray-400 italic">Unknown</span>;
        },
    },
    {
        accessorKey: "validatorName",
        header: "Validator",
        cell: ({ row }) => {
            const name = row.getValue("validatorName") as string | null;
            return name
            ? name
            : <span className="text-gray-400 italic">Not validated</span>;
        },
    },
    {
        accessorKey: "activity",
        header: "Activity"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const value = row.getValue("createdAt") as string;
            const date = new Date(value);
            return date.toLocaleString();
        },
    },
    {
        accessorKey: "validatedAt",
        header: "Validated At",
        cell: ({ row }) => {
            const value = row.getValue("validatedAt") as string | null;
            if (!value) {
                return <span className="text-gray-400 italic">Not validated</span>;
            }
            const date = new Date(value); // convert Postgres string → JS Date
            return date.toLocaleString(); // renders like "9/20/2025, 12:09:20 PM"
        },
    },
]
