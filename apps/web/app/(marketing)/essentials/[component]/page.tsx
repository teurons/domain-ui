import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  categories,
  componentMetadata,
  getComponentMetadata,
  getComponentLoader,
  isValidComponent,
} from "@/config/components";
import { getComponentsByNames } from "@/lib/registry-utils";
import ComponentCard from "@/components/component-card";
import ComponentToolbar from "@/components/component-toolbar";

type Props = {
  params: Promise<{ component: string }>;
};

function isComponentAvailable(componentName: string): boolean {
  for (const category of categories) {
    if (category.components.some((comp) => comp.name === componentName)) {
      return true;
    }
  }
  return false;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const componentName = (await params).component;

  if (!isValidComponent(componentName)) {
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
    title: `${meta.name} Component - Domain UI`,
    description: `A beautiful and accessible ${meta.name.toLowerCase()} component for React and Next.js applications. ${meta.description}`,
  };
}

export async function generateStaticParams() {
  return Object.keys(componentMetadata).map((component) => ({
    component,
  }));
}

export default async function EssentialComponentPage({ params }: Props) {
  const componentName = (await params).component;

  if (!isValidComponent(componentName)) {
    notFound();
  }

  if (!isComponentAvailable(componentName)) {
    notFound();
  }

  const components = getComponentsByNames([componentName]);
  const component = components[0];

  if (!component) {
    notFound();
  }

  const meta = getComponentMetadata(componentName);
  const ComponentLoader = getComponentLoader(componentName);

  if (!(meta && ComponentLoader)) {
    notFound();
  }

  console.log(`Loading component: ${componentName}`, component);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">{meta.name} Validation</h1>
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
    </div>
  );
}
