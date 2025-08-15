"use client";

import { PassportInput } from "./passport-input";

export function PassportInputDemo() {
  return (
    <PassportInput
      placeholder="Enter passport number (e.g., A1234567)"
      onChange={(e) => console.log("Passport:", e.target.value)}
    />
  );
}