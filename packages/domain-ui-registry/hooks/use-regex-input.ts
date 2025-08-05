"use client";

import { useState, useCallback, useMemo } from "react";

/**
 * REGEX INPUT VALIDATION FOR IDENTITY INPUTS
 *
 * A lightweight, library-free approach for identity inputs (PAN, SSN, passport, email, etc.)
 *
 * ## Algorithm:
 *
 * 1. **Pattern Analysis** (one-time):
 *    - Parse regex source string to identify character requirements per position
 *    - Extract character classes [A-Z], [0-9], literal chars, and quantifiers {n}
 *    - Detect case-sensitivity requirements for smart conversion
 *
 * 2. **Real-time Validation**:
 *    - For each character: lookup expected type at that position
 *    - Apply smart case conversion if needed (lowercase → uppercase)
 *    - Validate transformed character against allowed set
 *    - Stop processing on first invalid character
 *
 * 3. **Position Beyond Pattern**:
 *    - Once input reaches pattern end → REJECT ALL SUBSEQUENT INPUT
 *    - Natural length limiting without artificial constraints
 *    - Example: PAN has 10 positions → position 11+ rejected completely
 *
 * 4. **Smart Case Conversion**:
 *    - [A-Z] only → auto-convert lowercase to uppercase
 *    - [a-z] only → auto-convert uppercase to lowercase
 *    - [A-Za-z] mixed → no conversion (both allowed)
 *    - Algorithm:
 *      a) Analyze if position expects only upper/lower case
 *      b) If wrong case provided: convert before validation
 *      c) Validate transformed character against allowed set
 *
 * ## Examples:
 *
 * **PAN: /^[A-Z]{3}[PCFTABGHLJE]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/
 * - Positions 0-2: Uppercase letters (convert lowercase)
 * - Position 3: Specific letters P,C,F,T,A,B,G,H,L,J,E (convert lowercase)
 * - Position 4: Uppercase letters (convert lowercase)
 * - Positions 5-8: Digits only
 * - Position 9: Uppercase letters (convert lowercase)
 * - Position 10+: NO RULES → ALL INPUT REJECTED
 *
 * **Input "abcp1234f":**
 * - 'a' → 'A', 'b' → 'B', 'c' → 'C', 'p' → 'P', '1234', 'f' → 'F'
 * - Result: "ABCP1234F" ✅
 *
 * **Input "abcp1234fx" (11th character):**
 * - First 10 chars processed normally
 * - 'x' at position 10: NO RULE → REJECTED
 * - Result: "ABCP1234F" (stops at 10 chars)
 *
 * ## Performance: O(1) per character, zero dependencies
 */

// Character set constants for efficiency and clarity
const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const WHITESPACE = " \t\n\r\f\v";

// Regex constants for performance
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;

type CharacterType = "uppercase" | "lowercase" | "digits" | "mixed" | "custom";

interface PositionRule {
  type: CharacterType;
  allowedChars: string; // Only used for 'custom' type like [PCFTABGHLJE]
}

// Get character set for a given type
const getCharacterSet = (type: CharacterType, customChars?: string): string => {
  switch (type) {
    case "uppercase":
      return UPPERCASE_LETTERS;
    case "lowercase":
      return LOWERCASE_LETTERS;
    case "digits":
      return DIGITS;
    case "mixed":
      return UPPERCASE_LETTERS + LOWERCASE_LETTERS + DIGITS;
    case "custom":
      return customChars || "";
    default:
      return ""; // Unknown types → empty string → no characters allowed → reject all input
  }
};

// Check if character is valid for the rule type
const isCharacterValid = (char: string, rule: PositionRule): boolean => {
  const allowedSet = getCharacterSet(rule.type, rule.allowedChars);
  return allowedSet.includes(char);
};

// Apply smart case conversion based on rule type
const transformCharacter = (char: string, rule: PositionRule): string => {
  switch (rule.type) {
    case "uppercase":
      // Convert lowercase to uppercase
      return char >= "a" && char <= "z" ? char.toUpperCase() : char;
    case "lowercase":
      // Convert uppercase to lowercase
      return char >= "A" && char <= "Z" ? char.toLowerCase() : char;
    case "custom": {
      // For custom sets like [PCFTABGHLJE], check if it's uppercase-only
      const isUppercaseSet =
        rule.allowedChars === rule.allowedChars.toUpperCase() &&
        UPPERCASE_REGEX.test(rule.allowedChars) &&
        !LOWERCASE_REGEX.test(rule.allowedChars);
      return isUppercaseSet && char >= "a" && char <= "z"
        ? char.toUpperCase()
        : char;
    }
    default:
      return char; // No transformation for mixed, digits, or unknown types
  }
};

