import React from "react";
import { cn } from "@workspace/domain-ui-registry/lib/utils";
import { Input } from "@workspace/domain-ui-registry/components/ui/input";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";
import { XIcon } from "lucide-react";
import { useRegexInput, type RegexInputConfig } from "@workspace/domain-ui-registry/hooks/use-regex-input";

export interface RegexInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  config: RegexInputConfig;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  onValidationChange?: (isValid: boolean) => void;
  onValueChange?: (value: string) => void;
  showClearButton?: boolean;
}

export function RegexInput({
  config,
  label,
  helperText,
  errorMessage,
  onValidationChange,
  onValueChange,
  showClearButton = true,
  className,
  defaultValue,
  ref,
  ...props
}: RegexInputProps) {
  const {
    inputValue,
    displayValue,
    isValid,
    handleChange,
    clearInput,
  } = useRegexInput({
    initialValue: defaultValue as string,
    config,
    onValidationChange,
    onValueChange,
  });

  const hasError = errorMessage && inputValue.length > 0 && !isValid;
  const showClear = showClearButton && inputValue.length > 0;

  return (
    <div className="grid gap-2 w-full">
      {label && (
        <Label htmlFor={props.id} className={cn(hasError && "text-destructive")}>
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          {...props}
          value={displayValue}
          onChange={handleChange}
          maxLength={config.maxLength}
          className={cn(
            showClear && "pr-9",
            hasError && "border-destructive focus-visible:border-destructive",
            className
          )}
          aria-invalid={hasError ? "true" : undefined}
        />
        {showClear && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-sm"
          >
            <XIcon className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>
      {(helperText || hasError) && (
        <p className={cn(
          "text-sm",
          hasError ? "text-destructive" : "text-muted-foreground"
        )}>
          {hasError ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
}