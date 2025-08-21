"use client";

import {
  RegexInput,
  type RegexInputProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input";

// SSN regex: XXX-XX-XXXX format
// - First group: 001-665, 667-899 (excludes 000, 666, 9XX)
// - Second group: 01-99 (excludes 00)
// - Third group: 0001-9999 (excludes 0000)
const SSN_REGEX = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;

export function SsnInput(props: Omit<RegexInputProps, "regex">) {
  return <RegexInput regex={SSN_REGEX} {...props} />;
}
