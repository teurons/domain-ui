"use client";

import { useId, useState } from "react";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import { UsaPassport } from "../components/domain-ui/usa-passport";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";

export function UsaPassportDemo() {
  const generatedId = useId();
  const [validationState, setValidationState] = useState<
    "valid" | "potentially-valid" | "invalid"
  >("potentially-valid");
  const [errorType, setErrorType] = useState<
    "incomplete" | "invalid-format" | "incorrect-input" | null
  >(null);

  const handleValidationChange = (
    state: "valid" | "potentially-valid" | "invalid",
    error: "incomplete" | "invalid-format" | "incorrect-input" | null
  ) => {
    setValidationState(state);
    setErrorType(error);
  };

  const getErrorMessage = () => {
    switch (errorType) {
      case "incomplete":
        return "Input incomplete";
      case "invalid-format":
        return "Invalid format";
      case "incorrect-input":
        return "Incorrect input";
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={generatedId}>USA Passport</Label>
      <div className="space-y-1">
        <div
          className={cn(
            "rounded-md border-2 border-transparent transition-colors",
            validationState === "valid" && "border-green-500",
            validationState === "potentially-valid" && "border-yellow-500",
            validationState === "invalid" && "border-red-500"
          )}
        >
          <UsaPassport
            id={generatedId}
            placeholder="Enter USA passport number (e.g., A12345678 or 123456789)"
            onValidationChange={handleValidationChange}
            onChange={() => {
              // Demo component - no action needed
            }}
          />
        </div>
        {getErrorMessage() && validationState !== "valid" && (
          <p
            className={cn(
              "text-sm",
              validationState === "potentially-valid"
                ? "text-yellow-600"
                : "text-red-600"
            )}
          >
            {getErrorMessage()}
          </p>
        )}
      </div>
      <p className="text-muted-foreground text-sm">
        Formats: Letter + 8 digits, 9 digits only, or Letter + 7 digits
      </p>
    </div>
  );
}
