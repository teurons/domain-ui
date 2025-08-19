"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/domain-ui-registry/components/ui/tabs";
import { useState } from "react";

interface DemoTabsProps {
  demo: ReactNode;
  code: string;
  title: string;
  description?: string;
}

export function DemoTabs({ demo, code, title, description }: DemoTabsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="mt-4">
          <div className="rounded-lg border bg-background p-0">
            {demo}
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="mt-4">
          <div className="rounded-lg border bg-muted/30">
            <pre className="overflow-x-auto p-4 text-sm">
              <code>{code}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}