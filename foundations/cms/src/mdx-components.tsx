import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import GithubCodeBlock from "./github-code-block";
import { XEmbedClient } from "./XEmbedClient";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";

import CodeDisplay from "./code-display";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),

    Tab,
    Tabs,
    Step,
    Steps,
    XEmbed: XEmbedClient,
    GithubCodeBlock,
    CodeDisplay,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
