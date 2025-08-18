"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import { getBaseUrl } from "../lib/get-base-url";

interface RegistryCliCommandsProps {
  name: string;
  type: "free" | "pro";
}

export default function RegistryCliCommands({
  name,
  type,
}: RegistryCliCommandsProps) {
  const [packageManager, setPackageManager] = useState("pnpm");

  const baseUrl = getBaseUrl();
  const registryPath = type === "pro" ? "/r-pro" : "/r";
  const registryUrl = `${baseUrl}${registryPath}/${name}.json`;

  const commands = {
    pnpm: `pnpm dlx shadcn@latest add ${registryUrl}`,
    npm: `npx shadcn@latest add ${registryUrl}`,
    yarn: `npx shadcn@latest add ${registryUrl}`,
    bun: `bunx --bun shadcn@latest add ${registryUrl}`,
  };

  return (
    <div className="relative">
      <Tabs
        value={packageManager}
        onValueChange={(value) => {
          setPackageManager(value as "pnpm" | "npm" | "yarn" | "bun");
        }}
        className="rounded-md bg-secondary/50 p-2"
      >
        <TabsList className="rounded-none bg-secondary/50">
          <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          <TabsTrigger value="npm">npm</TabsTrigger>
          <TabsTrigger value="yarn">yarn</TabsTrigger>
          <TabsTrigger value="bun">bun</TabsTrigger>
        </TabsList>
        {Object.entries(commands).map(([pkg, command]) => (
          <TabsContent className="m-0 border-t" key={pkg} value={pkg}>
            <pre className="no-scrollbar overflow-auto px-2 py-3 font-mono text-xs">
              {command}
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
