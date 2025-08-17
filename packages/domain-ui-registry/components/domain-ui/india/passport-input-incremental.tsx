"use client";

import { useId } from "react";
import {
  RegexInputIncremental,
  type RegexInputIncrementalProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input-incremental";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";

const INDIAN_PASSPORT_REGEX = /^[A-Z][0-9]{7}$/;

export interface PassportInputIncrementalProps
  extends Omit<RegexInputIncrementalProps, "regex"> {
  showLabel?: boolean;
}

export function PassportInputIncremental({
  showLabel = true,
  ...props
}: PassportInputIncrementalProps) {
  const generatedId = useId();
  const id = props.id || generatedId;

  if (!showLabel) {
    return (
      <RegexInputIncremental regex={INDIAN_PASSPORT_REGEX} {...props} id={id} />
    );
  }

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Indian Passport</Label>
      <RegexInputIncremental regex={INDIAN_PASSPORT_REGEX} {...props} id={id} />
    </div>
  );
}
