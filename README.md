# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/shadverse/components/button";
```

pnpm dlx shadcn add "http://localhost:3000/?token=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJzUl9LN1pndkw5Y2FFdnRPLTFLemMiLCJpYXQiOjE3NTQwNDAyMjIsImV4cCI6MTc1NDEyNjYyMn0.2Nbpo3d6xcqFMxRt49aznh_YTDd1tp7BInsTUkXYgcw"

pnpm dlx shadcn@latest add "http://localhost:3000/r-pro/page-title.json?token=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJzUl9LN1pndkw5Y2FFdnRPLTFLemMiLCJpYXQiOjE3NTQwNDAyMjIsImV4cCI6MTc1NDEyNjYyMn0.2Nbpo3d6xcqFMxRt49aznh_YTDd1tp7BInsTUkXYgcw" --overwrite

DOMAINUI*SANDBOX*-FD97539B-298F-417D-B7EF-F677BB8DE60C

<RegisterItemCodeDisplay url={url} />

- Internally - First fetch the .json file, particular "files", and store them in state.
- Have the following components clearly defined:
  - FilePath: Accepts filepath, Just display file path
  - FileTree: Accepts list of files from above. Compute structure, render file tree. Keep the entire path. It has toolbar on top, which display number of files and collaps/open icon.
  - FileContent: Accepts file content, Just display file content
- RegisterItemCodeDisplay, now:
  - If there is one file, just use FilePath + FileContent
  - If there are multiple files, pick first file to show content. Render FileTree on left, Render FilePath + FileContent on right.
  - When user changes file selection, update FileContent and FilePath in React 19 friendly context, and use it.
