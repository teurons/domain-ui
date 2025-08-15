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

function Sign({ position, isCurrent, isDull = false }: SignProps) {
  return (
    <div
      className={cn(
        "absolute h-2 w-px translate-x-[-50%] bg-gray-300 dark:bg-gray-600",
        isCurrent && "bg-blue-500 dark:bg-blue-400",
        isDull && "opacity-50"
      )}
      style={position !== undefined ? { left: `${position}px` } : undefined}
    />
  );
}

function MarkerScale({
  width,
  maxWidth,
  currentBreakpoint,
  breakpoints,
}: ScaleBarProps) {
  return (
    <div className="relative h-8">
      {breakpoints.map((breakpoint) => {
        const position = (breakpoint.minWidthPx / maxWidth) * width;
        const isCurrent = breakpoint.title === currentBreakpoint;
        const isValid = breakpoint.show;

        return (
          <Marker
            key={breakpoint.title}
            label={breakpoint.title}
            sublabel={`${breakpoint.minWidthPx}px`}
            position={position}
            isCurrent={isCurrent}
            isValid={isValid}
            isDull={!isValid}
          />
        );
      })}
    </div>
  );
}

function SignScale({
  width,
  maxWidth,
  currentBreakpoint,
  breakpoints,
}: ScaleBarProps) {
  return (
    <div className="relative h-2">
      {breakpoints.map((breakpoint) => {
        const position = (breakpoint.minWidthPx / maxWidth) * width;
        const isCurrent = breakpoint.title === currentBreakpoint;
        const isDull = !breakpoint.show;

        return (
          <Sign
            key={`sign-${breakpoint.title}`}
            position={position}
            isCurrent={isCurrent}
            isDull={isDull}
          />
        );
      })}
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
