"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@workspace/shadverse/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();

  const createPageURL = (pageNumber: number) => {
    return `${pathname}?page=${pageNumber}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link
            href={createPageURL(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Link>
        ) : (
          <>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </>
        )}
      </Button>

      <div className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)} aria-label="Next page">
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        ) : (
          <>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
