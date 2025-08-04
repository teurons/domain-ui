import React from "react";
import Link from "next/link";
import { getPostsBySeries } from "./utils";
import { BookOpen } from "lucide-react";
import type { BlogConfiguration } from "./types";
import { slot } from "./shared";

interface SeriesListProps {
  seriesSlug: string;
  configuration?: BlogConfiguration;
  posts?: any[];
  getSortedByDatePosts?: any;
  getSeriesBySlug: (slug: string) => any;
}

export function SeriesList({
  seriesSlug,
  configuration = {},
  posts = [],
  getSeriesBySlug,
}: SeriesListProps) {
  const seriesInfo = getSeriesBySlug(seriesSlug);
  const seriesPosts = posts
    .filter((post) => post.data.series === seriesSlug)
    .sort((a, b) => {
      return a.data.seriesPart - b.data.seriesPart;
    });

  return (
    <div className="container px-4 py-8 lg:px-6 lg:py-12">
      {slot(configuration?.backgroundPattern, null)}
      <div className="relative">
        <div className="mb-8 flex flex-col items-start gap-8 md:flex-row md:items-center">
          {configuration.Book && (
            <configuration.Book
              color="#3b82f6"
              depth={6}
              width={150}
              illustration={
                <div className="flex h-full w-full items-center justify-center p-4">
                  <BookOpen size={32} className="text-white" />
                </div>
              }
            >
              <div className="mb-2 grid gap-2 p-3">
                <h3 className="font-semibold text-sm">{seriesInfo.label}</h3>
                <div className="text-xs">{posts.length} Parts</div>
              </div>
            </configuration.Book>
          )}
          <div className="flex flex-col justify-center">
            <h1 className="mb-3 font-bold text-4xl text-gray-900 leading-tight dark:text-white">
              {seriesInfo.label}
            </h1>
            <p className="text-gray-600 text-lg dark:text-gray-400">
              {seriesInfo.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {seriesPosts.map((post) => (
            <div
              key={post.url}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {post.data.seriesPart || ""}
                </div>
                <div className="flex-1">
                  <Link href={post.url}>
                    <h2 className="mb-2 font-semibold text-gray-900 text-xl hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                      {post.data.title}
                    </h2>
                  </Link>
                  <p className="mb-3 text-gray-600 dark:text-gray-400">
                    {post.data.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm dark:text-gray-400">
                    <span>
                      {post.data.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    {post.data.tags && post.data.tags.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <div className="flex flex-wrap gap-2">
                          {post.data.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
