"use client";

import {
  RegexInput,
  type RegexInputProps,
} from "@workspace/domain-ui-registry/components/domain-ui/regex-input";

const PAN_REGEX = /^[A-Z]{3}[PCFTABGHLJE]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

export function PanInput(props: Omit<RegexInputProps, "regex">) {
  return <RegexInput regex={PAN_REGEX} transformToUppercase {...props} />;
}
