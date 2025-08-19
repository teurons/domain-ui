"use client";

import type React from "react";

interface CodeDisplayProps {
  component: React.ReactNode;
  children: React.ReactNode;
}

export default function CodeDisplay({ component, children }: CodeDisplayProps) {
  return (
    <div className="my-6 grid grid-cols-1 gap-6 overflow-hidden md:grid-cols-2">
      <div className="w-full overflow-hidden">{children}</div>
      <div className="my-6 flex w-full items-center justify-center rounded-lg border bg-gray-50 dark:bg-gray-900">
        {component}
      </div>
    </div>
  );
}