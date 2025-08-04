import { Pagination } from "./pagination";
import { DocsTitle, DocsDescription } from "fumadocs-ui/page";
import type { BlogConfiguration, BlogPost } from "./types";
import { slot } from "./shared";

export type PostListProps = {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  heading?: string;
  description?: string;
  basePath?: string;
  disablePagination?: boolean;
  configuration?: BlogConfiguration;
};

export function PostList({
  posts,
  currentPage,
  totalPages,
  heading = "Blog Posts",
  description = "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.",
  basePath = "/blog",
  disablePagination = false,
  configuration,
}: PostListProps) {
  // PostCard is now imported directly

  return (
    <>
      <section className="container relative bg-zinc-50/50 px-4 py-8 text-left lg:px-6 lg:py-12 dark:bg-zinc-900/50">
        {slot(configuration?.backgroundPattern, null)}

        <div className="text-center">
          <DocsTitle className="capitalize dark:text-white">
            {heading}
          </DocsTitle>
          <DocsDescription className="mt-3 mb-0 dark:text-gray-300">
            {description}
          </DocsDescription>
        </div>
      </section>

      <section className="container relative px-4 py-8 text-left lg:px-6 lg:py-12">
        {slot(configuration?.backgroundPattern, null)}
        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts
            .filter(
              (post): post is NonNullable<typeof post> => post !== undefined
            )
            .map((post) => {
              if (configuration?.PostCard) {
                return (
                  <configuration.PostCard
                    key={post.url}
                    post={post}
                    configuration={configuration}
                  />
                );
              }
              return null;
            })}
        </div>

        {!disablePagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={basePath}
            configuration={configuration}
          />
        )}
      </section>
    </>
  );
}
