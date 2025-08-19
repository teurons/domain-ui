"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function BasicDemo() {
  return (
    <RRChildPreview>
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/50 p-8">
        <div className="text-center">
          <h3 className="mb-2 font-semibold text-lg">Basic Preview</h3>
          <p className="text-muted-foreground text-sm">
            Resize to see responsive behavior
          </p>
        </div>
      </div>
    </RRChildPreview>
  );
}
