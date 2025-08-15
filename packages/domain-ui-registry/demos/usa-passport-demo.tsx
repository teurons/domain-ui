"use client";

import { useId, useState } from "react";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import { UsaPassportIncremental } from "../components/domain-ui/usa-passport-incremental";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";
import { 
  ValidationStatus,
  type ValidationStatusType 
} from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

export function UsaPassportDemo() {
  const generatedId = useId();
  const [validationStatus, setValidationStatus] = useState<ValidationStatusType>(
    ValidationStatus.Incomplete
  );

  const handleValidation = (status: ValidationStatusType) => {
    setValidationStatus(status);
  };

  const getErrorMessage = () => {
    switch (validationStatus) {
      case ValidationStatus.Incomplete:
        return "Input incomplete";
      case ValidationStatus.Invalid:
        return "Invalid format";
      case ValidationStatus.Valid:
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={generatedId}>USA Passport</Label>
      <div className="space-y-1">
        <UsaPassportIncremental
          id={generatedId}
          placeholder="Enter USA passport number (e.g., A12345678 or 123456789)"
          className={cn(
            validationStatus === ValidationStatus.Valid && "border-green-500",
            validationStatus === ValidationStatus.Incomplete && "border-yellow-500",
            validationStatus === ValidationStatus.Invalid && "border-red-500"
          )}
          onValidation={handleValidation}
          onChange={() => {
            // Demo component - no action needed
          }}
        />
        {getErrorMessage() && validationStatus !== ValidationStatus.Valid && (
          <p
            className={cn(
              "text-sm",
              validationStatus === ValidationStatus.Incomplete
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
