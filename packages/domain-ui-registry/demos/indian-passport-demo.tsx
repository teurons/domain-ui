"use client";

import { PassportInput } from "../components/domain-ui/india/passport-input";

export function IndianPassportDemo() {
  return (
    <PassportInput
      placeholder="Enter passport number (e.g., A1234567)"
      onChange={(e) => console.log("Passport:", e.target.value)}
    />
  );
}