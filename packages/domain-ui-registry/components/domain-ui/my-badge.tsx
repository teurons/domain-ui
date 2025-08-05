import { Badge } from "@workspace/domain-ui-registry/components/ui/badge";

interface ComponentProps {
  className?: string;
}

export default function Component({ className }: ComponentProps) {
  return (
    <Badge variant={"default"} className={className}>
      My Domain UI Free Badge
    </Badge>
  );
}
