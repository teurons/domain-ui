import { docsSource } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI("advanced", {
  indexes: [
    ...docsSource.getPages().map((page) => {
      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
        tag: "primitives",
      };
    }),
  ],
});
