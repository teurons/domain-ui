"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
    () => ["learner", "developer", "hacker", "builder", "entrepreneur"],
    []
  );

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
            <h1 className="max-w-3xl text-center font-regular text-5xl tracking-tighter md:text-8xl">
              <span className="text-spektr-cyan-50">
                Domain First UI Components
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

            <p className="max-w-3xl text-center text-foreground/90 text-xl leading-relaxed tracking-tight md:text-xl">
              Use-case driven components you can copy-paste for fintech,
              finance, KYC, trading, and more.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Link href="/docs" target="_blank">
              <Button size="lg" className="cursor-grab gap-4">
                <PuzzleIcon className="h-4 w-4" />
                Browse Components <ArrowUpRightIcon className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/rjvim/domain-ui" target="_blank">
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
