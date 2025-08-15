"use client";

import { PassportInput } from "./passport-input";

export function PassportInputDemo() {
  return (
    <PassportInput
      placeholder="Enter USA passport number (e.g., A12345678 or 123456789)"
      onChange={(e) => console.log("USA Passport:", e.target.value)}
    />
  );
}
