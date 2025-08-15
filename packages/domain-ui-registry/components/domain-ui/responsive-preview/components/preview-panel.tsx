import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/domain-ui-registry/components/ui/resizable";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "@workspace/domain-ui-registry/lib/utils";

interface PreviewPanelProps {
  children: React.ReactNode;
  className?: string;
  panelRef: React.RefObject<ImperativePanelHandle | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export function PreviewPanel({
  children,
  className,
  panelRef,
  contentRef,
}: PreviewPanelProps) {
  const [isHandleResizing, setIsHandleResizing] = useState(false);

  const bgPattern = `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="!overflow-visible relative z-10 rounded-sm border-0 border-[#0000001f] bg-gray-300 bg-clip-padding dark:bg-gray-600"
      style={{ backgroundImage: bgPattern }}
    >
      <ResizablePanel
        ref={panelRef}
        className={cn(
          `border ${className}`,
          !isHandleResizing && "transition-all duration-200 ease-in-out"
        )}
      >
        <div
          ref={contentRef}
          className="relative h-full w-full overflow-auto bg-white dark:bg-gray-900"
        >
          {children}
        </div>
      </ResizablePanel>

      <ResizableHandle
        withHandle
        onDragging={setIsHandleResizing}
        className="z-50 w-0"
      />

      <ResizablePanel defaultSize={0} minSize={0} className="bg-transparent" />
    </ResizablePanelGroup>
  );
}
