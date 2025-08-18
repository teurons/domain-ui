---
description: "Comprehensive guide to shadcn/ui component architecture patterns and best practices"
argument-hint: "[component-name]"
---

# Shadcn Component Architecture Patterns

This command provides comprehensive context about shadcn/ui component structure patterns used in this project.

## 1. Component File Structure
- **One component file per feature** - Each component (accordion, alert-dialog, button, etc.) is in its own file
- **Compound components exported together** - Related sub-components are defined and exported from the same file
- **Client components by default** - Most interactive components include `"use client"` directive

## 2. Primitive Library Usage
- **Radix UI as foundation** - Complex components wrap Radix UI primitives (e.g., `AccordionPrimitive`, `AlertDialogPrimitive`)
- **Direct HTML for simple components** - Basic components like Card, Input use standard HTML elements
- **Slot pattern for polymorphism** - Components use `SlotPrimitive.Slot` for `asChild` prop support

## 3. Styling Patterns
- **cn utility for class merging** - All components use `cn()` from utils to merge Tailwind classes
- **CVA for variants** - Complex components use `class-variance-authority` for variant management
- **data-slot attributes** - Every component root has `data-slot="component-name"` for targeting
- **Consistent focus states** - `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **Consistent disabled states** - `disabled:pointer-events-none disabled:opacity-50`
- **Animation via data attributes** - `data-[state=open]:animate-in data-[state=closed]:animate-out`

## 4. Component Composition Patterns

### Primitive-based Components (Complex UI)
```typescript
function Component({ ...props }: React.ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root data-slot="component" {...props} />;
}
```

### HTML-based Components (Simple UI)
```typescript
function Component({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="component"
      className={cn("default-styles", className)}
      {...props}
    />
  );
}
```

### Variant-based Components
```typescript
const componentVariants = cva("base-styles", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" }
});

function Component({ className, variant, size, ...props }: 
  React.ComponentProps<"button"> & VariantProps<typeof componentVariants>) {
  return (
    <button
      data-slot="component"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

## 5. Naming Conventions
- **Component + Sub-part pattern**: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- **Action components**: `AlertDialogAction`, `AlertDialogCancel`, `CardAction`
- **Trigger components**: `AccordionTrigger`, `AlertDialogTrigger`
- **Portal components**: `AlertDialogPortal` for rendering outside DOM hierarchy

## 6. Type Patterns
- **Spread props with TypeScript**: `React.ComponentProps<typeof Element>` or `React.ComponentProps<"div">`
- **Intersection types for extensions**: Combining component props with variant props
- **No explicit interfaces**: Direct inline type definitions preferred

## 7. Export Strategy
- **Named exports only**: No default exports
- **Export variants separately**: `export { Button, buttonVariants }`
- **Export all sub-components**: All compound parts exported individually

## 8. Implementation Checklist

When creating a new shadcn-style component:

### ✅ File Setup
- [ ] Create file with lowercase-hyphen naming (e.g., `alert-dialog.tsx`)
- [ ] Add `"use client"` directive if component has interactivity
- [ ] Import required dependencies (`React`, `cn`, primitives, icons)

### ✅ Component Structure
- [ ] Add `data-slot="component-name"` to root element
- [ ] Use `cn()` utility for all className merging
- [ ] Spread `...props` after custom props
- [ ] Follow `{ className, ...props }` destructuring pattern

### ✅ Styling Implementation
- [ ] Apply consistent focus states: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- [ ] Apply consistent disabled states: `disabled:pointer-events-none disabled:opacity-50`
- [ ] Use data-state animations where appropriate
- [ ] Implement variants with CVA if needed

### ✅ TypeScript Integration
- [ ] Use `React.ComponentProps<typeof Primitive>` for primitive-based components
- [ ] Use `React.ComponentProps<"div">` for HTML-based components
- [ ] Combine with `VariantProps<typeof variants>` for variant components
- [ ] Avoid explicit interfaces - use inline types

### ✅ Export Strategy
- [ ] Use named exports only
- [ ] Export variant functions separately if applicable
- [ ] Export all compound components individually

## 9. Common Patterns Reference

### Complex Dialog Pattern
```typescript
// Root component (manages state)
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

// Trigger component
function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

// Content with portal and overlay
function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn("dialog-base-styles", className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
```

### Simple Component Pattern
```typescript
function Badge({ className, variant, ...props }: 
  React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div 
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)} 
      {...props} 
    />
  );
}
```

## 10. Project-Specific Context

- Components are located in `packages/shadverse/src/components/`
- Import utility: `import { cn } from "@workspace/shadverse/lib/utils"`
- Export pattern: Components exported via `@workspace/shadverse/components/*`
- Always run `pnpm lint` after creating components to ensure code quality

Use this reference when creating or modifying shadcn-style components to maintain consistency with the existing codebase architecture.