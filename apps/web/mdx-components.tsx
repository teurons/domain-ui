import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import GithubCodeBlock from "@/components/blog/github-code-block";
import RegistryCodeBlock from "@workspace/ui/components/registry-code-block";
import DynamicRegistryCodeBlock from "@workspace/ui/components/registry-code-block-dynamic";
import { XEmbedClient } from "@/components/blog/XEmbedClient";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import CodeDisplay from "@/components/blog/code-display";
import * as Twoslash from "fumadocs-twoslash/ui";
// Import components directly
import { IndianPassport } from "@workspace/domain-ui-registry/components/domain-ui/indian-passport";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...Twoslash,
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
    RegistryCodeBlock,
    DynamicRegistryCodeBlock,
    CodeDisplay,
    IndianPassport,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
