"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  CodeBlock as BaseCodeBlock,
  Pre,
  type CodeBlockProps as BaseCodeBlockProps,
} from "fumadocs-ui/components/codeblock";
import { highlight } from "fumadocs-core/highlight";
import { transformerMetaHighlight } from "@shikijs/transformers";
import type { FileNode } from "./registry-file-tree";

function getLanguageFromPath(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    default:
      return extension || "text";
  }
}

interface RegistrySingleFileProps {
  file: FileNode;
  wrapper?: BaseCodeBlockProps;
  url: string;
}

export function RegistrySingleFile({
  file,
  wrapper,
  url,
}: RegistrySingleFileProps) {
  const [highlightedCode, setHighlightedCode] = useState<ReactElement | null>(
    null
  );

  useEffect(() => {
    if (!file.content) {
      return;
    }

    const highlightCode = async () => {
      const lang = getLanguageFromPath(file.path);
      const content = file.content || "";
      const rendered = await highlight(content, {
        lang,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        components: {
          pre: Pre,
        },
        transformers: [transformerMetaHighlight()],
      });

      const codeBlock = (
        <BaseCodeBlock
          {...wrapper}
          data-registry-url={url}
          data-file={file.path}
          data-file-type={file.registryType}
        >
          {rendered}
        </BaseCodeBlock>
      );

      setHighlightedCode(codeBlock);
    };

    highlightCode();
  }, [file, wrapper, url]);

  return (
    highlightedCode || (
      <BaseCodeBlock {...wrapper}>
        <Pre>Loading...</Pre>
      </BaseCodeBlock>
    )
  );
}
