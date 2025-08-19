import { LayoutPanelTop, RulerIcon, TextIcon, SettingsIcon, Camera, ChevronLeft, ChevronRight, MaximizeIcon, Pause, Play } from "lucide-react";
import { Popover, PopoverTrigger } from "@workspace/domain-ui-registry/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@workspace/domain-ui-registry/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/domain-ui-registry/components/ui/tooltip";
import type { PreviewConfig } from "./index";
import type { Breakpoint } from "../breakpoints";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { domToPng } from "modern-screenshot";

// ============ ScaleBar Component ============
interface MarkerProps {
  label: string;
  sublabel: string;
  position?: number;
  isValid?: boolean;
  isCurrent?: boolean;
  isDull?: boolean;
}

interface ScaleBarProps {
  width: number;
  maxWidth: number;
  currentBreakpoint?: string;
  breakpoints: Breakpoint[];
  showLabels?: boolean;
  showScale?: boolean;
}

interface SignProps {
  position?: number;
  isCurrent?: boolean;
  isDull?: boolean;
}

function Marker({
  label,
  sublabel,
  position,
  isCurrent,
  isValid,
  isDull = false,
}: MarkerProps) {
  return (
    <div
      className={cn(
        "absolute flex translate-x-[-50%] flex-col items-center whitespace-nowrap font-normal text-gray-400 text-xs first:translate-x-[0%] first:items-start last:translate-x-[-100%] last:items-end dark:text-gray-200",
        isCurrent && "!font-bold",
        isValid && "font-medium text-gray-500 dark:text-gray-300",
        isDull && "font-thin"
      )}
      style={position !== undefined ? { left: `${position}px` } : undefined}
    >
      <span>{label}</span>
      <span>{sublabel}</span>
    </div>
  );
}

function MarkerScale({
  width,
  maxWidth,
  currentBreakpoint,
  breakpoints,
}: ScaleBarProps) {
  return (
    <div className="relative h-8 w-full">
      <Marker label="0" sublabel="0px" isDull />

      {breakpoints
        .filter((breakpoint) => breakpoint.show)
        .map((breakpoint: Breakpoint) => (
          <Marker
            key={breakpoint.title}
            label={breakpoint.title}
            sublabel={`${breakpoint.minWidthPx}px`}
            position={breakpoint.minWidthPx}
            isCurrent={currentBreakpoint === breakpoint.title}
            isValid={width > breakpoint.minWidthPx}
          />
        ))}

      <Marker
        label="max"
        sublabel={`${maxWidth}px`}
        position={maxWidth}
        isDull
      />
    </div>
  );
}

function Sign({ position, isCurrent, isDull = false }: SignProps) {
  return (
    <div
      className={cn(
        "absolute h-full border-gray-300 border-l",
        isCurrent && "font-bold",
        isDull && "opacity-50"
      )}
      style={position !== undefined ? { left: `${position}px` } : undefined}
    />
  );
}

function SignScale({
  maxWidth,
  currentBreakpoint,
  breakpoints,
}: ScaleBarProps) {
  return (
    <div className="relative h-4 w-full">
      <div className="absolute top-1/2 w-full border-gray-300 border-t" />
      <Sign isDull />

      {breakpoints
        .filter((breakpoint) => breakpoint.show)
        .map((breakpoint: Breakpoint) => (
          <Sign
            key={breakpoint.title}
            position={breakpoint.minWidthPx}
            isCurrent={currentBreakpoint === breakpoint.title}
          />
        ))}

      <Sign position={maxWidth} isDull />
    </div>
  );
}

export function ScaleBar({
  width,
  maxWidth,
  currentBreakpoint,
  breakpoints,
  showScale,
  showLabels,
}: ScaleBarProps) {
  return (
    <div className="grid gap-1">
      {showLabels && (
        <MarkerScale
          width={width}
          maxWidth={maxWidth}
          currentBreakpoint={currentBreakpoint}
          breakpoints={breakpoints}
        />
      )}

      {showScale && (
        <SignScale
          width={width}
          maxWidth={maxWidth}
          currentBreakpoint={currentBreakpoint}
          breakpoints={breakpoints}
        />
      )}
    </div>
  );
}

