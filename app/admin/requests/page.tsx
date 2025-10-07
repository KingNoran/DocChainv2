"use client";

import { DataTable } from "@/components/admin/table/DataTable";
import { Request, requestColumns } from "@/components/admin/table/requests/columns";
import { archiveRequests } from "@/lib/actions/archiveRequests";
import { validateRequests } from "@/lib/actions/validateRequests";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  // Fetch non-archived requests
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests?archived=false");
      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle validation (and automatic archiving)
  const handleValidate = async (ids: number[]) => {
    try {
      await validateRequests(ids);

      // When validated, they’re automatically archived too
      setRequests((prev) => prev.filter((req) => !ids.includes(req.id)));
    } catch (err) {
      console.error(err);
      alert("Failed to validate requests.");
    }
  };

  // Handle manual archiving
  const handleArchive = async (ids: number[]) => {
    try {
      await archiveRequests(ids);
      setRequests((prev) => prev.filter((req) => !ids.includes(req.id)));
    } catch (err) {
      console.error(err);
      alert("Failed to archive requests.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Pending Requests</h1>
      <DataTable
        columns={requestColumns}
        data={requests}
        onArchive={handleArchive}
        onValidate={handleValidate}
      />
    </div>
  );
};

export default Page;
