"use client";

import { RegexInput } from "@workspace/domain-ui-registry/components/domain-ui/regex-input";
import { ValidationDemoWrapper } from "@workspace/domain-ui-registry/demos/validation-demo-wrapper";

const alphanumericRegex = /^[A-Z]{3}[0-9]{4}$/;

export default function RegexInputDemo() {
  return (
    <ValidationDemoWrapper
      validMessage="Valid product code"
      invalidMessage="Invalid format. Expected: 3 letters followed by 4 numbers"
      incompleteMessage="Enter complete product code (7 characters)"
      expectedLength={7}
    >
      {({ value, onChange, onValidation, className }) => (
        <RegexInput
          placeholder="Enter product code (e.g., ABC1234)"
          regex={alphanumericRegex}
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
          style={{ textTransform: "uppercase" }}
        />
      )}
    </ValidationDemoWrapper>
  );
}
