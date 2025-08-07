"use client";

import dynamic from "next/dynamic";
import type { RegistryItem } from "@/lib/registry-utils";

// Dynamic import factory for all components
const componentLoaders = {
  "my-badge": () =>
    import("@workspace/domain-ui-registry/components/domain-ui/my-badge"),
  heading: () =>
    import("@workspace/domain-ui-registry/components/domain-ui/heading"),
  "sub-heading": () =>
    import("@workspace/domain-ui-registry/components/domain-ui/sub-heading"),
  "page-title": () =>
    import("@workspace/domain-ui-registry/components/domain-ui/page-title"),
  "pan-input": () =>
    import("@workspace/domain-ui-registry/components/domain-ui/pan-input").then(
      (mod) => ({ default: mod.PanInput })
    ),
  "indian-passport": () =>
    import(
      "@workspace/domain-ui-registry/components/domain-ui/indian-passport"
    ).then((mod) => ({ default: mod.IndianPassport })),
  "uk-passport": () =>
    import(
      "@workspace/domain-ui-registry/components/domain-ui/uk-passport"
    ).then((mod) => ({ default: mod.UkPassport })),
  "usa-passport": () =>
    import(
      "@workspace/domain-ui-registry/components/domain-ui/usa-passport"
    ).then((mod) => ({ default: mod.UsaPassport })),
} as const;

interface ComponentLoaderProps {
  component: RegistryItem;
}

export default function ComponentLoader({ component }: ComponentLoaderProps) {
  const loader =
    componentLoaders[component.name as keyof typeof componentLoaders];

  if (!loader) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-muted-foreground/25 border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Component not found</p>
          <p className="text-muted-foreground/60 text-xs">{component.name}</p>
        </div>
      </div>
    );
  }

  const DynamicComponent = dynamic(loader, {
    loading: () => (
      <div className="flex h-32 animate-pulse items-center justify-center rounded-md bg-muted/50">
        <span className="text-muted-foreground text-xs">Loading...</span>
      </div>
    ),
    ssr: false, // Disable SSR to prevent regex undefined error
    suspense: false,
  });

  return <DynamicComponent />;
}
