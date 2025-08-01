import React from "react";
import { cn } from "@workspace/domain-ui-pro-registry/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "default" | "muted" | "gradient";
}

export default function Heading({
  level = 1,
  variant = "default",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const variants = {
    default: "text-foreground font-semibold tracking-tight",
    muted: "text-muted-foreground font-medium tracking-tight",
    gradient:
      "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent font-bold tracking-tight",
  };

  const sizes = {
    1: "text-4xl lg:text-5xl",
    2: "text-3xl lg:text-4xl",
    3: "text-2xl lg:text-3xl",
    4: "text-xl lg:text-2xl",
    5: "text-lg lg:text-xl",
    6: "text-base lg:text-lg",
  };

  return (
    <Tag className={cn(variants[variant], sizes[level], className)} {...props}>
      {children}
    </Tag>
  );
}
