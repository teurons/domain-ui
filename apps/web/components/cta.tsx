import { Button } from "@workspace/shadverse/components/button";

export default function Cta() {
  return (
    <div className="mt-16 text-center md:mt-20">
      <h2 className="mb-6 font-bold font-heading text-3xl/[1.1] text-foreground tracking-tight">
        Need a custom component?
      </h2>
      <Button asChild className="rounded-full">
        <a
          href="mailto:hello@domain-ui.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-primary-foreground">Contact us</span>
        </a>
      </Button>
    </div>
  );
}
