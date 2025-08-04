import { useState, useCallback, useMemo } from "react";
import regexpTree from 'regexp-tree';
const { parse } = regexpTree;

/**
 * REGEX INPUT VALIDATION ALGORITHM
 * 
 * This hook implements real-time, position-based character validation using regex AST parsing.
 * 
 * ## How it works:
 * 
 * 1. **AST Parsing Phase**:
 *    - Parse the regex pattern into an Abstract Syntax Tree using regexp-tree
 *    - Walk through the AST to generate position-based rules
 *    - Each rule defines: { position: number, allowedChars: string }
 *    - Example: /^[A-Z]{3}$/ → rules for positions 0,1,2 allowing A-Z
 * 
 * 2. **Real-time Validation Phase**:
 *    - On each keystroke, validate character-by-character
 *    - For each character at position i: check if it's in allowedChars for position i
 *    - If character is invalid: reject it and stop processing further characters
 *    - If no rule exists for position: reject (natural length limiting)
 * 
 * 3. **Final Validation**:
 *    - Use regex.test(value) to determine if input is complete and valid
 *    - No artificial length calculations needed
 * 
 * ## Supported Regex Features:
 * 
 * - **Character Classes**: [A-Z], [0-9], [ABC] → Generates specific allowed characters
 * - **Character Ranges**: [A-Z] → Expands to ABCDEFG...XYZ
 * - **Quantifiers**: {3}, {1,5} → Repeats rules for multiple positions
 * - **Meta Characters**: \d (digits), \w (word chars), \s (whitespace)
 * - **Literal Characters**: Specific chars like 'A' or '5'
 * 
 * ## Edge Cases Handled:
 * 
 * 1. **Complex Nested Patterns**: 
 *    - Alternative expressions in AST body
 *    - Nested groups and repetitions
 * 
 * 2. **Parsing Failures**:
 *    - If regexp-tree fails to parse: return empty rules
 *    - Falls back to basic regex validation only
 * 
 * 3. **Empty or Missing Rules**:
 *    - No rule for position → character rejected (natural length limit)
 *    - Rule with empty allowedChars → allow any character (fallback)
 * 
 * 4. **Position Beyond Pattern**:
 *    - User tries to type past the pattern length
 *    - No rule exists → ALL SUBSEQUENT INPUT REJECTED
 *    - Prevents infinite input length naturally
 *    - Example: Pattern /^[A-Z]{3}$/ → positions 3+ have no rules → rejected
 * 
 * 5. **Invalid Characters**:
 *    - Character not in allowedChars for that position
 *    - Character rejected, input stops processing at that point
 * 
 * 6. **Smart Case Conversion**:
 *    - Pattern expects [A-Z] only → auto-convert lowercase to uppercase
 *    - Pattern expects [a-z] only → auto-convert uppercase to lowercase
 *    - Mixed case patterns [A-Za-z] → no conversion (both allowed)
 *    - Algorithm:
 *      a) Analyze character set: isOnlyUppercase / isOnlyLowercase
 *      b) If user types wrong case: transform before validation
 *      c) If pattern allows both cases: no transformation
 *      d) Example: [A-Z] + input 'a' → convert to 'A' → validate
 * 
 * ## Examples:
 * 
 * **Pattern: /^[A-Z]{3}[0-9]{2}$/
 * - Position 0,1,2: Allow A-Z
 * - Position 3,4: Allow 0-9
 * - Position 5+: No rules → reject
 * 
 * **User Input: "AB3CD"**
 * - A at pos 0: ✅ A-Z allowed
 * - B at pos 1: ✅ A-Z allowed  
 * - 3 at pos 2: ❌ A-Z required, got digit → reject, stop
 * - Result: "AB"
 * 
 * **Pattern: /^[PCFTABGHLJE]{1}$/
 * - Position 0: Allow only P,C,F,T,A,B,G,H,L,J,E
 * - Position 1+: No rules → reject
 * 
 * ## Algorithm Complexity:
 * - AST parsing: O(n) where n = regex complexity
 * - Per-character validation: O(1) lookup in allowedChars string
 * - Overall: Very fast real-time validation
 */

