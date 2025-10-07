"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/registrar/table/DataTable";
import { Student, studentColumns } from "@/components/registrar/table/students/columns";
import { unarchiveStudents } from "@/lib/actions/archiveStudents";

const ArchivedStudentsPage = () => {
  const [archivedStudents, setArchivedStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchArchivedStudents = async () => {
      try {
        // Fetch students where archived=true
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
  try {
    await unarchiveStudents(ids);
    // ✅ Remove unarchived students from the list
    setArchivedStudents((prev) => prev.filter((s) => !ids.includes(s.studentId)));
  } catch (error) {
    console.error("Failed to unarchive students:", error);
    alert("Failed to unarchive selected students.");
  }
};

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Archived Students</h1>
      <p className="text-gray-500">These are students that have been archived.</p>

      <DataTable onArchive={handleUnarchive} columns={studentColumns} data={archivedStudents} />
    </div>
  );
};

export default ArchivedStudentsPage;