// Helper to process character class patterns
const processCharacterClass = (
  pattern: string,
  i: number,
  position: number,
  rules: Map<number, PositionRule>
): { newPosition: number; newIndex: number } => {
  const endBracket = pattern.indexOf("]", i);
  if (endBracket === -1) {
    return { newPosition: position, newIndex: i + 1 };
  }

  const charClass = pattern.slice(i + 1, endBracket);
  const rule = parseCharacterClass(charClass);
  const quantifier = parseQuantifier(pattern, endBracket + 1);
  const repeatCount = quantifier.count;

  // Apply rule to multiple positions
  let currentPosition = position;
  for (let j = 0; j < repeatCount; j++) {
    rules.set(currentPosition, rule);
    currentPosition++;
  }

  return {
    newPosition: currentPosition,
    newIndex: endBracket + 1 + quantifier.consumed,
  };
};

// Helper to process meta character patterns
const processMetaCharacter = (
  pattern: string,
  i: number,
  position: number,
  rules: Map<number, PositionRule>
): { newPosition: number; newIndex: number } => {
  const metaChar = pattern[i + 1];
  if (!metaChar) {
    return { newPosition: position, newIndex: i + 2 };
  }

  const rule = parseMetaCharacter(metaChar);
  const quantifier = parseQuantifier(pattern, i + 2);
  const repeatCount = quantifier.count;

  // Apply rule to multiple positions
  let currentPosition = position;
  for (let j = 0; j < repeatCount; j++) {
    rules.set(currentPosition, rule);
    currentPosition++;
  }

  return {
    newPosition: currentPosition,
    newIndex: i + 2 + quantifier.consumed,
  };
};

// Helper to process literal characters
const processLiteralCharacter = (
  pattern: string,
  i: number,
  position: number,
  rules: Map<number, PositionRule>
): { newPosition: number; newIndex: number } => {
  const literalChar = pattern[i];
  if (!literalChar) {
    return { newPosition: position, newIndex: i + 1 };
  }

  const rule: PositionRule = {
    type: "custom",
    allowedChars: literalChar,
  };

  rules.set(position, rule);
  return { newPosition: position + 1, newIndex: i + 1 };
};

// Simple pattern analysis for common identity input patterns
const analyzeSimplePattern = (regex: RegExp): Map<number, PositionRule> => {
  const source = regex.source;
  const rules = new Map<number, PositionRule>();
  const pattern = source.replace(/^\^|\$$/g, "");

  let position = 0;
  let i = 0;

  while (i < pattern.length) {
    if (pattern[i] === "[") {
      const result = processCharacterClass(pattern, i, position, rules);
      position = result.newPosition;
      i = result.newIndex;
    } else if (pattern[i] === "\\" && i + 1 < pattern.length) {
      const result = processMetaCharacter(pattern, i, position, rules);
      position = result.newPosition;
      i = result.newIndex;
    } else {
      const result = processLiteralCharacter(pattern, i, position, rules);
      position = result.newPosition;
      i = result.newIndex;
    }
  }

  return rules;
};

// Helper to check common character class patterns
const parseCommonPatterns = (charClass: string): PositionRule | null => {
  if (charClass === "A-Z") {
    return { type: "uppercase", allowedChars: "" };
  }
  if (charClass === "a-z") {
    return { type: "lowercase", allowedChars: "" };
  }
  if (charClass === "0-9") {
    return { type: "digits", allowedChars: "" };
  }
  if (charClass === "A-Za-z") {
    return { type: "mixed", allowedChars: "" };
  }
  if (charClass === "A-Z0-9") {
    return { type: "mixed", allowedChars: "" };
  }
  return null;
};

// Helper to expand character ranges like A-Z, a-z, 0-9
const expandCharacterRanges = (charClass: string): string => {
  let expandedChars = "";
  const ranges = charClass.match(/.-./g) || [];

  for (const range of ranges) {
    const start = range.charCodeAt(0);
    const end = range.charCodeAt(2);
    for (let code = start; code <= end; code++) {
      expandedChars += String.fromCharCode(code);
    }
  }

  return expandedChars;
};

