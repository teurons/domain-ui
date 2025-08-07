import { categories, getFreeComponents } from "@/config/components";

export interface RegistryItem {
  name: string;
  type: string;
  files: Array<{
    path: string;
    content: string;
    type: string;
  }>;
  registryDependencies?: string[];
  meta?: {
    tags?: string[];
    colSpan?: number;
    style?: number;
  };
}

export const getComponentsByNames = (names: string[]): RegistryItem[] => {
  // This would typically fetch from registry, but we'll create mock items
  // based on the component names from our categories
  return names.map((name) => ({
    name,
    type: "registry:component",
    files: [
      {
        path: `components/domain-ui/${name}.tsx`,
        content: "",
        type: "registry:component",
      },
    ],
    registryDependencies: [],
    meta: {
      tags: getComponentTags(name),
    },
  }));
};

function getComponentTags(componentName: string): string[] {
  for (const category of categories) {
    const component = category.components.find((c) => c.name === componentName);
    if (component) {
      return [category.slug];
    }
  }
  return [];
}

export const getComponentType = (componentName: string): "free" | "pro" => {
  const freeComponents = getFreeComponents();
  const isFreComponent = freeComponents.some((c) => c.name === componentName);
  return isFreComponent ? "free" : "pro";
};

export const getRegistryUrl = (componentName: string): string => {
  const type = getComponentType(componentName);
  return type === "pro"
    ? `/r-pro/${componentName}.json`
    : `/r/${componentName}.json`;
};

export const convertRegistryPaths = (content: string): string => {
  return content
    .replace(/@\/registry\/default\/ui/g, "@workspace/shadverse/components")
    .replace(
      /@\/registry\/default\/components/g,
      "@workspace/domain-ui-registry/components"
    )
    .replace(
      /@\/registry\/default\/hooks/g,
      "@workspace/domain-ui-registry/hooks"
    )
    .replace(/@\/registry\/default\/lib/g, "@workspace/shadverse/lib");
};
