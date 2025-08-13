"use client";

import { useConfig } from "@/hooks/use-config";
import CopyButton from "@/components/copy-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/shadverse/components/tabs";

export default function CliCommands({ name }: { name: string }) {
  const [config, setConfig] = useConfig();
  const packageManager = config.packageManager || "pnpm";

  const commands = {
    pnpm: `pnpm dlx shadcn@latest add https://originui.com/r/${name}.json`,
    npm: `npx shadcn@latest add https://originui.com/r/${name}.json`,
    yarn: `npx shadcn@latest add https://originui.com/r/${name}.json`,
    bun: `bunx --bun shadcn@latest add https://originui.com/r/${name}.json`,
  };

  return (
    <div className="relative">
      <Tabs
        value={packageManager}
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
          });
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
      <CopyButton
        componentSource={commands[packageManager as keyof typeof commands]}
        className="top-2"
      />
    </div>
  );
}