// ============ Toolbar Component ============
interface ToolbarProps {
  width: number;
  maxWidth: number;
  breakpointTitle?: string;
  availableBreakpoints: Breakpoint[];
  onBreakpointChange: (value: string) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

export function Toolbar({
  width,
  maxWidth,
  breakpointTitle,
  availableBreakpoints,
  onBreakpointChange,
  panelRef,
}: ToolbarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const currentIndex = availableBreakpoints.findIndex(
    (bp) => bp.title === breakpointTitle
  );

  const handleScreenshot = async () => {
    if (panelRef.current) {
      try {
        const dataUrl = await domToPng(panelRef.current);
        const link = document.createElement("a");
        link.download = `preview-${width}px.png`;
        link.href = dataUrl;
        link.click();
      } catch (_err) {
        // Screenshot failed - error handled silently
      }
    }
  };

  const handlePrevBreakpoint = () => {
    if (currentIndex > 0) {
      const prevBp = availableBreakpoints[currentIndex - 1];
      onBreakpointChange(prevBp?.percentage?.toString() || "0");
    }
  };

  const handleNextBreakpoint = () => {
    if (currentIndex < availableBreakpoints.length - 1) {
      const nextBp = availableBreakpoints[currentIndex + 1];
      onBreakpointChange(nextBp?.percentage?.toString() || "0");
    }
  };

  const play = useCallback(() => {
    let index = 0;
    const breakpoints = availableBreakpoints;

    const start = () => {
      intervalRef.current = window.setInterval(() => {
        const bp = breakpoints[index];
        onBreakpointChange(bp?.percentage?.toString() || "100");
        //index = (index + 1) % breakpoints.length;
        index++;

        if (index >= breakpoints.length) {
          onBreakpointChange("100");
          stop();
          setIsPlaying(false);
        }
      }, 500);
    };

    const stop = () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    return { start, stop };
  }, [availableBreakpoints, onBreakpointChange]);

  const togglePlay = () => {
    const player = play();
    if (isPlaying) {
      player.stop();
    } else {
      player.start();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="mr-[12px] flex grow items-center justify-between">
      <div className="hidden h-7 items-center gap-1.5 rounded-md border p-[2px] shadow-none lg:flex">
        <TooltipProvider>
          <ToggleGroup type="multiple" className="flex items-center">
            <ToggleGroupItem
              value="play"
              onClick={togglePlay}
              data-state="off"
              className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? "Pause" : "Play"}</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="prev"
              onClick={handlePrevBreakpoint}
              disabled={currentIndex <= 0}
              data-state="off"
              className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous Breakpoint</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="next"
              onClick={handleNextBreakpoint}
              data-state="off"
              disabled={currentIndex >= availableBreakpoints.length - 1}
              className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronRight className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next Breakpoint</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="screenshot"
              onClick={handleScreenshot}
              data-state="off"
              className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Camera className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Take Screenshot</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroupItem>
          </ToggleGroup>
        </TooltipProvider>

        <div className="flex w-50 items-center gap-2">
          <span className="flex items-center gap-1 font-medium text-xs">
            Width: <span className="font-mono">{width}px</span>
          </span>

          <span className="text-muted-foreground text-xs">
            ({Number((width / maxWidth) * 100).toFixed(0)}%)
          </span>

          {breakpointTitle && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary leading-[16.5px]">
              {breakpointTitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex hidden w-50 items-center gap-2 rounded-md bg-muted/40 px-3 py-1.5">
        <span className="flex items-center gap-1 font-medium text-xs">
          Width: <span className="font-mono">{width}px</span>
        </span>

        <span className="text-muted-foreground text-xs">
          ({Number((width / maxWidth) * 100).toFixed(1)}%)
        </span>

        {breakpointTitle && (
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
            {breakpointTitle}
          </span>
        )}
      </div>

      <div className="hidden h-7 items-center gap-1.5 rounded-md border p-[2px] shadow-none lg:flex">
        <TooltipProvider>
          <ToggleGroup
            type="single"
            defaultValue="100"
            onValueChange={onBreakpointChange}
            className="flex items-center"
          >
            {availableBreakpoints
              .filter((breakpoint) => breakpoint.show)
              .map((breakpoint: Breakpoint) => {
                const Icon = breakpoint.icon;
                return (
                  <ToggleGroupItem
                    data-state={
                      breakpointTitle === breakpoint.title ? "on" : "off"
                    }
                    value={breakpoint?.percentage?.toString() || "0"}
                    key={breakpoint.title}
                    className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
                    title={`${breakpoint.title} (${breakpoint.minWidthPx}px)`}
                  >
                    {/* {breakpoint?.percentage?.toString() || "0"} */}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon className="h-3.5 w-3.5" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {breakpoint.title} ({breakpoint.minWidthPx}px)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </ToggleGroupItem>
                );
              })}

            <ToggleGroupItem
              data-state="off"
              value="100"
              className="h-[22px] w-[22px] min-w-0 rounded-sm p-0"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <MaximizeIcon className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Full Width</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroupItem>
          </ToggleGroup>
        </TooltipProvider>
      </div>
    </div>
  );
}

// ============ Settings Component ============
interface SettingsProps {
  config: PreviewConfig;
  onChange: (config: PreviewConfig) => void;
  rprRef: React.RefObject<HTMLDivElement | null>;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  portalRef,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  portalRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <PopoverPrimitive.Portal container={portalRef?.current}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export function Settings({ config, onChange, rprRef }: SettingsProps) {
  const toggleItems = [
    { key: "showToolbar", icon: LayoutPanelTop },
    { key: "showLabels", icon: TextIcon },
    { key: "showScale", icon: RulerIcon },
  ] as const;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="h-[22px] w-[22px] rounded-sm p-0">
          <SettingsIcon className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent portalRef={rprRef} className="w-fit" data-side="top">
        <ToggleGroup type="multiple" variant="outline" className="flex gap-1">
          {toggleItems.map(({ key, icon: Icon }) => (
            <ToggleGroupItem
              key={key}
              value={key}
              data-state={config[key] ? "on" : "off"}
              onClick={() => onChange({ ...config, [key]: !config[key] })}
              className="p-2"
            >
              <Icon className="h-4 w-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}