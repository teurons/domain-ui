"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function BasicDemo() {
  return (
    <RRChildPreview>
      <div className="@container flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/50 p-8">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg @xs:text-xl @sm:text-2xl @md:text-3xl">
            Basic Preview
          </h3>
          <p className="text-muted-foreground text-sm @sm:text-base">
            Current size: <span className="font-mono">
              <span className="@xs:hidden">XS (&lt; 320px)</span>
              <span className="hidden @xs:inline @sm:hidden">SM (320px+)</span>
              <span className="hidden @sm:inline @md:hidden">MD (384px+)</span>
              <span className="hidden @md:inline @lg:hidden">LG (448px+)</span>
              <span className="hidden @lg:inline @xl:hidden">XL (512px+)</span>
              <span className="hidden @xl:inline">2XL (576px+)</span>
            </span>
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-red-500 @xs:bg-orange-500 @sm:bg-yellow-500 @md:bg-green-500 @lg:bg-blue-500 @xl:bg-purple-500"></div>
            <div className="hidden @xs:block w-3 h-3 rounded-full bg-orange-500 @sm:bg-yellow-500 @md:bg-green-500 @lg:bg-blue-500 @xl:bg-purple-500"></div>
            <div className="hidden @sm:block w-3 h-3 rounded-full bg-yellow-500 @md:bg-green-500 @lg:bg-blue-500 @xl:bg-purple-500"></div>
            <div className="hidden @md:block w-3 h-3 rounded-full bg-green-500 @lg:bg-blue-500 @xl:bg-purple-500"></div>
            <div className="hidden @lg:block w-3 h-3 rounded-full bg-blue-500 @xl:bg-purple-500"></div>
            <div className="hidden @xl:block w-3 h-3 rounded-full bg-purple-500"></div>
          </div>
        </div>
      </div>
    </RRChildPreview>
  );
}