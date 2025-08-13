import { categories, getFreeComponents } from "@/config/components";
import type { RegistryItem } from "shadcn/registry";
import registry from "@workspace/domain-ui-registry/registry.json" with {
  type: "json",
};
const components = registry.items as unknown as RegistryItem[];

// import type { RegistryTag } from "@/registry/registry-tags";

// export interface RegistryItem {
//   name: string;
//   type: string;
//   files: Array<{
//     path: string;
//     content: string;
//     type: string;
//   }>;
//   registryDependencies?: string[];
//   meta?: {
//     tags?: string[];
//     colSpan?: number;
//     style?: number;
//   };
// }

export const getComponentsByNames = (names: string[]): RegistryItem[] => {
  const componentsMap = new Map(components.map((comp) => [comp.name, comp]));

  // console.log("componentsMap", components, componentsMap);

  return names
    .map((name) => componentsMap.get(name))
    .filter((comp): comp is RegistryItem => comp !== undefined);
};

function _getComponentTags(componentName: string): string[] {
  for (const category of categories) {
    if (category.components.includes(componentName)) {
      return [category.slug];
    }
  }
  return [];
}

export const getComponentType = (componentName: string): "free" | "pro" => {
  const freeComponents = getFreeComponents();
  const isFreeComponent = freeComponents.includes(componentName);
  return isFreeComponent ? "free" : "pro";
};

export function getRegistryBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Browser environment - check if we're in development
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // Development environment - registry is always on Next.js port
      return `${protocol}//localhost:3000`;
    }

    // For deployed versions, use current origin (registry is on same domain)
    return window.location.origin;
  }

  // Server-side: Use appropriate URL based on Vercel environment
  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for older Vercel deployments or when VERCEL_ENV is not set
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development fallback
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Production fallback
  return "https://domain-ui.dev";
}

export const getRegistryUrl = (componentName: string): string => {
  const type = getComponentType(componentName);
  return type === "pro"
    ? `/r-pro/${componentName}.json`
    : `/r/${componentName}.json`;
};

export function getFullRegistryUrl(name: string, type: "free" | "pro"): string {
  const baseUrl = getRegistryBaseUrl();
  const registryPath = type === "pro" ? "/r-pro" : "/r";
  return `${baseUrl}${registryPath}/${name}.json`;
}

export function getShadcnCommand(name: string, type: "free" | "pro"): string {
  const registryUrl = getFullRegistryUrl(name, type);
  return `pnpm dlx shadcn@latest add ${registryUrl}`;
}

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
