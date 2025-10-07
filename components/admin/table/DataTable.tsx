"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "./TablePagination";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface DataTableProps<TData extends { id: number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onArchive?: (ids: number[]) => Promise<void>;
  onValidate?: (ids: number[]) => Promise<void>; // ✅ new
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  onArchive,
  onValidate,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const pathname = usePathname();
  
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedIds = table.getSelectedRowModel().rows.map(
    (row) => row.original.id
  );
  const isArchivePage = pathname.includes("/archive");
  const handleArchive = async () => {
    if (!onArchive) return;
    setIsProcessing(true);
    await onArchive(selectedIds);
    setIsProcessing(false);
    setRowSelection({});
  };

  const handleValidate = async () => {
    if (!onValidate) return;
    setIsProcessing(true);
    await onValidate(selectedIds);
    setIsProcessing(false);
    setRowSelection({});
  };

  return (
    <div className="p-6 w-full">
      
{(pathname === "/admin/requests" || isArchivePage) && (
  <div className="flex justify-end mb-5 gap-2">
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

    {!isArchivePage && (
      <Button
        variant="default"
        size="sm"
        onClick={handleValidate}
        disabled={selectedIds.length === 0 || isProcessing}
      >
        {isProcessing ? "Processing..." : "Validate Selected"}
      </Button>
    )}
  </div>
)}

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
