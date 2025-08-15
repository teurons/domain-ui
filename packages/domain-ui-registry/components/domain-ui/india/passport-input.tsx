"use client";

import { useId } from "react";
import type * as React from "react";
import { RegexInput } from "@workspace/domain-ui-registry/components/domain-ui/regex-input";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";

const INDIAN_PASSPORT_REGEX = /^[A-Z][0-9]{7}$/;

export function PassportInput(props: React.ComponentProps<"input">) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Indian Passport</Label>
      <RegexInput regex={INDIAN_PASSPORT_REGEX} {...props} id={id} />
    </div>
  );
}