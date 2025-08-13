import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategory } from "@/config/components";
import { getComponentsByNames } from "@/lib/registry-utils";
import ComponentCard from "@/components/component-card";
import ComponentToolbar from "@/components/component-toolbar";
import ComponentLoader from "@/components/component-loader-server";
import Cta from "@/components/cta";
import PageGrid from "@/components/page-grid";
import PageHeader from "@/components/page-header";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);

  if (!category) {
    return {};
  }

  // Get components to check count
  const components = getComponentsByNames(
    category.components.map((item) => item.name)
  );

  const isSingleComponent = components.length === 1;

  return {
    title: isSingleComponent
      ? `${category.name} component - Domain UI`
      : `${category.name} components - Domain UI`,
    description: isSingleComponent
      ? `A beautiful and accessible ${category.name.toLowerCase()} component for React and Next.js applications.`
      : `A collection of ${components.length} beautiful and accessible ${category.name.toLowerCase()} components for React and Next.js applications.`,
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category);

  if (!category) {
    notFound();
  }

  const components = getComponentsByNames(
    category.components.map((item) => item.name)
  );

  // Determine the description text based on category
  const getDescriptionText = () => {
    // Special case for identity verification
    if (category.slug === "identity") {
      return (
        <span className="block text-balance">
          Identity verification components with built-in validation patterns for
          passports, ID cards, and other official documents. Perfect for KYC and
          onboarding flows.
        </span>
      );
    }

    // Default case based on component count
    return components.length === 1
      ? `A ${category.name.toLowerCase()} component built with React, TypeScript, and Tailwind CSS.`
      : `A growing collection of ${components.length} ${category.name.toLowerCase()} components built with React, TypeScript, and Tailwind CSS.`;
  };

  return (
    <>
      <PageHeader title={category.name}>{getDescriptionText()}</PageHeader>
      <PageGrid>
        {components.map((component) => (
          <ComponentCard
            key={component.name}
            className="col-span-12 border sm:col-span-6 lg:col-span-4"
            toolbar={
              <div className="flex justify-end">
                <ComponentToolbar component={component} />
              </div>
            }
          >
            <ComponentLoader component={component} />
          </ComponentCard>
        ))}
      </PageGrid>
      <Cta />
    </>
  );
}
