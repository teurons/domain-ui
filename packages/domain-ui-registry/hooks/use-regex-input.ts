import { useState, useCallback, useEffect, useMemo } from "react";
import regexpTree from 'regexp-tree';
const { parse } = regexpTree;

export interface RegexInputConfig {
  pattern: RegExp;
  maxLength: number;
  transform?: (value: string) => string;
  formatDisplay?: (value: string) => string;
}

export interface UseRegexInputProps {
  initialValue?: string;
  config: RegexInputConfig;
  onValidationChange?: (isValid: boolean) => void;
  onValueChange?: (value: string) => void;
}

// Helper function to expand character ranges like A-Z, 0-9
const expandCharacterRange = (from: string, to: string): string => {
  const start = from.charCodeAt(0);
  const end = to.charCodeAt(0);
  let result = '';
  
  for (let i = start; i <= end; i++) {
    result += String.fromCharCode(i);
  }
  
  return result;
};

// Helper function to extract allowed characters from character class
const extractAllowedChars = (expressions: any[]): string => {
  let allowed = '';
  
  for (const expr of expressions) {
    if (expr.type === 'ClassRange') {
      allowed += expandCharacterRange(expr.from.symbol, expr.to.symbol);
    } else if (expr.type === 'Char') {
      allowed += expr.symbol || expr.value || '';
    }
  }
  
  return allowed;
};

// Parse regex AST to get position-based rules using regexp-tree
const parseRegexForPositionRules = (pattern: RegExp, maxLength: number) => {
  const rules: Array<{ position: number; allowedChars: string }> = [];
  
  try {
    const ast = parse(pattern);
    
    const processExpression = (expr: any, position: number): number => {
      if (expr.type === 'Repetition') {
        const repetitions = expr.quantifier?.from || 1;
        let allowedChars = '';
        
        if (expr.expression.type === 'CharacterClass') {
          allowedChars = extractAllowedChars(expr.expression.expressions);
        } else if (expr.expression.type === 'Char') {
          allowedChars = expr.expression.symbol || expr.expression.value || '';
        } else if (expr.expression.type === 'Meta' && expr.expression.kind === 'd') {
          allowedChars = '0123456789';
        } else if (expr.expression.type === 'Meta' && expr.expression.kind === 'w') {
          allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        }
        
        // Apply the rule to multiple positions based on quantifier
        for (let i = 0; i < repetitions && position < maxLength; i++) {
          rules.push({ position, allowedChars });
          position++;
        }
        
        return position;
      } else if (expr.type === 'CharacterClass') {
        const allowedChars = extractAllowedChars(expr.expressions);
        rules.push({ position, allowedChars });
        return position + 1;
      } else if (expr.type === 'Char') {
        const allowedChars = expr.symbol || expr.value || '';
        rules.push({ position, allowedChars });
        return position + 1;
      } else if (expr.type === 'Meta') {
        let allowedChars = '';
        if (expr.kind === 'd') allowedChars = '0123456789';
        else if (expr.kind === 'w') allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        else if (expr.kind === 's') allowedChars = ' \t\n\r\f\v';
        
        rules.push({ position, allowedChars });
        return position + 1;
      }
      
      return position;
    };
    
    if (ast.body?.type === 'Alternative') {
      let currentPosition = 0;
      
      for (const expr of ast.body.expressions) {
        currentPosition = processExpression(expr, currentPosition);
      }
    } else if (ast.body?.expressions) {
      let currentPosition = 0;
      
      for (const expr of ast.body.expressions) {
        currentPosition = processExpression(expr, currentPosition);
      }
    }
  } catch (error) {
    console.warn('Failed to parse regex, falling back to basic validation:', error);
    // Fallback: allow any character at any position
    for (let i = 0; i < maxLength; i++) {
      rules.push({ position: i, allowedChars: '' });
    }
  }
  
  return rules;
};

export const useRegexInput = ({
  initialValue = "",
  config,
  onValidationChange,
  onValueChange,
}: UseRegexInputProps) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [displayValue, setDisplayValue] = useState(initialValue);

  // Parse regex to get position-based rules using regexp-tree
  const positionRules = useMemo(() => {
    return parseRegexForPositionRules(config.pattern, config.maxLength);
  }, [config.pattern, config.maxLength]);

  const validateInput = useCallback(
    (value: string) => {
      const isComplete = value.length === config.maxLength;
      const matchesPattern = config.pattern.test(value);
      const valid = isComplete && matchesPattern;
      
      setIsValid(valid);
      onValidationChange?.(valid);
      
      return valid;
    },
    [config.pattern, config.maxLength, onValidationChange]
  );

  const isCharAllowedAtPosition = useCallback(
    (char: string, position: number) => {
      const rule = positionRules.find(r => r.position === position);
      
      // If no rule found or rule has empty allowedChars, fall back to basic validation
      if (!rule || !rule.allowedChars) {
        return true; // Let regex validation handle it
      }
      
      return rule.allowedChars.includes(char);
    },
    [positionRules]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;

      // Apply transform if provided
      if (config.transform) {
        newValue = config.transform(newValue);
      }

      // Check length constraint
      if (newValue.length > config.maxLength) {
        return;
      }

      // Validate each character at its position
      let validatedValue = "";
      for (let i = 0; i < newValue.length; i++) {
        const char = newValue[i];
        if (isCharAllowedAtPosition(char, i)) {
          validatedValue += char;
        } else {
          // Reject invalid character - don't add it and stop processing
          break;
        }
      }

      setInputValue(validatedValue);
      
      // Set display value (formatted if needed)
      const formatted = config.formatDisplay ? config.formatDisplay(validatedValue) : validatedValue;
      setDisplayValue(formatted);

      validateInput(validatedValue);
      onValueChange?.(validatedValue);
    },
    [config, isCharAllowedAtPosition, validateInput, onValueChange]
  );

  const clearInput = useCallback(() => {
    setInputValue("");
    setDisplayValue("");
    setIsValid(false);
    onValidationChange?.(false);
    onValueChange?.("");
  }, [onValidationChange, onValueChange]);

  useEffect(() => {
    if (initialValue) {
      const formatted = config.formatDisplay ? config.formatDisplay(initialValue) : initialValue;
      setDisplayValue(formatted);
      validateInput(initialValue);
    }
  }, [initialValue, config.formatDisplay, validateInput]);

  return {
    inputValue,
    displayValue,
    isValid,
    handleChange,
    clearInput,
    positionRules, // Expose for debugging
  };
};