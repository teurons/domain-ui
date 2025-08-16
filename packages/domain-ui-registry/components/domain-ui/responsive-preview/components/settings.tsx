import {
  LayoutPanelTop,
  RulerIcon,
  TextIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
} from "@workspace/domain-ui-registry/components/ui/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/domain-ui-registry/components/ui/toggle-group";
import type { PreviewConfig } from "../preview-wrapper";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@workspace/domain-ui-registry/lib/utils";

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
  const {
    // darkMode = false,
    showToolbar = true,
    showLabels = true,
    showScale = true,
  } = config;

  // console.log("showToolbar", showToolbar);

  const handleConfigChange = (key: string, value: boolean) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="h-[22px] w-[22px] rounded-sm p-0">
          <SettingsIcon className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent portalRef={rprRef} className="w-fit" data-side="top">
        <ToggleGroup type="multiple" variant="outline" className="flex gap-1">
          {/* <ToggleGroupItem
            value="darkMode"
            data-state={darkMode ? "on" : "off"}
            onClick={() => handleConfigChange("darkMode", !darkMode)}
            className="p-2"
          >
            <MoonIcon className="h-4 w-4" />
          </ToggleGroupItem> */}
          <ToggleGroupItem
            value="showToolbar"
            data-state={showToolbar ? "on" : "off"}
            onClick={() => handleConfigChange("showToolbar", !showToolbar)}
            className="p-2"
          >
            <LayoutPanelTop className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="showLabels"
            data-state={showLabels ? "on" : "off"}
            onClick={() => handleConfigChange("showLabels", !showLabels)}
            className="p-2"
          >
            <TextIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="showScale"
            data-state={showScale ? "on" : "off"}
            onClick={() => handleConfigChange("showScale", !showScale)}
            className="p-2"
          >
            <RulerIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}
