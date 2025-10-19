"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createStudentsBulk } from "@/lib/admin/actions/student";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function excelDateToISO(serial: any): string {
  // Case 1: Excel serial number (e.g., 45123)
  if (typeof serial === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(epoch.getTime() + serial * 86400000);
    return date.toISOString().split("T")[0];
  }

  // Case 2: Already ISO format (YYYY-MM-DD)
  if (typeof serial === "string" && /^\d{4}-\d{2}-\d{2}$/.test(serial)) {
    return serial;
  }

  // Case 3: Year/Month/Day format (YYYY/MM/DD)
  if (typeof serial === "string" && /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(serial)) {
    const [year, month, day] = serial.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().split("T")[0];
  }

  // Default fallback
  return "1970-01-01";
}


const BulkStudentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an Excel file first.");

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const raw = XLSX.utils.sheet_to_json(sheet);

      const json = raw.map((row: any) => ({
        ...row,
        birthdate: excelDateToISO(row.birthday),
        graduation: excelDateToISO(row.graduation),
        entrance: excelDateToISO(row.entrance),
      }));

      const res = await createStudentsBulk(JSON.parse(JSON.stringify(json)));
      if (res.success) {
        toast.success(`Inserted ${res.count} students successfully!`, {
          description: `${JSON.stringify(json)}`,
        });
      } else {
        toast.error(res.message || "Bulk insert failed", {
          description: `${JSON.stringify(json)}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error parsing Excel file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bulk Student Upload</CardTitle>
        <CardDescription>Upload an Excel file to insert multiple students.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="file">Select Excel File</Label>
          <div className="flex items-center gap-2">
  <Button asChild>
    <label htmlFor="file">Choose File</label>
  </Button>
  <span>{file ? file.name : "No file selected"}</span>
  <input
    id="file"
    type="file"
    accept=".xlsx, .xls"
    onChange={handleFileChange}
    className="hidden"
  />
</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-primary-admin text-white"
        >
          {loading ? "Uploading..." : "Upload and Insert Students"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkStudentUpload;
