"use client";

import { useState } from "react";
import { PassportInputIncremental } from "@workspace/domain-ui-registry/components/domain-ui/usa/passport-input-incremental";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

export default function PassportInputIncrementalDemo() {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("invalid");

  return (
    <div className="max-w-xs sm:w-full md:max-w-sm">
      <PassportInputIncremental
        placeholder="Enter USA passport (e.g., A12345678 or 123456789)"
        onValidation={setValidationStatus}
        className={cn({
          "border-green-500 focus-visible:ring-green-500":
            validationStatus === "valid",
          "border-yellow-500 focus-visible:ring-yellow-500":
            validationStatus === "incomplete",
          "border-destructive focus-visible:ring-destructive":
            validationStatus === "invalid",
        })}
      />
    </div>
  );
}
