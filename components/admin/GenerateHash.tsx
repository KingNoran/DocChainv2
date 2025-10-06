"use client";

import React, { useRef, useState } from 'react';
import { checkFileType } from '@/utils/checkFileType';
import { hashPdf } from '@/utils/hashPdf';

import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';


const GenerateHash = ({ onHashGenerated }: { onHashGenerated: Function }) => {
  const [file, setFile] = useState<File | null | undefined>(null);
  const [isLoading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filename, setFilename] = useState('');

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (!checkFileType(event.target.files[0])) {
        setFilename("Please select a PDF file format.")
      } else {
        setFile(event.target.files[0])
        setFilename(event.target.files[0].name)
      }  
    }
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
    <div className='mt-5'>
      <div className='flex items-center gap-3'>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          className="hidden"
          placeholder="Transcript PDF"
        />
        <Button
          className="bg-[#25388C] cursor-pointer text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload PDF
        </Button>
        <Input className='w-100' readOnly value={filename} />
      </div>
      
      <br />
      <Button className='bg-[#25388C] cursor-pointer' type="submit" onClick={handleSubmit}>
					{isLoading ? "Generating..." : "Generate Hash"}
			</Button>
    </div>
  )
}

export default GenerateHash
