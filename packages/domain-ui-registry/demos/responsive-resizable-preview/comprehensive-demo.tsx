"use client";

import BasicDemo from "./basic-demo";
import MinimalDemo from "./minimal-demo";
import ContainerQueryDemo from "./container-query-demo";
import IFrameDemo from "./iframe-demo";
import { DemoTabs } from "./demo-tabs";

const basicCode = `"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function BasicDemo() {
  return (
    <RRChildPreview>
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/50 p-8">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold">Basic Preview</h3>
          <p className="text-muted-foreground text-sm">
            Resize to see responsive behavior
          </p>
        </div>
      </div>
    </RRChildPreview>
  );
}`;

const minimalCode = `"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";
import StackCard from "./stack-card";

export default function MinimalDemo() {
  return (
    <RRChildPreview
      config={{
        showToolbar: false,
        showScale: false,
        showLabels: false,
      }}
    >
      <StackCard />
    </RRChildPreview>
  );
}`;

const containerQueryCode = `"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

const ContainerQueryCard = () => {
  return (
    <div className="@container">
      <div className="flex flex-col @xs:bg-red-200 @sm:bg-orange-200 @md:bg-yellow-200 @lg:bg-green-200 @xl:bg-teal-200 @2xl:bg-cyan-200 bg-slate-200 p-4">
        <div className="flex @xs:flex-row flex-col @xs:items-center @xs:justify-between gap-2">
          <div className="h-8 w-2/3 rounded bg-gray-500 font-bold @lg:text-3xl @md:text-2xl @sm:text-xl text-base" />
          <div className="h-6 w-1/4 rounded bg-gray-300 text-xs" />
        </div>
        <div className="mt-4 grid @xs:grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4 grid-cols-1 gap-4">
          {/* Grid items */}
        </div>
      </div>
    </div>
  );
};

export default function ContainerQueryDemo() {
  return (
    <RRChildPreview>
      <ContainerQueryCard />
    </RRChildPreview>
  );
}`;

const iframeCode = `"use client";

import { RRIFramePreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function IFrameDemo() {
  return (
    <RRIFramePreview
      srcUrl="/demo/responsive-resizable-preview"
      height={500}
      config={{
        darkMode: false,
        showToolbar: true,
        showScale: true,
        showLabels: true,
      }}
    />
  );
}`;

export default function ComprehensiveDemo() {
  return (
    <div className="space-y-12">
      <DemoTabs
        demo={<BasicDemo />}
        code={basicCode}
        title="Basic Usage"
        description="Simple responsive preview with default settings."
      />

      <DemoTabs
        demo={<MinimalDemo />}
        code={minimalCode}
        title="Minimal Configuration"
        description="Hidden toolbar, scale, and labels for a clean preview."
      />

      <DemoTabs
        demo={<ContainerQueryDemo />}
        code={containerQueryCode}
        title="Container Queries"
        description="Preview components that use CSS container queries for responsive design."
      />

      <DemoTabs
        demo={<IFrameDemo />}
        code={iframeCode}
        title="IFrame Preview"
        description="Preview external URLs or isolated pages in an iframe."
      />
    </div>
  );
}