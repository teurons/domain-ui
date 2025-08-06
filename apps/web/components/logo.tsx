"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 28, height = 28, className }: LogoProps) {
  const { resolvedTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  console.log("Theme data:", { resolvedTheme, theme, systemTheme });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} className={className} />;
  }

  if (resolvedTheme === "dark") {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M320 120C320 81.3401 288.66 50 250 50L80 50L80 130L320 130L320 120Z"
          fill="#F6F6F6"
        />
        <path d="M80 130L80 350L160 350L160 130L80 130Z" fill="#BCBDC1" />
        <path
          d="M240 350L240 50L250 50C288.66 50 320 81.3401 320 120L320 280C320 318.66 288.66 350 250 350L240 350Z"
          fill="#818286"
        />
        <path d="M200 350L200 270L240 270L240 350L200 350Z" fill="#535456" />
        <path
          d="M320 280C320 318.66 288.66 350 250 350L160 350L160 270L320 270L320 280Z"
          fill="#949599"
        />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M320 120C320 81.3401 288.66 50 250 50L80 50L80 130L320 130L320 120Z"
        fill="#212123"
      />
      <path d="M80 130L80 350L160 350L160 130L80 130Z" fill="#A4A5A9" />
      <path
        d="M240 350L240 50L250 50C288.66 50 320 81.3401 320 120L320 280C320 318.66 288.66 350 250 350L240 350Z"
        fill="#535456"
      />
      <path d="M200 350L200 270L240 270L240 350L200 350Z" fill="#535456" />
      <path
        d="M320 280C320 318.66 288.66 350 250 350L160 350L160 270L320 270L320 280Z"
        fill="#818286"
      />
    </svg>
  );
}
