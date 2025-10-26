"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { TablePagination } from "./TablePagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData extends { id: number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onArchive?: (ids: number[]) => Promise<void>;
  onDelete?: (ids: number[]) => Promise<void>;
  onValidate?: (ids: number[]) => Promise<void>;
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  onArchive,
  onDelete,
  onValidate,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const pathname = usePathname();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination, // Use the state variable
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination, // Add this handler
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedIds = table.getSelectedRowModel().rows.map(
    (row) => row.original.id
  );

  // detect if on archive page
  const isArchivePage = pathname.includes("/archive");

  const handleArchive = async () => {
    if (!onArchive) return;
    setIsProcessing(true);
    await onArchive(selectedIds);
    setIsProcessing(false);
    setRowSelection({});
  };

  const handleViewStudent = () => {
    if (selectedIds.length !== 1) return;
    const studentId = selectedIds[0];
    router.push(`/registrar/students/${studentId}`);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsProcessing(true);
    await onDelete(selectedIds);
    setIsProcessing(false);
    setRowSelection({});
  }

  const handleValidate = async() =>{
    if (!onValidate) return;
    setIsProcessing(true);
    await onValidate(selectedIds);
    setIsProcessing(false);
    setRowSelection({});
  }

  return (
    <div className="p-6 w-full">
      {(pathname === "/registrar/students" || isArchivePage) && (
        <div className="flex justify-end mb-5 gap-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleArchive}
            disabled={selectedIds.length === 0 || isProcessing}
          >
            {isProcessing
              ? isArchivePage
                ? "Unarchiving..."
                : "Archiving..."
              : isArchivePage
              ? "Unarchive Selected"
              : "Archive Selected"}
          </Button>

          <Button
            className={cn(!isArchivePage ? "hidden" : "")}
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={selectedIds.length === 0 || isProcessing}
          >
            {isProcessing ? "Deleting..." : "Delete Permanently"}
          </Button>

          

          {!isArchivePage && (
            <Button
              variant="default"
              size="sm"
              onClick={handleViewStudent}
              disabled={selectedIds.length !== 1}
              className="bg-primary-admin"
            >
              View Student
            </Button>
          )}
        </div>
      )}
      {pathname === "/registrar/requests" || isArchivePage ?
      <div className="flex justify-end mb-5 gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={handleValidate}
          className="bg-primary-admin"
        >
          Validate Requests
        </Button>
      </div>
      : null
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