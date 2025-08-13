import { cn } from "@workspace/shadverse/lib/utils";

export default function ComponentCard({
  toolbar,
  children,
  className,
}: {
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/item flex flex-col space-y-2 overflow-hidden",
        className
      )}
    >
      {toolbar && (
        <div className="bg-muted/30 px-2 py-1 opacity-0 transition-opacity group-hover/item:opacity-100">
          {toolbar}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
