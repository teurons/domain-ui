"use client";

import { PanInput } from "./pan-input";

export function PanInputDemo() {
  return (
    <PanInput
      placeholder="Enter PAN number (e.g., ABCDE1234F)"
      onChange={(e) => console.log("PAN:", e.target.value)}
    />
  );
}