"use client";

import { PassportInput } from "../components/domain-ui/uk/passport-input";

export function UkPassportDemo() {
  return (
    <PassportInput
      placeholder="Enter passport number (e.g., 123456789)"
      onChange={(e) => console.log("UK Passport:", e.target.value)}
    />
  );
}