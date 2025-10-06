"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { TablePagination } from "./TablePagination"
import { Item } from "@radix-ui/react-dropdown-menu"

interface DataTableProps<TData extends { studentId: number  }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends { studentId: number }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [rowSelection, setRowSelection] = useState({});
  const pathname = usePathname();
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: 10
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const selectedIds = table.getSelectedRowModel().rows.map(
    (row) => row.original.studentId
  )

  // Example validate handler
  // TO BE HANDLED LATER
  const handleValidate = () => {
    console.log("Validate these IDs:", selectedIds)
  }

  const handleViewStudent = () => {
    if (selectedIds.length !== 1) return;

    const studentId = selectedIds[0];
    // Redirect to your dynamic page
    router.push(`/registrar/students/${studentId}`);
  }

  return (
    <div className="p-6 w-full">
      {
        pathname === "/registrar/students"
        ? 
        <div className="flex justify-end mb-5 gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={handleValidate}
          disabled={selectedIds.length === 0}
          className="bg-primary-admin"
        >
          Push to Chain
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleViewStudent}
          disabled={selectedIds.length === 0 || selectedIds.length > 1}
          className="bg-primary-admin"
        >
          View Student
        </Button>
      </div> : null
      }
      
      <div className="overflow-x-auto max-w-full rounded-md border bg-white shadow-sm">
        <Table className="min-w-full table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-pre-wrap break-words align-middle text-center px-4 py-2 font-bold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-pre-wrap break-words align-middle px-4 py-2 truncate max-w-[250px] text-center"
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  );
}