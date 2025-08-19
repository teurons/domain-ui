import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import {
  Tab,
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import * as Twoslash from "fumadocs-twoslash/ui";
import { ComponentPreview } from "../component-preview";
import RegistryAllFiles from "../registry-all-files";
import RegistryCliCommands from "../registry-cli-commands";
import RegistryCodeBlock from "../registry-code-block";
import DynamicRegistryCodeBlock from "../registry-code-block-dynamic";
import GithubCodeBlock from "./github-code-block";
import { XEmbedClient } from "./x-embed-client";
import CodeDisplay from "./code-display";

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
    RegistryCodeBlock,
    DynamicRegistryCodeBlock,
    ComponentPreview,
    RegistryAllFiles,
    RegistryCliCommands,
    XEmbed: XEmbedClient,
    GithubCodeBlock,
    CodeDisplay,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;