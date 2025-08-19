"use client";

import {
  RegexInputIncremental,
  type RegexInputIncrementalProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input-incremental";

const USA_PASSPORT_REGEX = /^(?:[A-Z][0-9]{8}|[0-9]{9}|[A-Z][0-9]{7})$/;

export function PassportInputIncremental(
  props: Omit<RegexInputIncrementalProps, "regex">
) {
  return <RegexInputIncremental regex={USA_PASSPORT_REGEX} {...props} />;
}
