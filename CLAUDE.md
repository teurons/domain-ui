# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Level Commands
```bash
# Install dependencies
pnpm install

# Run development server (all apps)
pnpm dev

# Build all apps
pnpm build

# Lint all packages
pnpm lint

# Format code
pnpm format

# Type checking (run in web app)
cd apps/web && pnpm typecheck
```

### Adding Shadcn UI Components
To add components from shadcn/ui, run at the root of the web app:
```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```
Components will be placed in `packages/ui/src/components/`

### Running Single App
```bash
# Run only the web app
cd apps/web && pnpm dev
```

## Architecture

This is a monorepo using:
- **pnpm workspaces** for package management
- **Turborepo** for build orchestration
- **Next.js 15** with App Router and Turbopack
- **Tailwind CSS v4** for styling
- **shadcn/ui** components in a shared UI package

### Directory Structure
- `apps/web/` - Next.js application
- `packages/ui/` - Shared UI components and utilities
  - Components are exported via `@workspace/ui/components/*`
  - Utilities via `@workspace/ui/lib/*`
  - Hooks via `@workspace/ui/hooks/*`
- `packages/eslint-config/` - Shared ESLint configuration
- `packages/typescript-config/` - Shared TypeScript configuration

### Import Patterns
- UI components: `import { Button } from "@workspace/ui/components/button"`
- Internal app imports: `import { something } from "@/..."`
- The `@workspace/*` prefix is used for workspace packages

### Key Configuration Files
- `turbo.json` - Defines build pipeline and task dependencies
- `pnpm-workspace.yaml` - Defines workspace structure
- Each package has its own `package.json` with workspace protocol references