// Helper to add individual characters from character class
const addIndividualChars = (
  charClass: string,
  expandedChars: string
): string => {
  const individuals = charClass.replace(/.-./g, "");
  let result = expandedChars;

  for (const individualChar of individuals) {
    if (!result.includes(individualChar)) {
      result += individualChar;
    }
  }

  return result;
};

// Helper to determine character type based on content
const determineCharType = (chars: string): CharacterType => {
  let hasUppercase = false;
  let hasLowercase = false;

  for (const char of chars) {
    if (char >= "A" && char <= "Z") {
      hasUppercase = true;
    }
    if (char >= "a" && char <= "z") {
      hasLowercase = true;
    }
  }

  if (hasUppercase && !hasLowercase) {
    return "uppercase";
  }
  if (hasLowercase && !hasUppercase) {
    return "lowercase";
  }
  return "custom";
};

// Parse character class like "A-Z", "0-9", "A-Za-z", "PCFTABGHLJE"
const parseCharacterClass = (charClass: string): PositionRule => {
  // Check common patterns first
  const commonPattern = parseCommonPatterns(charClass);
  if (commonPattern) {
    return commonPattern;
  }

  // Handle ranges
  if (charClass.includes("-")) {
    let expandedChars = expandCharacterRanges(charClass);
    expandedChars = addIndividualChars(charClass, expandedChars);

    const charType = determineCharType(expandedChars);

    return {
      type: charType === "custom" ? "custom" : charType,
      allowedChars: charType === "custom" ? expandedChars : "",
    };
  }

  // Custom character set like "PCFTABGHLJE"
  return { type: "custom", allowedChars: charClass };
};

// Parse meta characters like \d, \w, \s
const parseMetaCharacter = (metaChar: string): PositionRule => {
  switch (metaChar) {
    case "d":
      return { type: "digits", allowedChars: "" };
    case "w":
      return { type: "mixed", allowedChars: "" }; // \w includes letters, digits, underscore
    case "s":
      return { type: "custom", allowedChars: WHITESPACE };
    default:
      return { type: "custom", allowedChars: "" };
  }
};

// Parse quantifiers like {3}, {1,5}
const parseQuantifier = (
  pattern: string,
  startIndex: number
): { count: number; consumed: number } => {
  if (startIndex >= pattern.length || pattern[startIndex] !== "{") {
    return { count: 1, consumed: 0 };
  }

  const endBrace = pattern.indexOf("}", startIndex);
  if (endBrace === -1) {
    return { count: 1, consumed: 0 };
  }

  const quantifierContent = pattern.slice(startIndex + 1, endBrace);
  const count = Number.parseInt(quantifierContent.split(",")[0] || "1", 10);

  return { count, consumed: endBrace - startIndex + 1 };
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
  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  // Parse regex to get position-based rules (memoized)
  const positionRules = useMemo(() => {
    return analyzeSimplePattern(regex);
  }, [regex]);

  const isValid = useMemo(() => {
    return regex.test(value);
  }, [value, regex]);

  const validateAndTransformChar = useCallback(
    (
      inputChar: string,
      position: number
    ): { isValid: boolean; transformedChar: string } => {
      const rule = positionRules.get(position);

      // If no rule found, this position is beyond the pattern length
      // REJECT ALL SUBSEQUENT INPUT
      if (!rule) {
        return { isValid: false, transformedChar: inputChar };
      }

      // Apply smart case conversion
      const transformedChar = transformCharacter(inputChar, rule);

      // Check if the transformed character is valid
      const isCharValid = isCharacterValid(transformedChar, rule);

      return { isValid: isCharValid, transformedChar };
    },
    [positionRules]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Validate and transform each character at its position
      let validatedValue = "";
      for (let i = 0; i < newValue.length; i++) {
        const currentChar = newValue[i];
        if (!currentChar) {
          continue;
        }

        const { isValid: isCharValid, transformedChar } =
          validateAndTransformChar(currentChar, i);

        if (isCharValid) {
          validatedValue += transformedChar;
        } else {
          // Reject invalid character - ALL SUBSEQUENT INPUT REJECTED
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
