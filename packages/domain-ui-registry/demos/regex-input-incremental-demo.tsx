"use client";

import { RegexInputIncremental } from "@workspace/domain-ui-registry/components/domain-ui/regex-input-incremental";
import { ValidationDemoWrapperIncremental } from "@workspace/domain-ui-registry/demos/validation-demo-wrapper-incremental";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function RegexInputIncrementalDemo() {
  return (
    <ValidationDemoWrapperIncremental
      validMessage="Valid email address"
      invalidMessage="Invalid character for email format"
      incompleteMessage="Continue typing email address"
    >
      {({ value, onChange, onValidation, className }) => (
        <RegexInputIncremental
          regex={EMAIL_REGEX}
          placeholder="Enter email (e.g., user@example.com)"
          value={value}
          onChange={onChange}
          onValidation={onValidation}
          className={className}
        />
      )}
    </ValidationDemoWrapperIncremental>
  );
}
