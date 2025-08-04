import { cn } from "@workspace/shadverse/lib/utils";
import { GridBackground } from "../grid-background";

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function MinimalGridFeatures({
  features,
}: {
  features: FeatureItem[];
}) {
  return (
    <div className="relative relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
      <GridBackground maxWidthClass="max-w-7xl" />
      {features.map((feature, index) => (
        <MinimalGridFeature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

function MinimalGridFeature({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) {
  return (
    <div
      className={cn(
        "group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      {index >= 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="relative z-10 mb-2 px-10 font-bold text-lg">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
        <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-10 text-neutral-600 text-sm dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
}
