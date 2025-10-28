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
import { cn } from "@/lib/utils";

interface DataTableProps<TData extends { id: number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onArchive?: (ids: number[]) => Promise<void>;
  onValidate?: (ids: number[]) => Promise<void>;
  onDelete?: (ids: number[]) => Promise<void>;
}

interface HasActivity {
  id: number;
  activity: string;
}

export function DataTable<
  TData extends { id: number } & HasActivity,
  TValue
>({
  columns,
  data,
  onArchive,
  onValidate,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  
  // ✅ Separate loading states
  const [isArchiving, setIsArchiving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);

  const canValidate =
    selectedRows.length > 0 &&
    selectedRows.every((row) => row.original.activity === "create");

  const isArchivePage = pathname.includes("/archive");

  // ✅ Independent handlers
  const handleArchive = async () => {
    if (!onArchive) return;
    setIsArchiving(true);
    await onArchive(selectedIds);
    setIsArchiving(false);
    setRowSelection({});
  };

  const handleValidate = async () => {
    if (!onValidate) return;
    setIsValidating(true);
    await onValidate(selectedIds);
    setIsValidating(false);
    setRowSelection({});
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    await onDelete(selectedIds);
    setIsDeleting(false);
    setRowSelection({});
  };

  return (
    <div className="p-6 w-full">
      {(pathname === "/admin/requests" || isArchivePage) && (
        <div className="flex justify-end mb-5 gap-2">
          {/* 🗑️ Delete */}
          <Button
            className={cn(!isArchivePage ? "hidden" : "")}
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={selectedIds.length === 0 || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>

          {/* 📦 Archive / Unarchive */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleArchive}
            disabled={selectedIds.length === 0 || isArchiving}
          >
            {isArchiving
              ? isArchivePage
                ? "Unarchiving..."
                : "Archiving..."
              : isArchivePage
              ? "Unarchive Selected"
              : "Archive Selected"}
          </Button>

          {/* ✅ Validate */}
          {!isArchivePage && (
            <Button
              variant="default"
              size="sm"
              onClick={handleValidate}
              disabled={
                selectedIds.length === 0 ||
                isValidating ||
                !canValidate
              }
            >
              {isValidating ? "Processing..." : "Validate Selected"}
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
