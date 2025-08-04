import { Button } from "@workspace/shadverse/components/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  relatedLinks?: Array<{
    title: string;
    description: string;
    href: string;
  }>;
}

export default function FeatureCard({
  title = "Accept and optimise payments, globally",
  description = "Increase authorisation rates, optimise your checkout conversion, and offer local payment methods in every market.",
  ctaText = "Start with Payments",
  relatedLinks = [
    {
      title: "Tax",
      description: "for automating sales tax and VAT",
      href: "#",
    },
    {
      title: "Radar",
      description: "for fraud prevention and management",
      href: "#",
    },
    {
      title: "Terminal",
      description: "for custom in-person payments",
      href: "#",
    },
  ],
}: FeatureCardProps) {
  return (
    <div className="flex max-w-xl flex-col space-y-4 p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="font-medium text-slate-800 text-xl">Payments</span>
      </div>

      <h2 className="font-bold text-5xl text-slate-900 leading-tight">
        {title}
      </h2>

      <p className="text-slate-600 text-xl leading-relaxed">{description}</p>

      <Button>
        {ctaText} <ChevronRight className="h-5 w-5" />
      </Button>

      {relatedLinks && relatedLinks.length > 0 && (
        <div>
          <h3 className="mb-4 font-bold text-slate-800 text-xl">See also</h3>
          <div className="space-y-3">
            {relatedLinks.map((link, _index) => (
              <div key={link.title} className="flex">
                <Link
                  href={link.href}
                  className="font-medium text-indigo-500 text-xl hover:text-indigo-600"
                >
                  {link.title}
                </Link>
                <span className="ml-1 text-slate-600 text-xl">
                  {` ${link.description}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
