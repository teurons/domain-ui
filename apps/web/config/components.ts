export interface ComponentCategory {
  slug: string;
  name: string;
  components: string[];
  isNew?: boolean;
}

export const categories: ComponentCategory[] = [
  {
    slug: "typography",
    name: "Typography",
    components: [],
  },
  {
    slug: "forms",
    name: "Forms",
    components: ["regex-input", "pan-input"],
  },
  {
    slug: "identity",
    name: "Identity Verification",
    components: ["indian-passport-input", "uk-passport-input", "usa-passport-input"],
    isNew: true,
  },
  {
    slug: "identity-advanced",
    name: "Identity Verification (Advanced)",
    components: ["indian-passport-input-incremental", "uk-passport-input-incremental", "usa-passport-input-incremental"],
    isNew: true,
  },
  {
    slug: "display",
    name: "Display",
    components: ["my-badge"],
  },
];

export function getCategory(slug: string): ComponentCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getFreeComponents(): string[] {
  return Object.keys(componentMetadata).filter(
    (name) => componentMetadata[name]?.type === "free"
  );
}

export function getProComponents(): string[] {
  return Object.keys(componentMetadata).filter(
    (name) => componentMetadata[name]?.type === "pro"
  );
}

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface ComponentMetadata {
  name: string;
  description: string;
  type: "free" | "pro";
  // biome-ignore lint/suspicious/noExplicitAny: Components have varying prop types
  loader: ComponentType<any>;
}

export const componentMetadata: Record<string, ComponentMetadata> = {
  "regex-input": {
    name: "Regex Input",
    description:
      "Simple regex validation input component. Lightweight with no incremental validation.",
    type: "free",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/regex-input"
        ).then((m) => ({ default: m.RegexInput })),
      { ssr: true }
    ),
  },
  "indian-passport-input": {
    name: "Indian Passport Input",
    description:
      "Identity verification component with built-in validation pattern for Indian passports. Perfect for KYC and onboarding flows.",
    type: "free",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/india/passport-input"
        ).then((m) => ({ default: m.PassportInput })),
      { ssr: true }
    ),
  },
  "indian-passport-input-incremental": {
    name: "Indian Passport Input (Advanced)",
    description:
      "Advanced identity verification component with real-time incremental validation. Prevents invalid characters while typing.",
    type: "pro",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/india/passport-input-incremental"
        ).then((m) => ({ default: m.PassportInputIncremental })),
      { ssr: true }
    ),
  },
  "uk-passport-input": {
    name: "UK Passport",
    description:
      "Identity verification component with built-in validation pattern for UK passports. Perfect for KYC and onboarding flows.",
    type: "free",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/uk/passport-input"
        ).then((m) => ({ default: m.PassportInput })),
      { ssr: true }
    ),
  },
  "uk-passport-input-incremental": {
    name: "UK Passport (Advanced)",
    description:
      "Advanced identity verification component with real-time incremental validation. Prevents invalid characters while typing.",
    type: "pro",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/uk/passport-input-incremental"
        ).then((m) => ({ default: m.PassportInputIncremental })),
      { ssr: true }
    ),
  },
  "usa-passport-input": {
    name: "USA Passport",
    description:
      "Identity verification component with built-in validation pattern for USA passports. Perfect for KYC and onboarding flows.",
    type: "free",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/usa/passport-input"
        ).then((m) => ({ default: m.PassportInput })),
      { ssr: true }
    ),
  },
  "usa-passport-input-incremental": {
    name: "USA Passport (Advanced)",
    description:
      "Advanced identity verification component with real-time incremental validation. Prevents invalid characters while typing.",
    type: "pro",
    loader: dynamic(
      () =>
        import(
          "@workspace/domain-ui-registry/components/domain-ui/usa/passport-input-incremental"
        ).then((m) => ({ default: m.PassportInputIncremental })),
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
          "@workspace/domain-ui-registry/components/domain-ui/india/pan-input"
        ).then((m) => ({ default: m.PanInput })),
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
  // biome-ignore lint/suspicious/noExplicitAny: Components have varying prop types
): ComponentType<any> | undefined {
  return componentMetadata[componentName]?.loader;
}

export function componentExists(componentName: string): boolean {
  return componentName in componentMetadata;
}
