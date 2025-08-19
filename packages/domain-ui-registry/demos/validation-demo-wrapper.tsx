"use client";

import { useState } from "react";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-simple-regex";

export interface ValidationDemoWrapperProps {
  children: (props: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onValidation: (status: ValidationStatusType) => void;
    className: string;
  }) => React.ReactNode;
  validMessage?: string;
  invalidMessage?: string;
  incompleteMessage?: string;
  expectedLength?: number;
}

export function ValidationDemoWrapper({
  children,
  validMessage = "Valid input",
  invalidMessage = "Invalid format",
  incompleteMessage = "Enter complete value",
  expectedLength,
}: ValidationDemoWrapperProps) {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("invalid");
  const [value, setValue] = useState("");

  const getValidationMessage = () => {
    if (!value) {
      return null;
    }
    if (
      expectedLength &&
      value.length >= expectedLength &&
      validationStatus === "invalid"
    ) {
      return <p className="mt-2 text-destructive text-sm">{invalidMessage}</p>;
    }
    if (!expectedLength && value.length > 0 && validationStatus === "invalid") {
      return <p className="mt-2 text-destructive text-sm">{invalidMessage}</p>;
    }
    if (validationStatus === "valid") {
      return <p className="mt-2 text-green-600 text-sm">{validMessage}</p>;
    }
    if (expectedLength && value.length < expectedLength) {
      return (
        <p className="mt-2 text-muted-foreground text-sm">
          {incompleteMessage}
        </p>
      );
    }
    return null;
  };

  const getInputClassName = () => {
    if (!value) {
      return "";
    }
    if (
      expectedLength &&
      value.length >= expectedLength &&
      validationStatus === "invalid"
    ) {
      return "border-destructive focus-visible:ring-destructive";
    }
    if (!expectedLength && value.length > 0 && validationStatus === "invalid") {
      return "border-destructive focus-visible:ring-destructive";
    }
    if (validationStatus === "valid") {
      return "border-green-500 focus-visible:ring-green-500";
    }
    if (expectedLength && value.length < expectedLength) {
      return "border-amber-500 focus-visible:ring-amber-500";
    }
    return "";
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
