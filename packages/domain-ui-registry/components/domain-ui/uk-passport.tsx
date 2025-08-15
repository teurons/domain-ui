"use client";

import { useId } from "react";
import type * as React from "react";
import { RegexInput } from "@workspace/domain-ui-registry/components/domain-ui/regex-input";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";

const UK_PASSPORT_REGEX = /^[A-Z0-9]{9}$/;

export function UkPassport(props: React.ComponentProps<"input">) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>UK Passport</Label>
      <RegexInput regex={UK_PASSPORT_REGEX} {...props} id={id} />
    </div>
  );
}