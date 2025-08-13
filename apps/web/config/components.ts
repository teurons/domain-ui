export interface ComponentCategory {
  slug: string;
  name: string;
  components: { name: string; type?: "free" | "pro" }[];
  isNew?: boolean;
}

export const categories: ComponentCategory[] = [
  {
    slug: "typography",
    name: "Typography",
    components: [
      { name: "heading", type: "free" },
      { name: "sub-heading", type: "free" },
      { name: "page-title", type: "pro" },
    ],
  },
  {
    slug: "forms",
    name: "Forms",
    components: [{ name: "pan-input", type: "pro" }],
  },
  {
    slug: "identity",
    name: "Identity Verification",
    components: [
      { name: "indian-passport", type: "free" },
      { name: "uk-passport", type: "free" },
      { name: "usa-passport", type: "free" },
    ],
    isNew: true,
  },
  {
    slug: "display",
    name: "Display",
    components: [{ name: "my-badge", type: "free" }],
  },
];

export function getCategory(slug: string): ComponentCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getFreeComponents(): { name: string; category: string }[] {
  const freeComponents: { name: string; category: string }[] = [];
  for (const category of categories) {
    for (const component of category.components) {
      if (!component.type || component.type === "free") {
        freeComponents.push({ name: component.name, category: category.slug });
      }
    }
  }
  return freeComponents;
}

export function getProComponents(): { name: string; category: string }[] {
  const proComponents: { name: string; category: string }[] = [];
  for (const category of categories) {
    for (const component of category.components) {
      if (component.type === "pro") {
        proComponents.push({ name: component.name, category: category.slug });
      }
    }
  }
  return proComponents;
}

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface ComponentMetadata {
  name: string;
  description: string;
  type: "free" | "pro";
  loader: ComponentType<any>;
}

export const componentMetadata: Record<string, ComponentMetadata> = {
  "indian-passport": {
    name: "Indian Passport",
    description:
      "Identity verification component with built-in validation pattern for Indian passports. Perfect for KYC and onboarding flows.",
    type: "pro",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/indian-passport"
        ).then((m) => ({ default: m.IndianPassport })),
      { ssr: true }
    ),
  },
  "uk-passport": {
    name: "UK Passport",
    description:
      "Identity verification component with built-in validation pattern for UK passports. Perfect for KYC and onboarding flows.",
    type: "pro",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/uk-passport"
        ).then((m) => ({ default: m.UkPassport })),
      { ssr: true }
    ),
  },
  "usa-passport": {
    name: "USA Passport",
    description:
      "Identity verification component with built-in validation pattern for USA passports. Perfect for KYC and onboarding flows.",
    type: "pro",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/usa-passport"
        ).then((m) => ({ default: m.UsaPassport })),
      { ssr: true }
    ),
  },
  "pan-input": {
    name: "PAN Input",
    description:
      "Form input component with built-in validation pattern for Indian PAN (Permanent Account Number). Perfect for financial forms and tax applications.",
    type: "pro",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/pan-input"
        ).then((m) => ({ default: m.PanInput })),
      { ssr: true }
    ),
  },
  heading: {
    name: "Heading",
    description:
      "Typography component for section headings with consistent styling.",
    type: "free",
    loader: dynamic(
      () =>
        import("@workspace/domain-ui-registry/components/domain-ui/heading"),
      { ssr: true }
    ),
  },
  "sub-heading": {
    name: "Sub Heading",
    description: "Typography component for subsection headings.",
    type: "free",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/sub-heading"
        ),
      { ssr: true }
    ),
  },
  "page-title": {
    name: "Page Title",
    description: "Typography component for main page titles with emphasis.",
    type: "pro",
    loader: dynamic(
      () =>
        import("@workspace/domain-ui-registry/components/domain-ui/page-title"),
      { ssr: true }
    ),
  },
  "my-badge": {
    name: "My Badge",
    description: "Display component for status indicators and labels.",
    type: "free",
    loader: dynamic(
      () =>
        import("@workspace/domain-ui-registry/components/domain-ui/my-badge"),
      { ssr: true }
    ),
  },
};

export function getComponentMetadata(
  componentName: string
): ComponentMetadata | undefined {
  return componentMetadata[componentName];
}

export function getComponentLoader(
  componentName: string
): ComponentType<any> | undefined {
  return componentMetadata[componentName]?.loader;
}

export function isValidComponent(componentName: string): boolean {
  return componentName in componentMetadata;
}
