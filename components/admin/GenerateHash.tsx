"use client";

import React, { useState } from 'react';
import { checkFileType } from '@/utils/checkFileType';
import { hashPdf } from '@/utils/hashPdf';

import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';


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
      <Input
					type="file"
					accept="application/pdf"
					onChange={handleFileInput}
			/>
      <br />
      <br />
      <Button className='bg-[#25388C] cursor-pointer' type="submit" onClick={handleSubmit}>
					{isLoading ? "Generating..." : "Generate Hash"}
			</Button>
    </div>
  )
}

export default GenerateHash
