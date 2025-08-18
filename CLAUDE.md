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

### ⚠️ CRITICAL: Development Rules
- **NEVER run build commands (`pnpm build`, `pnpm web:build`, etc.) unless explicitly asked by the user**
- **NEVER run dev server commands (`pnpm dev`, `next dev`, etc.) unless explicitly asked by the user**
- **ALWAYS run `pnpm lint` after making code changes**
- **NEVER use `console.log`, `console.error`, etc. - ALWAYS use the logger from `@/lib/logger`**
- **NEVER modify shadverse components directly - pass custom styles through className props instead**

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

## Essential Commands for Coding

Only run these during regular development:
- `pnpm lint` - Check for linting issues (ALWAYS run after changes)
- `pnpm format` - Format code
- `pnpm dlx shadcn@latest add <component-name> -c apps/web` - Add shadcn components

Use `/dev-commands` for complete development command reference.

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

## Example: Error Handling

```typescript
import { error } from "@/lib/logger";

// ✅ Good: Comprehensive error handling
try {
  const result = await fetchData();
  return { success: true, data: result };
} catch (err) {
  error("API call failed:", err);
  return { success: false, error: err.message };
}

// ❌ Bad: Swallowing errors
try {
  return await fetchData();
} catch (e) {
  console.log(e); // Never use console directly!
}
```
