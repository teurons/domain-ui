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
      { name: "indian-passport", type: "pro" },
      { name: "uk-passport", type: "pro" },
      { name: "usa-passport", type: "pro" },
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

export interface ComponentMetadata {
  name: string;
  description: string;
}

export const componentMetadata: Record<string, ComponentMetadata> = {
  "indian-passport": {
    name: "Indian Passport",
    description:
      "Identity verification component with built-in validation pattern for Indian passports. Perfect for KYC and onboarding flows.",
  },
  "uk-passport": {
    name: "UK Passport",
    description:
      "Identity verification component with built-in validation pattern for UK passports. Perfect for KYC and onboarding flows.",
  },
  "usa-passport": {
    name: "USA Passport",
    description:
      "Identity verification component with built-in validation pattern for USA passports. Perfect for KYC and onboarding flows.",
  },
  "pan-input": {
    name: "PAN Input",
    description:
      "Form input component with built-in validation pattern for Indian PAN (Permanent Account Number). Perfect for financial forms and tax applications.",
  },
};

export function getComponentMetadata(
  componentName: string
): ComponentMetadata | undefined {
  return componentMetadata[componentName];
}

export function isValidComponent(componentName: string): boolean {
  return componentName in componentMetadata;
}
