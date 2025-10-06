"use client";

import { useEffect, useRef, useState } from "react";

interface PaperProps {
  children: React.ReactNode;
}

/**
 * Paper auto-splits content into multiple A4 pages with better content handling.
 */
export default function Paper({ children }: PaperProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!measureRef.current) return;

      const pageHeight = 1080; // Slightly less than full height to account for margins
      const elements = Array.from(measureRef.current.children) as HTMLElement[];
      
      const newPages: React.ReactNode[][] = [];
      let currentPage: React.ReactNode[] = [];
      let currentHeight = 0;
      let pageIndex = 0;

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementHeight = rect.height;
        
        // Check if we need a new page
        if (currentHeight + elementHeight > pageHeight && currentPage.length > 0) {
          newPages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
          pageIndex++;
        }

        // Clone the React element with a new key
        const clonedElement = (children as any)?.[index] || element.outerHTML;
        currentPage.push(
          <div key={`${pageIndex}-${index}`} className="page-element">
            {typeof clonedElement === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: clonedElement }} />
            ) : (
              clonedElement
            )}
          </div>
        );
        
        currentHeight += elementHeight + 8; // Add small margin between elements
      });

      if (currentPage.length > 0) {
        newPages.push(currentPage);
      }

      setPages(newPages);
      setIsReady(true);
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [children]);

  return (
    <div>
      {/* Measurement container */}
      <div 
        ref={measureRef} 
        className="fixed -top-full left-0 opacity-0 pointer-events-none"
        style={{ width: '210mm' }}
      >
        {children}
      </div>

      {/* Rendered pages */}
      {isReady && pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className="bg-white shadow-lg border mx-auto mb-6 overflow-hidden print:shadow-none print:mb-0"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            boxSizing: 'border-box',
          }}
        >
          <div className="h-full flex flex-col">
            {page}
          </div>
          
          {/* Page number */}
          <div className="text-center text-xs text-gray-500 mt-4">
            Page {pageIndex + 1} of {pages.length}
          </div>
        </div>
      ))}
    </div>
  );
}