"use client";

import { useState } from "react";
import { RegexInputIncremental } from "@workspace/domain-ui-registry/components/domain-ui/regex-input-incremental";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-incremental-regex";

const alphanumericRegex = /^[A-Z]{3}[0-9]{4}$/;

export default function RegexInputIncrementalDemo() {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("invalid");

  return (
    <div className="w-full max-w-sm">
      <RegexInputIncremental
        placeholder="Enter product code (e.g., ABC1234)"
        regex={alphanumericRegex}
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
