import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/domain-ui-registry/components/ui/tooltip";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/domain-ui-registry/components/ui/toggle-group";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  MaximizeIcon,
  Pause,
  Play,
} from "lucide-react";
import type { Breakpoint } from "../breakpoints";
import { useCallback, useEffect, useRef, useState } from "react";
import { domToPng } from "modern-screenshot"; // Add this import

interface ToolbarProps {
  width: number;
  maxWidth: number;
  breakpointTitle?: string;
  availableBreakpoints: Breakpoint[];
  onBreakpointChange: (value: string) => void;
  panelRef: React.RefObject<HTMLDivElement>;
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
      } catch {
        // Silent catch
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
        window.clearInterval(intervalRef.current);
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
            <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary">
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
