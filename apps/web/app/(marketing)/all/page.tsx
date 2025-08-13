import type { Metadata } from "next";
import { Suspense } from "react";
import { categories } from "@/config/components";
import { getComponentsByNames, getComponentType } from "@/lib/registry-utils";
import ComponentCard from "@/components/component-card";
import ComponentToolbar from "@/components/component-toolbar";
import ComponentLoader from "@/components/component-loader";
import PageHeader from "@/components/page-header";
import PageGrid from "@/components/page-grid";
import { Badge } from "@workspace/shadverse/components/badge";
import { Button } from "@workspace/shadverse/components/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "All Components - Domain UI",
  description:
    "Browse all Domain UI components in one place. Free and Pro components for React and Next.js applications.",
};

const COMPONENTS_PER_PAGE = 2; // Set pagination to 2 as requested

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AllComponentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Collect all components from all categories
  const allComponents = categories.flatMap((category) =>
    category.components.map((comp) => ({
      ...comp,
      categoryName: category.name,
      categorySlug: category.slug,
    }))
  );

  // Get registry items for all components
  const components = getComponentsByNames(
    allComponents.map((item) => item.name)
  );

  // Add category info to components
  const componentsWithCategory = components.map((component) => {
    const componentConfig = allComponents.find(
      (c) => c.name === component.name
    );
    return {
      ...component,
      categoryName: componentConfig?.categoryName,
      categorySlug: componentConfig?.categorySlug,
    };
  });

  // Pagination logic
  const totalComponents = componentsWithCategory.length;
  const totalPages = Math.ceil(totalComponents / COMPONENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMPONENTS_PER_PAGE;
  const endIndex = startIndex + COMPONENTS_PER_PAGE;
  const paginatedComponents = componentsWithCategory.slice(
    startIndex,
    endIndex
  );

  return (
    <>
      <PageHeader title="All Components">
        <span className="block text-balance">
          Browse our complete collection of {totalComponents} components.
          Showing {startIndex + 1}-{Math.min(endIndex, totalComponents)} of{" "}
          {totalComponents} components.
        </span>
      </PageHeader>

      <Suspense
        fallback={
          <PageGrid>
            {Array.from({ length: COMPONENTS_PER_PAGE }).map((_, i) => (
              <div
                key={`loading-${i}`}
                className="col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <div className="flex h-32 animate-pulse items-center justify-center rounded-md bg-muted/50">
                  <span className="text-muted-foreground text-xs">
                    Loading...
                  </span>
                </div>
              </div>
            ))}
          </PageGrid>
        }
      >
        <PageGrid>
          {paginatedComponents.map((component) => {
            const componentType = getComponentType(component.name);

            return (
              <ComponentCard
                key={component.name}
                className="col-span-12 border sm:col-span-6 lg:col-span-4"
                toolbar={
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {componentType === "pro" && (
                        <Badge variant="default" className="text-xs">
                          PRO
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {component.categoryName}
                      </Badge>
                    </div>
                    <ComponentToolbar component={component} />
                  </div>
                }
              >
                <ComponentLoader component={component} />
              </ComponentCard>
            );
          })}
        </PageGrid>
      </Suspense>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            asChild
          >
            <a href={`/all?page=${currentPage - 1}`}>
              <ChevronLeftIcon className="mr-1 h-4 w-4" />
              Previous
            </a>
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <a href={`/all?page=${pageNum}`}>{pageNum}</a>
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            asChild
          >
            <a href={`/all?page=${currentPage + 1}`}>
              Next
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}

      {/* Summary section */}
      <div className="mt-16 rounded-lg bg-muted/30 p-8 text-center">
        <h3 className="mb-4 font-semibold text-xl">Component Library Stats</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <div className="font-bold text-2xl text-primary">
              {totalComponents}
            </div>
            <div className="text-muted-foreground text-sm">
              Total Components
            </div>
          </div>
          <div>
            <div className="font-bold text-2xl text-primary">
              {categories.length}
            </div>
            <div className="text-muted-foreground text-sm">Categories</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-primary">{totalPages}</div>
            <div className="text-muted-foreground text-sm">Pages</div>
          </div>
        </div>
      </div>
    </>
  );
}
