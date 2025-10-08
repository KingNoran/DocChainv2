"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/table/DataTable";
import {
  Request,
  requestColumns,
} from "@/components/admin/table/requests/columns";
import { deleteRequests } from "@/lib/actions/deleteRequests";
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
    await unarchiveRequests(ids);
    setArchivedRequests((prev) =>
      prev.filter((req) => !ids.includes(req.id))
    );
  };

  const handleDelete = async (ids: number[]) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete these requests? This cannot be undone."
      )
    )
      return;

    await deleteRequests(ids);
    setArchivedRequests((prev) =>
      prev.filter((req) => !ids.includes(req.id))
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Archived Requests</h1>
      <p className="text-gray-500">
        These requests have been archived. You can unarchive or permanently
        delete them below.
      </p>

      <DataTable
        columns={requestColumns}
        data={archivedRequests}
        onArchive={handleUnarchive}
        onDelete={handleDelete} // ✅ new delete handler
      />
    </div>
  );
};

export default ArchivedRequestsPage;
