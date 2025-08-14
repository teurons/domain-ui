"use client";

import { parseRegExpLiteral } from "@eslint-community/regexpp";
import { NFABuilder } from "./nfa-builder";
import { NFA } from "./nfa";

/**
 * Incremental Regular Expression Matcher
 *
 * Converts JavaScript RegExp to NFA and provides incremental matching:
 * - `canPartiallyMatch(input)`: Can this partial input eventually match?
 * - `matches(input)`: Does this complete input match?
 *
 * Uses AST parsing + Thompson's NFA construction for proper regex support.
 */

class IncrementalRegexMatcher {
  private nfa: NFA;
  private originalRegex: RegExp;

  constructor(regex: RegExp) {
    this.originalRegex = regex;

    try {
      // Parse regex to AST using well-maintained regexpp
      // parseRegExpLiteral expects format: /pattern/flags
      const regexLiteral = `/${regex.source}/${regex.flags}`;
      const ast = parseRegExpLiteral(regexLiteral);

      // Build NFA using Thompson's construction
      const builder = new NFABuilder();
      this.nfa = builder.build(ast.pattern);
    } catch (_error) {
      // Fallback: if parsing fails, create a permissive NFA
      // Silently fall back to permissive NFA if parsing fails
      this.nfa = this.createFallbackNFA();
    }
  }

  /**
   * Check if partial input could eventually match the regex
   */
  canPartiallyMatch(input: string): boolean {
    // First try NFA-based matching
    try {
      return this.nfa.canPartiallyMatch(input);
    } catch (_error) {
      // Fallback to original regex with brute force extension
      // Silently fall back to brute force matching if NFA fails
      return this.fallbackCanMatch(input);
    }
  }

  /**
   * Check if complete input matches the regex
   */
  matches(input: string): boolean {
    // Use original regex for exact matching
    return this.originalRegex.test(input);
  }

  /**
   * Create simple fallback NFA that accepts any input
   */
  private createFallbackNFA(): NFA {
    // Simple NFA: state 0 -> state 1 on any character, with loop back
    return new NFA(
      0,
      new Set([0, 1]),
      [
        { from: 0, to: 1, symbol: "." }, // Any character
        { from: 1, to: 1, symbol: "." }, // Loop back
      ],
      2
    );
  }

  /**
   * Brute force fallback for partial matching
   */
  private fallbackCanMatch(input: string): boolean {
    // Try extending input with common characters
    const commonChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (const char of commonChars) {
      if (this.originalRegex.test(input + char)) {
        return true;
      }
    }

    // Try extending with multiple characters
    for (let len = 2; len <= 5; len++) {
      const extension = "0".repeat(len);
      if (this.originalRegex.test(input + extension)) {
        return true;
      }
    }

    return false;
  }
}

// Cache for regex matchers to avoid rebuilding NFAs
const matcherCache = new Map<string, IncrementalRegexMatcher>();

/**
 * Get or create incremental matcher for a regex
 */
function getIncrementalMatcher(regex: RegExp): IncrementalRegexMatcher {
  const key = `${regex.source}_${regex.flags}`;

  if (!matcherCache.has(key)) {
    matcherCache.set(key, new IncrementalRegexMatcher(regex));
  }

  const matcher = matcherCache.get(key);
  if (!matcher) {
    throw new Error(`Matcher not found for regex: ${regex.source}`);
  }
  return matcher;
}

/**
 * Check if partial input could eventually match regex
 */
export function canPartiallyMatch(input: string, regex: RegExp): boolean {
  const matcher = getIncrementalMatcher(regex);
  return matcher.canPartiallyMatch(input);
}

/**
 * Check if complete input matches regex
 */
export function matches(input: string, regex: RegExp): boolean {
  const matcher = getIncrementalMatcher(regex);
  return matcher.matches(input);
}

/**
 * Validate input character by character, keeping only valid prefixes
 */
export function validateIncrementalInput(input: string, regex: RegExp): string {
  let validInput = "";

  for (const char of input) {
    const testInput = validInput + char;

    if (canPartiallyMatch(testInput, regex)) {
      validInput = testInput;
    } else {
      // Stop at first invalid character
      break;
    }
  }

  return validInput;
}
