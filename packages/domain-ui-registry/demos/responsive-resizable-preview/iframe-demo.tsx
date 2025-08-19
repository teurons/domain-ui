"use client";

import { RRIFramePreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function IFrameDemo() {
  return (
    <RRIFramePreview
      srcUrl="/demo/responsive-resizable-preview"
      height={500}
      config={{
        darkMode: false,
        showToolbar: true,
        showScale: true,
        showLabels: true,
      }}
    />
  );
}