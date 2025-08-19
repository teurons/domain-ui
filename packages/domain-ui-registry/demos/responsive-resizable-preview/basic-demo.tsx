"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function BasicDemo() {
  return (
    <RRChildPreview>
      <div className="@container">
        <div className="flex min-h-[300px] flex-col items-center justify-center @2xl:bg-cyan-200 @2xs:bg-slate-100 @3xl:bg-blue-200 @3xs:bg-gray-100 @4xl:bg-indigo-200 @5xl:bg-purple-200 @6xl:bg-pink-200 @7xl:bg-rose-200 @lg:bg-green-200 @md:bg-yellow-200 @sm:bg-orange-200 @xl:bg-teal-200 @xs:bg-red-200 bg-gray-50 p-4 @2xl:dark:bg-cyan-300 @2xs:dark:bg-slate-700 @3xl:dark:bg-blue-300 @3xs:dark:bg-gray-700 @4xl:dark:bg-indigo-300 @5xl:dark:bg-purple-300 @6xl:dark:bg-pink-300 @7xl:dark:bg-rose-300 @lg:dark:bg-green-300 @md:dark:bg-yellow-300 @sm:dark:bg-orange-300 @xl:dark:bg-teal-300 @xs:dark:bg-red-300 dark:bg-gray-800">
          <h3 className="font-bold @2xl:text-6xl @2xs:text-lg @3xl:text-7xl @3xs:text-base @4xl:text-8xl @5xl:text-9xl @lg:text-4xl @md:text-3xl @sm:text-2xl @xl:text-5xl @xs:text-xl text-sm">
            Basic Preview
          </h3>
          <p className="mt-4 text-center text-sm @sm:text-base @md:text-lg font-mono">
            Current size: 
            <span className="font-semibold ml-1">
              <span className="@3xs:hidden">Base (&lt; 256px)</span>
              <span className="hidden @3xs:inline @2xs:hidden">3XS (256px+)</span>
              <span className="hidden @2xs:inline @xs:hidden">2XS (288px+)</span>
              <span className="hidden @xs:inline @sm:hidden">XS (320px+)</span>
              <span className="hidden @sm:inline @md:hidden">SM (384px+)</span>
              <span className="hidden @md:inline @lg:hidden">MD (448px+)</span>
              <span className="hidden @lg:inline @xl:hidden">LG (512px+)</span>
              <span className="hidden @xl:inline @2xl:hidden">XL (576px+)</span>
              <span className="hidden @2xl:inline @3xl:hidden">2XL (672px+)</span>
              <span className="hidden @3xl:inline @4xl:hidden">3XL (768px+)</span>
              <span className="hidden @4xl:inline @5xl:hidden">4XL (896px+)</span>
              <span className="hidden @5xl:inline @6xl:hidden">5XL (1024px+)</span>
              <span className="hidden @6xl:inline @7xl:hidden">6XL (1152px+)</span>
              <span className="hidden @7xl:inline">7XL (1280px+)</span>
            </span>
          </p>
        </div>
      </div>
    </RRChildPreview>
  );
}
