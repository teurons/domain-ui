"use client";

import { RRChildPreview } from "@workspace/domain-ui-registry/components/domain-ui/responsive-resizable-preview";

export default function BasicDemo() {
  return (
    <RRChildPreview>
      <div className="@container">
        <div className="flex flex-col @2xl:bg-cyan-200 @2xs:bg-slate-100 @3xl:bg-blue-200 @3xs:bg-gray-100 @4xl:bg-indigo-200 @5xl:bg-purple-200 @6xl:bg-pink-200 @7xl:bg-rose-200 @lg:bg-green-200 @md:bg-yellow-200 @sm:bg-orange-200 @xl:bg-teal-200 @xs:bg-red-200 bg-gray-50 p-4 @2xl:dark:bg-cyan-300 @2xs:dark:bg-slate-700 @3xl:dark:bg-blue-300 @3xs:dark:bg-gray-700 @4xl:dark:bg-indigo-300 @5xl:dark:bg-purple-300 @6xl:dark:bg-pink-300 @7xl:dark:bg-rose-300 @lg:dark:bg-green-300 @md:dark:bg-yellow-300 @sm:dark:bg-orange-300 @xl:dark:bg-teal-300 @xs:dark:bg-red-300 dark:bg-gray-800">
          <h3 className="text-sm @3xs:text-base @2xs:text-lg @xs:text-xl @sm:text-2xl @md:text-3xl @lg:text-4xl @xl:text-5xl @2xl:text-6xl @3xl:text-7xl @4xl:text-8xl @5xl:text-9xl font-bold">
            Basic Preview
          </h3>
        </div>
      </div>
    </RRChildPreview>
  );
}
