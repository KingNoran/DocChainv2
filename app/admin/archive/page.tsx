"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/table/DataTable";
import { Request, requestColumns } from "@/components/admin/table/requests/columns";
import { unarchiveRequests } from "@/lib/actions/archiveRequests";


const ArchivedRequestsPage = () => {
  const [archivedRequests, setArchivedRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchArchivedRequests = async () => {
      try {
        const res = await fetch("/api/requests?archived=true");
        if (!res.ok) throw new Error("Failed to fetch archived requests");

        const data = await res.json();
        setArchivedRequests(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchArchivedRequests();
  }, []);

  const handleUnarchive = async (ids: number[]) => {
    try {
        await unarchiveRequests(ids);
        // Optimistically remove unarchived rows from UI
        setArchivedRequests((prev) => prev.filter((req) => !ids.includes(req.id)));
    } catch (error) {
        console.error("Failed to unarchive requests:", error);
        alert("Failed to unarchive requests.");
    }
    };


  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Archived Requests</h1>
      <p className="text-gray-500">
        These are previously validated or archived requests.
      </p>
      <DataTable onArchive={handleUnarchive} columns={requestColumns} data={archivedRequests} />
    </div>
  );
};

export default ArchivedRequestsPage;
