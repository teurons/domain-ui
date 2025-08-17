"use client";

import { useId } from "react";
import {
  RegexInput,
  type RegexInputProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";

const INDIAN_PASSPORT_REGEX = /^[A-Z][0-9]{7}$/;

export interface PassportInputProps extends Omit<RegexInputProps, "regex"> {
  showLabel?: boolean;
}

export function PassportInput({
  showLabel = true,
  ...props
}: PassportInputProps) {
  const generatedId = useId();
  const id = props.id || generatedId;

  if (!showLabel) {
    return <RegexInput regex={INDIAN_PASSPORT_REGEX} {...props} id={id} />;
  }

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Indian Passport</Label>
      <RegexInput regex={INDIAN_PASSPORT_REGEX} {...props} id={id} />
    </div>
  );
}
