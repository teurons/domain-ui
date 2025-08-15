"use client";

import type * as React from "react";
import { PreviewWrapper } from "./preview-wrapper";
import type { BreakpointConfig } from "./breakpoints";
import type { PreviewConfig } from "./types";

interface ChildPreviewProps {
  children?: React.ReactNode;
  breakpoints?: BreakpointConfig[];
  config?: PreviewConfig;
}

export function ChildPreview({
  children,
  breakpoints,
  config,
}: ChildPreviewProps) {
  return (
    <PreviewWrapper breakpoints={breakpoints} config={config}>
      {children}
    </PreviewWrapper>
  );
}
