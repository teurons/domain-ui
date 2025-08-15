import {
  LayoutPanelTop,
  RulerIcon,
  TextIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/domain-ui-registry/components/ui/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/domain-ui-registry/components/ui/toggle-group";
import type { PreviewConfig } from "../types";

interface SettingsProps {
  config: PreviewConfig;
  onChange: (config: PreviewConfig) => void;
}

export function Settings({ config, onChange }: SettingsProps) {
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
      <PopoverContent className="w-fit" data-side="top">
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
