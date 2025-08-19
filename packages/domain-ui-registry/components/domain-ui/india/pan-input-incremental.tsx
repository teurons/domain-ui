"use client";

import {
  RegexInputIncremental,
  type RegexInputIncrementalProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input-incremental";

const PAN_REGEX = /^[A-Z]{3}[PCFTABGHLJE]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

export function PanInputIncremental(
  props: Omit<RegexInputIncrementalProps, "regex">
) {
  return (
    <RegexInputIncremental regex={PAN_REGEX} transformToUppercase {...props} />
  );
}
