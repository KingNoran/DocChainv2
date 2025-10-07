"use client";

import { DataTable } from "@/components/registrar/table/DataTable";
import { Student, studentColumns } from "@/components/registrar/table/students/columns";
import { archiveStudents } from "@/lib/actions/archiveStudents";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch non-archived students
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students?archived=false");
      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle archiving logic
  const handleArchive = async (ids: number[]) => {
    try {
      await archiveStudents(ids);

      // Optimistic UI update: remove archived students from view
      setStudents((prev) => prev.filter((s) => !ids.includes(s.studentId)));
    } catch (err) {
      console.error(err);
      alert("Failed to archive students.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Active Students</h1>
      <DataTable columns={studentColumns} data={students} onArchive={handleArchive} />
    </div>
  );
};

export default Page;
