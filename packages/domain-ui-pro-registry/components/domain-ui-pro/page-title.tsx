import React from "react";
import { cn } from "@workspace/domain-ui-pro-registry/lib/utils";
import Heading from "@workspace/domain-ui-pro-registry/components/domain-ui-pro/heading";
import SubHeading from "@workspace/domain-ui-pro-registry/components/domain-ui-pro/sub-heading";

interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  headingVariant?: "default" | "muted" | "gradient";
  subtitleVariant?: "default" | "muted" | "accent";
  alignment?: "left" | "center" | "right";
}

export default function PageTitle({
  title,
  subtitle,
  headingLevel = 1,
  headingVariant = "default",
  subtitleVariant = "default",
  alignment = "left",
  className,
  ...props
}: PageTitleProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={cn("space-y-2", alignmentClasses[alignment], className)}
      {...props}
    >
      <Heading level={headingLevel} variant={headingVariant}>
        {title}
      </Heading>
      {subtitle && (
        <SubHeading variant={subtitleVariant} size="lg">
          {subtitle}
        </SubHeading>
      )}
    </div>
  );
}
