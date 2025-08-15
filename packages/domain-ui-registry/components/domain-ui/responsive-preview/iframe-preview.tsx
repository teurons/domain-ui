"use client";

import type { BreakpointConfig } from "./breakpoints";
import { PreviewWrapper } from "./preview-wrapper";
import type { PreviewConfig } from "./types";

interface IFramePreviewProps {
  srcUrl: string;
  height?: number;
  breakpoints?: BreakpointConfig[];
  config?: PreviewConfig;
}

export function IFramePreview({
  srcUrl,
  height,
  breakpoints,
  config,
}: IFramePreviewProps) {
  return (
    <PreviewWrapper breakpoints={breakpoints} config={config}>
      <iframe
        allow="cross-origin-isolated"
        src={srcUrl}
        height={height || 930}
        className="relative z-20 hidden w-full bg-gray-50 md:block"
        title={`Preview of ${srcUrl}`}
      />
    </PreviewWrapper>
  );
}
