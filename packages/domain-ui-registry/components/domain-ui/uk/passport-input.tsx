"use client";

import {
  RegexInput,
  type RegexInputProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input";

const UK_PASSPORT_REGEX = /^[A-Z0-9]{9}$/;

export function PassportInput(props: Omit<RegexInputProps, "regex">) {
  return <RegexInput regex={UK_PASSPORT_REGEX} {...props} />;
}
