"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MoveRight, PuzzleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/shadverse/components/button";
import { Icons } from "./icons";
import { SocialIcons } from "@workspace/ui/components/social-icons";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@workspace/shadverse/announcement";
import { ArrowUpRightIcon } from "lucide-react";

export default function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["fintech", "trading", "banking", "payments", "compliance"],
    []
  );
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: false, amount: 0.3 });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="grid-magicpattern w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div>
            <Announcement>
              <AnnouncementTag>domain-ui</AnnouncementTag>
              <AnnouncementTitle>
                use with shadcn/cli or copy paste
              </AnnouncementTitle>
            </Announcement>
          </div>
          <div className="flex flex-col gap-4">
            <h1
              ref={titleRef}
              className="max-w-3xl p-1 text-center font-regular text-6xl tracking-tighter md:text-8xl"
            >
              <span className="text-spektr-cyan-50">
                <span className="relative inline-block">
                  {["D", "o", "m", "a", "i", "n"].map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: isInView ? 1 : 0.7 }}
                      transition={{
                        duration: 0.1,
                        delay: isInView ? index * 0.15 : 0,
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  <motion.span
                    className="absolute bottom-0 left-0 h-1 bg-current opacity-70 md:h-1"
                    initial={{ width: 0 }}
                    animate={{ width: isInView ? "100%" : 0 }}
                    transition={{ duration: 1.5, delay: isInView ? 0 : 0 }}
                  />
                </span>{" "}
                <span className="opacity-80">First</span>{" "}
                <span className="relative inline-block">
                  {["U", "I"].map((letter, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: isInView ? 1 : 0.7 }}
                      transition={{
                        duration: 0.1,
                        delay: isInView ? 1.5 + index * 0.15 : 0,
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  <motion.span
                    className="absolute bottom-0 left-0 h-1 bg-current opacity-70 md:h-1"
                    initial={{ width: 0 }}
                    animate={{ width: isInView ? "100%" : 0 }}
                    transition={{ duration: 0.5, delay: isInView ? 1.5 : 0 }}
                  />
                </span>{" "}
                <span className="opacity-80">Components</span>
              </span>
              <span className="relative flex hidden w-full justify-center overflow-hidden text-center md:pt-1 md:pb-4">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="max-w-2xl text-center text-foreground/90 text-lg leading-relaxed tracking-tight md:text-xl">
              Production-ready React components for fintech, trading, KYC, and
              financial applications. Copy, paste, and ship faster.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Link href="/primitives/docs">
              <Button size="lg" className="cursor-grab gap-4">
                <PuzzleIcon className="h-4 w-4" />
                Browse Components <ArrowUpRightIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/teurons/domain-ui" target="_blank">
              <Button size="lg" className="gap-4" variant={"outline"}>
                <SocialIcons.github className="h-4 w-4" />
                Github <MoveRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
