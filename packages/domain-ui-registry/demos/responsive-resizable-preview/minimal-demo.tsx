"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";
import StackCard from "./stack-card";

export default function MinimalDemo() {
  return (
    <RRChildPreview
      config={{
        showToolbar: false,
        showScale: false,
        showLabels: false,
      }}
    >
      <StackCard />
    </RRChildPreview>
  );
}