"use client";

import { CodeIcon } from "lucide-react";
import type { RegistryItem } from "@/lib/registry-utils";
import { getComponentType, getRegistryUrl } from "@/lib/registry-utils";

import { Button } from "@workspace/shadverse/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/shadverse/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/shadverse/components/tooltip";

// Use the existing registry code block
import DynamicRegistryCodeBlock from "@workspace/ui/components/registry-code-block-dynamic";

import CliCommands from "./cli-commands";

export default function ComponentDetails({
  component,
}: {
  component: RegistryItem;
}) {
  const componentType = getComponentType(component.name);

  return (
    <div className="absolute top-2 right-2 flex gap-2 peer-data-comp-loading:hidden">
      <Dialog>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground/80 transition-none hover:bg-transparent hover:text-foreground disabled:opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 lg:group-focus-within/item:opacity-100"
                  >
                    <CodeIcon size={16} aria-hidden={true} />
                  </Button>
                </DialogTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-muted-foreground text-xs">
              View code
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-left">Installation</DialogTitle>
            <DialogDescription className="sr-only">
              Use the CLI to add components to your project
            </DialogDescription>
          </DialogHeader>
          <div className="min-w-0 space-y-5">
            <CliCommands name={component.name} type={componentType} />
            <div className="space-y-4">
              <p className="font-semibold text-lg tracking-tight">Code</p>
              <div className="relative">
                <DynamicRegistryCodeBlock
                  name={component.name}
                  registry={componentType}
                  fileType="registry:component"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
