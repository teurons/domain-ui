import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  componentMetadata,
  getComponentMetadata,
  getComponentLoader,
  componentExists,
} from "@/config/components";
import { getComponentByName } from "@/lib/registry-utils";
import ComponentCard from "@/components/component-card";
import ComponentToolbar from "@/components/component-toolbar";
import { GridBackground } from "@workspace/ui/grid-background";
import { essentialsDocsSource, getEssentialsDoc } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

type Props = {
  params: Promise<{ component: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const componentName = (await params).component;

  if (!componentExists(componentName)) {
    return {
      title: "Component Not Found - Domain UI",
    };
  }

  const meta = getComponentMetadata(componentName);
  if (!meta) {
    return {
      title: "Component Not Found - Domain UI",
    };
  }

  return {
    title: `${meta.name} Component`,
    description: `A beautiful and accessible ${meta.name.toLowerCase()} component for React, shadcn registry. ${meta.description}`,
  };
}

export async function generateStaticParams() {
  return Object.keys(componentMetadata).map((component) => ({
    component,
  }));
}

export default async function EssentialComponentPage({ params }: Props) {
  const componentName = (await params).component;

  if (!componentExists(componentName)) {
    notFound();
  }

  const component = getComponentByName(componentName);

  if (!component) {
    notFound();
  }

  const meta = getComponentMetadata(componentName);
  const ComponentLoader = getComponentLoader(componentName);

  if (!(meta && ComponentLoader)) {
    notFound();
  }

  // Try to get the MDX documentation for this component
  const essentialsDoc = essentialsDocsSource.getPage([componentName]);
  const MDXContent = essentialsDoc?.data.body;

  return (
    <div className="mx-auto min-h-[90vh] max-w-7xl px-6 py-10 py-12 lg:px-8">
      <GridBackground maxWidthClass="max-w-7xl" />
      <div className="mb-8">
        <h1 className="font-bold text-3xl">{meta.name}</h1>
        <p className="mt-2 text-muted-foreground">{meta.description}</p>
      </div>

      <ComponentCard
        toolbar={
          <div className="flex justify-end">
            <ComponentToolbar component={component} />
          </div>
        }
      >
        <ComponentLoader />
      </ComponentCard>

      {/* Render MDX documentation if it exists */}
      {MDXContent && (
        <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
          <MDXContent components={getMDXComponents()} />
        </div>
      )}
    </div>
  );
}
