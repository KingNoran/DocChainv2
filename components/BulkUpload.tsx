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
import { Progress } from "@/components/ui/progress"; // ✅ Add this from shadcn/ui

function excelDateToISO(serial: any): string {
  if (typeof serial === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(epoch.getTime() + serial * 86400000);
    return date.toISOString().split("T")[0];
  }
  if (typeof serial === "string" && /^\d{4}-\d{2}-\d{2}$/.test(serial)) return serial;
  if (typeof serial === "string" && /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(serial)) {
    const [year, month, day] = serial.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().split("T")[0];
  }
  return "1970-01-01";
}

const BulkStudentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // ✅ new

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const simulateProgress = (target: number) => {
    // Smoothly animate progress bar
    let value = progress;
    const step = () => {
      value += Math.random() * 10;
      if (value < target) {
        setProgress(Math.min(value, 95));
        setTimeout(step, 100);
      }
    };
    step();
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an Excel file first.");

    setLoading(true);
    setProgress(5);
    simulateProgress(70);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const raw = XLSX.utils.sheet_to_json(sheet);

      const json = raw.map((row: any) => ({
        firstName: row["firstName"],
        middleName: row["middleName"] || "",
        lastName: row["lastName"],
        email: row["email"],
        phone: row["phone"] || "0000000000",
        nationality: row["nationality"] || "Filipino",
        birthday: excelDateToISO(row["birthday"]),
        address: row["address"] || "Unknown",
        highschool: row["highschool"] || "Unknown",
        course: row["course"] || "BSCS",
        major: row["major"] || "",
        dateEntrance: excelDateToISO(row["entrance"]),
        dateGraduated: excelDateToISO(row["graduation"]),
        torHash: row["torHash"] || "",
      }));

      setProgress(85);

      const res = await createStudentsBulk(JSON.parse(JSON.stringify(json)));

      setProgress(100);
      if (res.success) {
        toast.success(`Inserted ${res.count} students successfully!`);
      } else {
        toast.error(res.message || "Bulk insert failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error parsing Excel file.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bulk Student Upload</CardTitle>
        <CardDescription>
          Upload an Excel file to insert multiple students.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="file">Select Excel File</Label>
          <div className="flex items-center gap-2">
            <Button asChild type="button">
              <label htmlFor="file" className="cursor-pointer">
                Choose File
              </label>
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

        {loading && (
          <div className="flex flex-col gap-2">
            <Label>Processing...</Label>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-primary-admin text-white"
        >
          {loading ? "Processing..." : "Upload and Insert Students"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkStudentUpload;
