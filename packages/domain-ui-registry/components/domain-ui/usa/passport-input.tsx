"use client";

import {
  RegexInput,
  type RegexInputProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input";

const USA_PASSPORT_REGEX = /^(?:[A-Z][0-9]{8}|[0-9]{9}|[A-Z][0-9]{7})$/;

export function PassportInput(props: Omit<RegexInputProps, "regex">) {
  return <RegexInput regex={USA_PASSPORT_REGEX} {...props} />;
}
