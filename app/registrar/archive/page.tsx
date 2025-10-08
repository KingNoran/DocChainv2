"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/registrar/table/DataTable";
import { Student, studentColumns } from "@/components/registrar/table/students/columns";
import { deleteStudents } from "@/lib/actions/deleteStudents";
import { unarchiveStudents } from "@/lib/actions/archiveStudents";

const ArchivedStudentsPage = () => {
  const [archivedStudents, setArchivedStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchArchivedStudents = async () => {
      try {
        const res = await fetch("/api/students?archived=true");
        if (!res.ok) throw new Error("Failed to fetch archived students");

        const data = await res.json();
        setArchivedStudents(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchArchivedStudents();
  }, []);

  const handleUnarchive = async (ids: number[]) => {
    await unarchiveStudents(ids);
    setArchivedStudents((prev) => prev.filter((s) => !ids.includes(s.studentId)));
  };

  const handleDelete = async (ids: number[]) => {
    if (!confirm("Are you sure you want to permanently delete these students?")) return;
    await deleteStudents(ids);
    setArchivedStudents((prev) => prev.filter((s) => !ids.includes(s.studentId)));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Archived Students</h1>
      <p className="text-gray-500">These students have been archived.</p>

      <DataTable
        columns={studentColumns}
        data={archivedStudents}
        onArchive={handleUnarchive} // reuse existing archive button as unarchive
        onDelete={handleDelete} // ✅ new delete handler
      />
    </div>
  );
};

export default ArchivedStudentsPage;
