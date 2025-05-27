"use client"
 
import { ColumnDef } from "@tanstack/react-table";
import { BytesLike } from 'ethers';

export type EventLogs = {
  eventType: string, 
  id: number,
  transcriptHash: BytesLike,
  eventHash: BytesLike,
  eventTimestamp: string,
  rawTimestamp: number,
}

export const columns: ColumnDef<EventLogs>[] = [
  {
    accessorKey: "eventType",
    header: "Event Type",
  },
  {
    accessorKey: "id",
    header: "ID",
    filterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId)).includes(filterValue);
    },
  },
  {
    accessorKey: "transcriptHash",
    header: "Transcript Hash",
  },
  {
    accessorKey: "eventHash",
    header: "Transaction Hash",
  },
  {
    accessorKey: "eventTimestamp",
    header: "Timestamp",
  }
]