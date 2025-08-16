"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { defaultBreakpoints, getBreakpoint } from "./breakpoints";
import type { Breakpoint, BreakpointConfig } from "./breakpoints";
import { Toolbar } from "./components/toolbar";
import { ScaleBar } from "./components/scale-bar";
import { PreviewPanel } from "./components/preview-panel";
import type { PreviewConfig } from "./types";
import { Settings } from "./components/settings";
import { cn } from "@workspace/domain-ui-registry/lib/utils";

interface BasePreviewProps {
  className?: string;
  breakpoints?: BreakpointConfig[];
  config?: PreviewConfig;
}

interface PreviewWrapperProps extends BasePreviewProps {
  children?: React.ReactNode;
}

interface ChildPreviewProps extends BasePreviewProps {
  children?: React.ReactNode;
}

interface IFramePreviewProps extends BasePreviewProps {
  srcUrl: string;
  height?: number;
}

const defaultConfig = {
  darkMode: false,
  showToolbar: true,
  showScale: true,
  showLabels: true,
};

export function PreviewWrapper({
  children,
  className,
  breakpoints = defaultBreakpoints,
  config: initialConfig = defaultConfig,
}: PreviewWrapperProps) {
  const [config, setConfig] = useState<PreviewConfig>(initialConfig);

  const {
    darkMode = false,
    showToolbar = true,
    showScale = true,
    showLabels = true,
  } = config;

  const resizablePanelRef = useRef<ImperativePanelHandle>(null);
  const [width, setWidth] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const rprRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (width > maxWidth) {
      setMaxWidth(width);
    }
  }, [width, maxWidth]);

  useEffect(() => {
    if (!panelContentRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const entryWidth = entries[0].contentRect.width;
        setWidth(Math.round(entryWidth));
      }
    });

    observer.observe(panelContentRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const availableBreakpoints = useMemo(() => {
    return breakpoints.map((breakpoint: Breakpoint) => {
      breakpoint.percentage = (breakpoint.minWidthPx * 100) / maxWidth;

      if (breakpoint.percentage > 100) {
        breakpoint.percentage = 100;
        breakpoint.show = false;
      } else {
        breakpoint.show = true;
      }
      return breakpoint;
    });
  }, [maxWidth, breakpoints]);

  const currentBreakpoint = getBreakpoint(width, breakpoints);

  return (
    <div>
      <div
        className={cn(darkMode && "dark dark")}
        data-theme={darkMode ? "dark" : "light"}
      >
        <div
          className="relative grid w-full gap-4 rounded-md bg-transparent p-0 text-gray-800 dark:bg-transparent dark:text-white"
          ref={rprRef}
        >
          {showToolbar && (
            <div className="flex min-h-9 items-center justify-between space-x-2">
              <div className="flex-grow">
                <Toolbar
                  width={width}
                  maxWidth={maxWidth}
                  breakpointTitle={currentBreakpoint?.title}
                  availableBreakpoints={availableBreakpoints}
                  onBreakpointChange={(value) => {
                    if (resizablePanelRef?.current) {
                      resizablePanelRef.current.resize(
                        Number.parseFloat(value)
                      );
                    }
                  }}
                  panelRef={panelContentRef} // Add this line
                />
              </div>

              <div className="h-7 justify-end p-[2px]">
                <Settings
                  config={config}
                  onChange={(newConfig) => {
                    setConfig(newConfig);
                  }}
                  rprRef={rprRef}
                />
              </div>
            </div>
          )}

          <ScaleBar
            width={width}
            maxWidth={maxWidth}
            currentBreakpoint={currentBreakpoint?.title}
            breakpoints={availableBreakpoints}
            showLabels={showLabels}
            showScale={showScale}
          />

          <PreviewPanel
            panelRef={resizablePanelRef}
            contentRef={panelContentRef}
            className={className}
          >
            {children}
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}

// ChildPreview component - renders children directly
export function ChildPreview({
  children,
  breakpoints,
  config,
  className,
}: ChildPreviewProps) {
  return (
    <PreviewWrapper
      breakpoints={breakpoints}
      config={config}
      className={className}
    >
      {children}
    </PreviewWrapper>
  );
}

// IFramePreview component - renders content in an iframe
export function IFramePreview({
  srcUrl,
  height,
  breakpoints,
  config,
  className,
}: IFramePreviewProps) {
  return (
    <PreviewWrapper
      breakpoints={breakpoints}
      config={config}
      className={className}
    >
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
