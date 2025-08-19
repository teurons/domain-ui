"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function BasicDemo() {
  return (
    <RRChildPreview>
      <div className="@container flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/50 p-8">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-xs @3xs:text-sm @2xs:text-base @xs:text-lg @sm:text-xl @md:text-2xl @lg:text-3xl @xl:text-4xl @2xl:text-5xl @3xl:text-6xl @4xl:text-7xl @5xl:text-8xl @6xl:text-9xl">
            Basic Preview
          </h3>
          <p className="text-muted-foreground text-xs @3xs:text-xs @2xs:text-xs @xs:text-sm @sm:text-base @md:text-lg @lg:text-xl @xl:text-2xl @2xl:text-3xl">
            Current size: <span className="font-mono">
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
          <div className="flex justify-center gap-1 mt-4 flex-wrap">
            <div className="w-2 h-2 @3xs:w-2 @3xs:h-2 rounded-full bg-gray-300 @3xs:bg-gray-400 @2xs:bg-slate-500 @xs:bg-red-500 @sm:bg-orange-500 @md:bg-yellow-500 @lg:bg-green-500 @xl:bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @3xs:block w-2 h-2 rounded-full bg-gray-400 @2xs:bg-slate-500 @xs:bg-red-500 @sm:bg-orange-500 @md:bg-yellow-500 @lg:bg-green-500 @xl:bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @2xs:block w-2 h-2 rounded-full bg-slate-500 @xs:bg-red-500 @sm:bg-orange-500 @md:bg-yellow-500 @lg:bg-green-500 @xl:bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @xs:block w-3 h-3 rounded-full bg-red-500 @sm:bg-orange-500 @md:bg-yellow-500 @lg:bg-green-500 @xl:bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @sm:block w-3 h-3 rounded-full bg-orange-500 @md:bg-yellow-500 @lg:bg-green-500 @xl:bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @md:block w-3 h-3 rounded-full bg-yellow-500 @lg:bg-green-500 @xl:bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @lg:block w-3 h-3 rounded-full bg-green-500 @xl:bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @xl:block w-3 h-3 rounded-full bg-blue-500 @2xl:bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @2xl:block w-3 h-3 rounded-full bg-purple-500 @3xl:bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @3xl:block w-3 h-3 rounded-full bg-pink-500 @4xl:bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @4xl:block w-3 h-3 rounded-full bg-indigo-500 @5xl:bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @5xl:block w-3 h-3 rounded-full bg-cyan-500 @6xl:bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @6xl:block w-3 h-3 rounded-full bg-teal-500 @7xl:bg-emerald-500"></div>
            <div className="hidden @7xl:block w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </div>
    </RRChildPreview>
  );
}