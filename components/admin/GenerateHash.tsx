"use client";

import React, { useState } from 'react';
import { checkFileType } from '@/utils/checkFileType';
import { hashPdf } from '@/utils/hashPdf';


const GenerateHash = ({ onHashGenerated }: { onHashGenerated: Function }) => {
  const [file, setFile] = useState<File | null | undefined>(null);
  const [isLoading, setLoading] = useState(false);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedFile = event.target.files?.[0];

		if (!checkFileType(uploadedFile)) {
			alert("PDF files only");
			return;
		}

		setFile(uploadedFile);
	};

  const handleSubmit = async () => {
    setLoading(true);

		if (!file) {
			alert("Please select a file first");
      setLoading(false);
			return;
		}

		const pdfHash = await hashPdf(file);

    setLoading(false);

    onHashGenerated(pdfHash);
	};
  
  return (
    <div>
      <input
					type="file"
					accept="application/pdf"
					onChange={handleFileInput}
			/>
      <br />
      <br />
      <button type="submit" onClick={handleSubmit}>
					{isLoading ? "Generating..." : "Generate Hash"}
			</button>
    </div>
  )
}

export default GenerateHash
