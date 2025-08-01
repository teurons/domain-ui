import React from "react";
import { cn } from "@domain-ui-registry/lib/utils";

interface SubHeadingProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "muted" | "accent";
  size?: "sm" | "md" | "lg";
}

export default function SubHeading({ 
  variant = "default",
  size = "md",
  className, 
  children, 
  ...props 
}: SubHeadingProps) {
  const variants = {
    default: "text-muted-foreground",
    muted: "text-muted-foreground/70",
    accent: "text-primary"
  };

  const sizes = {
    sm: "text-sm",
    md: "text-base lg:text-lg",
    lg: "text-lg lg:text-xl"
  };

  return (
    <p 
      className={cn(
        "font-medium leading-relaxed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}