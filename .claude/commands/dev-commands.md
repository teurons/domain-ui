---
description: "Development commands and project setup reference"
argument-hint: ""
---

# Development Commands Reference

## Root Level Commands

```bash
# Install dependencies
pnpm install

# Run development server (all apps) - ONLY when asked by user
pnpm dev

# Build all apps - ONLY when asked by user
pnpm build

# Lint all packages - ALWAYS run after changes
pnpm lint

# Format code
pnpm format

# Web app specific commands (from root)
pnpm web:dev    # Run only web app in dev mode - ONLY when asked
pnpm web:build  # Build only web app - ONLY when asked
pnpm web:start  # Start web app production server - ONLY when asked

# Type checking (run in web app)
cd apps/web && pnpm typecheck
```

## Adding Shadcn UI Components

To add components from shadcn/ui, run at the root of the web app:

```bash
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

Components will be placed in `packages/ui/src/components/`

## Running Single App

```bash
# Run only the web app - ONLY when asked by user
cd apps/web && pnpm dev
```

## Common Ultracite Tasks
- `npx ultracite init` - Initialize Ultracite in your project
- `npx ultracite format` - Format and fix code automatically
- `npx ultracite lint` - Check for issues without fixing

## Import Organization

```bash
# Organize imports in packages/ui
pnpm organize-imports

# Or run directly with npx
npx organize-imports-cli packages/ui/src/**/*.{ts,tsx}
```

This command:
- Removes unused imports (using TypeScript's language service)
- Sorts and organizes imports according to convention
- Works across entire directories

**Note**: After running organize-imports, you may need to run `pnpm format` to fix any indentation issues.