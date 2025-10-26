"use client";

import React, { useRef, useState, useEffect } from "react";
import { checkFileType } from "@/utils/checkFileType";
import { hashPdf } from "@/utils/hashPdf";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface GenerateHashProps {
  onHashGenerated: (hash: string) => void;
  autoFile?: File | null;
}

const GenerateHash = ({ onHashGenerated, autoFile }: GenerateHashProps) => {
  const [file, setFile] = useState<File | null | undefined>(autoFile || null);
  const [isLoading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState(autoFile?.name || "");

  useEffect(() => {
    if (autoFile) {
      setFile(autoFile);
      setFilename(autoFile.name);
      handleSubmit(autoFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFile]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (!checkFileType(event.target.files[0])) {
        setFilename("Please select a PDF file format.");
      } else {
        setFile(event.target.files[0]);
        setFilename(event.target.files[0].name);
      }
    }
  };

  const handleSubmit = async (overrideFile?: File) => {
    setLoading(true);
    const pdfFile = overrideFile || file;
    if (!pdfFile) {
      alert("Please select a file first");
      setLoading(false);
      return;
    }
    try {
      const pdfHash = await hashPdf(pdfFile);
      onHashGenerated(pdfHash);
    } catch (err) {
      console.error("Hashing error:", err);
      alert("Error hashing PDF file");
    }
    setLoading(false);
  };

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <Button
          className="bg-[#25388C] cursor-pointer text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload PDF
        </Button>
        <Input className="w-100" readOnly value={filename} />
      </div>

      <br />
      <Button
        className="bg-[#25388C] cursor-pointer"
        type="submit"
        onClick={() => handleSubmit()}
      >
        {isLoading ? "Generating..." : "Generate Hash"}
      </Button>
    </div>
  );
};

export default GenerateHash;
