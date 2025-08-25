"use client";

import { useState } from "react";
import { SsnInput } from "@workspace/domain-ui-registry/components/domain-ui/usa/ssn-input";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-simple-regex";

export default function SsnInputDemo() {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("invalid");

  return (
    <div className="max-w-xs sm:w-full md:max-w-sm">
      <SsnInput
        placeholder="Enter SSN (e.g., 123-45-6789)"
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
