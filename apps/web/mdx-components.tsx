import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import GithubCodeBlock from "@/components/blog/github-code-block";
import RegistryCodeBlock from "@workspace/ui/components/registry-code-block";
import DynamicRegistryCodeBlock from "@workspace/ui/components/registry-code-block-dynamic";
import { ComponentPreview } from "@workspace/ui/components/component-preview";
import RegistryAllFiles from "@workspace/ui/components/registry-all-files";
import RegistryCliCommands from "@workspace/ui/components/registry-cli-commands";
import { XEmbedClient } from "@/components/blog/XEmbedClient";
import {
  Tab,
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import CodeDisplay from "@/components/blog/code-display";
import * as Twoslash from "fumadocs-twoslash/ui";

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
    TabsTrigger,
    TabsList,
    TabsContent,
    Step,
    Steps,
    XEmbed: XEmbedClient,
    GithubCodeBlock,
    RegistryCodeBlock,
    DynamicRegistryCodeBlock,
    ComponentPreview,
    RegistryAllFiles,
    RegistryCliCommands,
    CodeDisplay,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
