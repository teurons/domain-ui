"use client";

import { useState } from "react";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

export interface ValidationDemoWrapperIncrementalProps {
  children: (props: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onValidation: (status: ValidationStatusType) => void;
    className: string;
  }) => React.ReactNode;
  validMessage?: string;
  invalidMessage?: string;
  incompleteMessage?: string;
}

export function ValidationDemoWrapperIncremental({
  children,
  validMessage = "Valid input",
  invalidMessage = "Invalid format - cannot match pattern",
  incompleteMessage = "Continue typing...",
}: ValidationDemoWrapperIncrementalProps) {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("incomplete");
  const [value, setValue] = useState("");

  const getValidationMessage = () => {
    if (!value) {
      return null;
    }

    switch (validationStatus) {
      case "valid":
        return <p className="mt-2 text-green-600 text-sm">{validMessage}</p>;
      case "invalid":
        return (
          <p className="mt-2 text-destructive text-sm">{invalidMessage}</p>
        );
      case "incomplete":
        return (
          <p className="mt-2 text-muted-foreground text-sm">
            {incompleteMessage}
          </p>
        );
      default:
        return null;
    }
  };

  const getInputClassName = () => {
    if (!value) {
      return "";
    }

    switch (validationStatus) {
      case "valid":
        return "border-green-500 focus-visible:ring-green-500";
      case "invalid":
        return "border-destructive focus-visible:ring-destructive";
      case "incomplete":
        return "border-amber-500 focus-visible:ring-amber-500";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-sm">
      {children({
        value,
        onChange: (e) => setValue(e.target.value),
        onValidation: setValidationStatus,
        className: cn(getInputClassName()),
      })}
      {getValidationMessage()}
    </div>
  );
}
