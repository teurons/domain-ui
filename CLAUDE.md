# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Ultracite enforces strict type safety, accessibility standards, and consistent code quality for JavaScript/TypeScript projects using Biome's lightning-fast formatter and linter.

### Key Principles
- Zero configuration required
- Subsecond performance
- Maximum type safety
- AI-friendly code generation

### Before Writing Code
1. Analyze existing patterns in the codebase
2. Consider edge cases and error scenarios
3. Follow the rules below strictly
4. Validate accessibility requirements


## Logging

This project uses a custom logger utility instead of `console.log` statements. Always use the logger from `@/lib/logger`:

```typescript
import { info, warn, error, debug } from "@/lib/logger";

// Usage examples
info("User logged in successfully", { userId });
warn("Deprecated API endpoint used", { endpoint });
error("Failed to connect to database", errorObject);
debug("Debug information", { data });
```

- Set `NEXT_PUBLIC_APP_DEBUG=true` in `.env` to enable logging
- Set `NEXT_PUBLIC_LOG_LEVEL` to control log level (DEBUG, INFO, WARN, ERROR)
- NEVER use `console.log`, `console.error`, etc. directly - always use the logger

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

# Web app specific commands (from root)
pnpm web:dev    # Run only web app in dev mode
pnpm web:build  # Build only web app
pnpm web:start  # Start web app production server

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
  - Components are exported via `@workspace/shadverse/components/*`
  - Utilities via `@workspace/shadverse/lib/*`
  - Hooks via `@workspace/shadverse/hooks/*`
- `packages/eslint-config/` - Shared ESLint configuration
- `packages/typescript-config/` - Shared TypeScript configuration

### Import Patterns

- UI components: `import { Button } from "@workspace/shadverse/components/button"`
- Internal app imports: `import { something } from "@/..."`
- The `@workspace/*` prefix is used for workspace packages

### Key Configuration Files

- `turbo.json` - Defines build pipeline and task dependencies
- `pnpm-workspace.yaml` - Defines workspace structure
- Each package has its own `package.json` with workspace protocol references

## Common Tasks
- `npx ultracite init` - Initialize Ultracite in your project
- `npx ultracite format` - Format and fix code automatically
- `npx ultracite lint` - Check for issues without fixing

## Example: Error Handling
```typescript
// ✅ Good: Comprehensive error handling
try {
  const result = await fetchData();
  return { success: true, data: result };
} catch (error) {
  console.error('API call failed:', error);
  return { success: false, error: error.message };
}

// ❌ Bad: Swallowing errors
try {
  return await fetchData();
} catch (e) {
  console.log(e);
}
```
