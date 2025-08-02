"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
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
    <div className="w-full grid-magicpattern">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Announcement>
              <AnnouncementTag>Latest</AnnouncementTag>
              <Link href="blog/solution/setup-blog-with-fuma-docs">
                <AnnouncementTitle>
                  Setup a Blog using FumaDocs
                  <ArrowUpRightIcon
                    size={16}
                    className="shrink-0 text-muted-foreground"
                  />
                </AnnouncementTitle>
              </Link>
            </Announcement>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">I am Rajiv</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
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

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Welcome to domain-ui - This is where I document my work on open
              source projects, company and articulate thoughts and ideas.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Link href="https://x.com/rjv_im" target="_blank">
              <Button size="lg" className="gap-4 cursor-grab" variant="outline">
                Let's Connect <SocialIcons.x className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="blog" target="_blank">
              <Button size="lg" className="gap-4">
                View Posts <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
