import type { ComponentType } from "react";
import type { RegistryItem } from "@/lib/registry-utils";

// Static imports for all components
import MyBadge from "@workspace/domain-ui-registry/components/domain-ui/my-badge";
import Heading from "@workspace/domain-ui-registry/components/domain-ui/heading";
import SubHeading from "@workspace/domain-ui-registry/components/domain-ui/sub-heading";
import PageTitle from "@workspace/domain-ui-registry/components/domain-ui/page-title";
import { RegexInput } from "@workspace/domain-ui-registry/components/domain-ui/regex-input";
import { PanInput } from "@workspace/domain-ui-registry/components/domain-ui/pan-input";
import { IndianPassport } from "@workspace/domain-ui-registry/components/domain-ui/indian-passport";
import { UkPassport } from "@workspace/domain-ui-registry/components/domain-ui/uk-passport";
import { UsaPassport } from "@workspace/domain-ui-registry/components/domain-ui/usa-passport";

// Component mapping
const componentMap: Record<string, ComponentType<any>> = {
  "my-badge": MyBadge,
  "heading": Heading,
  "sub-heading": SubHeading,
  "page-title": PageTitle,
  "regex-input": RegexInput,
  "pan-input": PanInput,
  "indian-passport": IndianPassport,
  "uk-passport": UkPassport,
  "usa-passport": UsaPassport,
};

interface ComponentLoaderProps {
  component: RegistryItem;
}

export default function ComponentLoader<TProps extends object>({
  component,
  ...props
}: ComponentLoaderProps & TProps) {
  if (!component?.name) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        <p>Component not found</p>
      </div>
    );
  }

  const Component = componentMap[component.name] as ComponentType<TProps>;

  if (!Component) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-muted-foreground/25 border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Component not registered</p>
          <p className="text-muted-foreground/60 text-xs">{component.name}</p>
        </div>
      </div>
    );
  }

  return <Component {...(props as TProps)} />;
}