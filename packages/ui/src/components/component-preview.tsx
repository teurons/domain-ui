"use client";

import type { ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import { ChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-preview/index";

interface ComponentPreviewProps {
  demo: ReactNode;
  children?: ReactNode; // This will be the include directive
  className?: string;
  minHeight?: string;
}

export function ComponentPreview({
  demo,
  children, // This is the include directive
  className = "flex min-h-[300px] w-full items-center justify-center border bg-background p-8",
  minHeight = "300px",
}: ComponentPreviewProps) {
  return (
    <Tabs
      defaultValue="preview"
      className="not-prose !rounded-t-xl rounded-none"
    >
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="m-0 p-0">
        <ChildPreview
          config={{
            showToolbar: false,
            showScale: false,
            showLabels: false,
          }}
        >
          <div className={className} style={{ minHeight }}>
            {demo}
          </div>
        </ChildPreview>
      </TabsContent>

      <TabsContent value="code" className="m-0 p-0">
        {children ? (
          children
        ) : (
          <div className="p-4 text-muted-foreground">Code not provided</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
