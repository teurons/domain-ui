import { cn } from "@workspace/domain-ui-registry/lib/utils";
import type { Breakpoint } from "../breakpoints";

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
