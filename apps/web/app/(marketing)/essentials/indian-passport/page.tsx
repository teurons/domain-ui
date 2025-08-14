import type { Metadata } from "next";
import { GridBackground } from "@workspace/ui/grid-background";
import ComponentCard from "@/components/component-card";
import ComponentToolbar from "@/components/component-toolbar";
import { getComponentByName } from "@/lib/registry-utils";
import { getEssentialsDoc } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { IndianPassportDemo } from "@workspace/domain-ui-registry/demos/indian-passport-demo";

export const metadata: Metadata = {
  title: "Indian Passport Input Component",
  description:
    "A beautiful and accessible Indian passport input component for React, shadcn registry. Identity verification component with built-in validation pattern for Indian passports.",
};

export default async function IndianPassportPage() {
  const component = getComponentByName("indian-passport");
  
  // Try to get the MDX documentation
  const essentialsDoc = getEssentialsDoc(["indian-passport-demo"]);
  const MDXContent = essentialsDoc?.data.body;

  return (
    <div className="mx-auto min-h-[90vh] max-w-7xl px-6 py-10 py-12 lg:px-8">
      <GridBackground maxWidthClass="max-w-7xl" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl">Indian Passport Input</h1>
        <p className="mt-2 text-muted-foreground">
          Identity verification component with built-in validation pattern for
          Indian passports.
        </p>
      </div>

      {/* Component Demo */}
      <ComponentCard
        toolbar={
          component && (
            <div className="flex justify-end">
              <ComponentToolbar component={component} />
            </div>
          )
        }
      >
        <IndianPassportDemo />
      </ComponentCard>

      {/* MDX Documentation */}
      {MDXContent && (
        <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
          <MDXContent components={getMDXComponents()} />
        </div>
      )}
    </div>
  );
}