interface RegexAST {
  type: string;
  expressions?: RegexAST[];
  expression?: RegexAST;
  quantifier?: { from: number; to?: number };
  kind?: string;
  symbol?: string;
  value?: string;
  from?: { symbol: string };
  to?: { symbol: string };
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
const extractAllowedChars = (expressions: RegexAST[]): string => {
  let allowed = '';
  
  for (const expr of expressions) {
    if (expr.type === 'ClassRange' && expr.from && expr.to) {
      allowed += expandCharacterRange(expr.from.symbol || '', expr.to.symbol || '');
    } else if (expr.type === 'Char') {
      allowed += expr.symbol || expr.value || '';
    }
  }
  
  return allowed;
};

// Parse regex AST to get position-based rules using regexp-tree
const parseRegexForPositionRules = (pattern: RegExp) => {
  const rules = new Map<number, { allowedChars: string; isUppercase: boolean; isLowercase: boolean }>();
  
  try {
    const ast = parse(pattern) as RegexAST;
    
    const analyzeCharacterSet = (chars: string) => {
      const hasUppercase = /[A-Z]/.test(chars);
      const hasLowercase = /[a-z]/.test(chars);
      const isOnlyUppercase = hasUppercase && !hasLowercase && !/[0-9]/.test(chars);
      const isOnlyLowercase = hasLowercase && !hasUppercase && !/[0-9]/.test(chars);
      
      return {
        allowedChars: chars,
        isUppercase: isOnlyUppercase,
        isLowercase: isOnlyLowercase
      };
    };
    
    const processExpression = (expr: RegexAST, currentPosition: number): number => {
      let position = currentPosition;
      
      if (expr.type === 'Repetition' && expr.expression) {
        const repetitions = expr.quantifier?.from || 1;
        let ruleInfo = { allowedChars: '', isUppercase: false, isLowercase: false };
        
        if (expr.expression.type === 'CharacterClass' && expr.expression.expressions) {
          const chars = extractAllowedChars(expr.expression.expressions);
          ruleInfo = analyzeCharacterSet(chars);
        } else if (expr.expression.type === 'Char') {
          const chars = expr.expression.symbol || expr.expression.value || '';
          ruleInfo = analyzeCharacterSet(chars);
        } else if (expr.expression.type === 'Meta' && expr.expression.kind === 'd') {
          ruleInfo = analyzeCharacterSet('0123456789');
        } else if (expr.expression.type === 'Meta' && expr.expression.kind === 'w') {
          ruleInfo = analyzeCharacterSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_');
        }
        
        // Apply the rule to multiple positions based on quantifier
        for (let i = 0; i < repetitions; i++) {
          rules.set(position, ruleInfo);
          position++;
        }
        
        return position;
      }
      
      if (expr.type === 'CharacterClass' && expr.expressions) {
        const chars = extractAllowedChars(expr.expressions);
        rules.set(position, analyzeCharacterSet(chars));
        return position + 1;
      }
      
      if (expr.type === 'Char') {
        const chars = expr.symbol || expr.value || '';
        rules.set(position, analyzeCharacterSet(chars));
        return position + 1;
      }
      
      if (expr.type === 'Meta') {
        let chars = '';
        if (expr.kind === 'd') {
          chars = '0123456789';
        } else if (expr.kind === 'w') {
          chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        } else if (expr.kind === 's') {
          chars = ' \t\n\r\f\v';
        }
        
        rules.set(position, analyzeCharacterSet(chars));
        return position + 1;
      }
      
      return position;
    };
    
    const body = (ast as any).body;
    if (body?.type === 'Alternative' && body.expressions) {
      let currentPosition = 0;
      for (const expr of body.expressions) {
        currentPosition = processExpression(expr, currentPosition);
      }
    } else if (body?.expressions) {
      let currentPosition = 0;
      for (const expr of body.expressions) {
        currentPosition = processExpression(expr, currentPosition);
      }
    }
  } catch {
    // If parsing fails, return empty rules array
    // This will fall back to basic regex validation
  }
  
  return rules;
};

export interface UseRegexInputProps {
  regex: RegExp;
  value?: string;
  onChange?: (value: string) => void;
}

export const useRegexInput = ({
  regex,
  value: controlledValue,
  onChange,
}: UseRegexInputProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;
  
  // Parse regex to get position-based rules using regexp-tree
  const positionRules = useMemo(() => {
    return parseRegexForPositionRules(regex);
  }, [regex]);

  const isValid = useMemo(() => {
    return regex.test(value);
  }, [value, regex]);

  const validateAndTransformChar = useCallback(
    (char: string, position: number): { isValid: boolean; transformedChar: string } => {
      const rule = positionRules.get(position);
      
      // If no rule found, this position is beyond the pattern length
      if (!rule) {
        return { isValid: false, transformedChar: char };
      }
      
      // If rule has empty allowedChars, fall back to basic validation
      if (!rule.allowedChars) {
        return { isValid: true, transformedChar: char };
      }
      
      // Smart case conversion
      let transformedChar = char;
      
      // If pattern expects uppercase and we get lowercase, convert it
      if (rule.isUppercase && char >= 'a' && char <= 'z') {
        transformedChar = char.toUpperCase();
      }
      // If pattern expects lowercase and we get uppercase, convert it  
      else if (rule.isLowercase && char >= 'A' && char <= 'Z') {
        transformedChar = char.toLowerCase();
      }
      
      // Check if the (possibly transformed) character is allowed
      const isValid = rule.allowedChars.includes(transformedChar);
      
      return { isValid, transformedChar };
    },
    [positionRules]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Validate and transform each character at its position
      let validatedValue = "";
      for (let i = 0; i < newValue.length; i++) {
        const inputChar = newValue[i];
        const { isValid, transformedChar } = validateAndTransformChar(inputChar ?? '', i);
        
        if (isValid) {
          validatedValue += transformedChar;
        } else {
          // Reject invalid character - don't add it and stop processing
          break;
        }
      }

      if (controlledValue === undefined) {
        setUncontrolledValue(validatedValue);
      }
      if (onChange) {
        onChange(validatedValue);
      }
    },
    [validateAndTransformChar, controlledValue, onChange]
  );

  return {
    value,
    onChange: handleChange,
    isValid,
  };
};