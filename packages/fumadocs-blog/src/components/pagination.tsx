import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogConfiguration } from "./types";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  configuration?: BlogConfiguration;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  configuration = { config: { blogBase: "/blog", pageSize: 5 } },
}: PaginationProps) {
  const pageIndex = currentPage - 1;

  if (totalPages <= 1) {
    return null;
  }

  if (!configuration.Button) return null;

  return (
    <div className="mt-8 flex justify-center space-x-4">
      <div className="flex items-center gap-2">
        <configuration.Button
          variant="outline"
          size="sm"
          disabled={pageIndex === 0}
          asChild={pageIndex > 0}
        >
          {pageIndex > 0 ? (
            <Link
              href={
                pageIndex === 1 ? basePath : `${basePath}/page/${pageIndex}`
              }
              prefetch={false}
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
        </configuration.Button>

        <div className="text-muted-foreground text-sm">
          Page {pageIndex + 1} of {totalPages}
        </div>

        <configuration.Button
          variant="outline"
          size="sm"
          disabled={pageIndex + 1 >= totalPages}
          asChild={pageIndex + 1 < totalPages}
        >
          {pageIndex + 1 < totalPages ? (
            <Link href={`${basePath}/page/${currentPage + 1}`} prefetch={false}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </configuration.Button>
      </div>
    </div>
  );
}
