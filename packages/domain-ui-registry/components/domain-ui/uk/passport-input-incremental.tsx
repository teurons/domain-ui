"use client";

import {
  RegexInputIncremental,
  type RegexInputIncrementalProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input-incremental";

const UK_PASSPORT_REGEX = /^[A-Z0-9]{9}$/;

export function PassportInputIncremental(
  props: Omit<RegexInputIncrementalProps, "regex">
) {
  return <RegexInputIncremental regex={UK_PASSPORT_REGEX} {...props} />;
}
