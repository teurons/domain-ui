"use client";

import { useState } from "react";
import { PassportInput } from "@workspace/domain-ui-registry/components/domain-ui/usa/passport-input";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-simple-regex";

export default function PassportInputDemo() {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("invalid");

  return (
    <div className="max-w-xs sm:w-full md:max-w-sm">
      <PassportInput
        placeholder="Enter USA passport number (e.g., A12345678 or 123456789)"
        onValidation={setValidationStatus}
        className={cn({
          "border-green-500 focus-visible:ring-green-500":
            validationStatus === "valid",
          "border-destructive focus-visible:ring-destructive":
            validationStatus === "invalid",
        })}
      />
    </div>
  );
}
