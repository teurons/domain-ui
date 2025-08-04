import { Button } from "@workspace/shadverse/components/button";
import { FloatingPaths } from "@workspace/shadverse/components/kokonutui/background-paths";
import { cn } from "@workspace/shadverse/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { GridBackground } from "../grid-background";

export default function RightImage() {
  return (
    <div className="relative flex w-full flex-col items-center overflow-x-hidden px-5">
      <GridBackground maxWidthClass="max-w-7xl" />

      <FloatingPaths position={-1} color="text-cyan-500" />
      <FloatingPaths position={-2} color="text-blue-500" />

      <div className="relative relative isolate mx-auto mx-auto grid max-w-7xl grid-cols-1 px-4 pt-32 pb-24 sm:px-6 md:grid-cols-[max(50%,400px)_1fr] lg:px-8">
        <div className="space-y-8 sm:px-4">
          <div className="flex h-6 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-black/30 py-0.5 pr-3 pl-3 font-semibold text-white text-xs backdrop-blur">
            Preview
          </div>

          <span
            className={cn(
              "font-bold text-[#2F2E31] text-[min(88px,7vmax)] leading-[1.1] tracking-tighter",
              "isolate block mix-blend-color-burn"
            )}
          >
            Financial infrastructure to grow your revenue
          </span>

          <p className="text-base md:text-lg">
            Join the millions of companies that use Stripe to accept payments
            online and in person, embed financial services, power custom revenue
            models, and build a more profitable business.
          </p>

          <Button className="rounded-full">
            Request an invite <ArrowRightIcon />
          </Button>
        </div>

        <div className="absolute bottom-48 left-56 col-start-2 h-[580px] w-[920px] overflow-hidden rounded-2xl bg-white/30 shadow-2xl">
          <div className="mt-16 ml-56 size-full rounded-tl-lg bg-white" />
        </div>
        <div className="relative hidden h-full items-center justify-center md:flex">
          <Image
            src={"https://placehold.co/270x536"}
            alt="phone"
            width={270}
            height={536}
            className="relative object-contain"
            style={{
              filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.4))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
