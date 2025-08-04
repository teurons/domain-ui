import Link from "next/link";
import type { BlogPost } from "@foundations/cms/source";
import { Card } from "@workspace/shadverse/components/card";
import { ArrowRight } from "lucide-react";
import { GridBackground } from "@workspace/ui/grid-background";
import { Pagination } from "./pagination";

export type PostListProps = {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  heading?: string;
  description?: string;
  basePath?: string;
};

export function PostList({
  posts,
  currentPage,
  totalPages,
  heading = "Blog Posts",
  description = "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.",
  basePath = "/blog",
}: PostListProps) {
  return (
    <section className="relative flex w-full flex-col items-center overflow-x-hidden">
      <GridBackground maxWidthClass="max-w-7xl" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center space-y-16 px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mx-auto mb-6 text-pretty font-semibold text-3xl md:text-4xl lg:max-w-3xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts
            .filter(
              (post): post is NonNullable<typeof post> => post !== undefined
            )
            .map((post) => (
              <Card
                key={post.url}
                className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-wrap gap-3 text-muted-foreground text-xs uppercase tracking-wider md:gap-5 lg:gap-6">
                        {post.data.tags?.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <h3 className="font-semibold text-xl md:text-2xl lg:text-3xl">
                      <Link href={post.url} className="hover:underline">
                        {post.data.title}
                      </Link>
                    </h3>
                    <p className="mt-4 text-muted-foreground md:mt-5">
                      {post.data.description}
                    </p>
                    <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                      <span className="text-muted-foreground capitalize">
                        {post.data.author || "Anonymous"}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {new Date(post.data.date).toDateString()}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center space-x-2 md:mt-8">
                      <Link
                        href={post.url}
                        className="inline-flex items-center font-semibold hover:underline md:text-base"
                      >
                        <span>Read more</span>
                        <ArrowRight className="ml-2 size-4 transition-transform" />
                      </Link>
                    </div>
                  </div>
                  <div className="order-first sm:order-last sm:col-span-5">
                    <Link href={post.url} className="block">
                      <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                        <img
                          src={
                            post.data.image ||
                            "https://shadcnblocks.com/images/block/placeholder-2.svg"
                          }
                          alt={post.data.title}
                          className="fade-in h-full w-full object-cover transition-opacity duration-200 hover:opacity-70"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
        />
      </div>
    </section>
  );
}
