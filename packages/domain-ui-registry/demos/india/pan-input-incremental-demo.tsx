"use client";

import { useState } from "react";
import { PanInputIncremental } from "@workspace/domain-ui-registry/components/domain-ui/india/pan-input-incremental";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

export default function PanInputIncrementalDemo() {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("invalid");

  return (
    <div className="max-w-xs sm:w-full md:max-w-sm">
      <PanInputIncremental
        placeholder="Enter PAN number (e.g., ABCDE1234F)"
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
