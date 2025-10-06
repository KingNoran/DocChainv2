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
    cell: ({ row }) => {
      const hash = row.getValue("eventHash") as string;
      return (
        <a 
          className="text-green-500"
          href={`https://zksync-sepolia.blockscout.com/tx/${hash}`}
          target='_blank'
          rel='noopener noreferrer'
          title={hash}
        >
          {hash}
        </a>
        );
    }
  },
  {
    accessorKey: "eventTimestamp",
    header: "Timestamp",
  }
]