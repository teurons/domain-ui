"use client";

import { useState } from "react";
import { RegexInput } from "@workspace/domain-ui-registry/components/domain-ui/regex-input";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { ValidationStatusType } from "@workspace/domain-ui-registry/hooks/use-simple-regex";

const alphanumericRegex = /^[A-Z]{3}[0-9]{4}$/;

export default function RegexInputDemo() {
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatusType>("invalid");

  return (
    <div className="w-full max-w-sm">
      <RegexInput
        placeholder="Enter product code (e.g., ABC1234)"
        regex={alphanumericRegex}
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
