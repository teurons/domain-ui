"use client";

import type * as RegExpAST from "@eslint-community/regexpp/ast";
import { NFA, type NFATransition } from "./nfa";

/**
 * NFA Builder using Thompson's Construction Algorithm
 *
 * Converts regex AST nodes into NFA fragments and combines them
 * according to Thompson's construction rules:
 *
 * 1. Character: state1 --char--> state2
 * 2. Concatenation: NFA1 -> NFA2 (connect accept of NFA1 to start of NFA2)
 * 3. Alternation: state --ε--> NFA1 --ε--> accept
 *                      \--ε--> NFA2 --ε--> accept
 * 4. Quantifiers: add epsilon loops and optional paths
 */

interface NFAFragment {
  startState: number;
  acceptState: number;
  transitions: NFATransition[];
}

export class NFABuilder {
  private stateCounter = 0;

  private nextState(): number {
    return this.stateCounter++;
  }

  /**
   * Build NFA from regex AST
   */
  build(ast: RegExpAST.Pattern): NFA {
    this.stateCounter = 0;

    // Check if the pattern has multiple alternatives at the top level
    const alternatives = ast.body || ast.alternatives;
    if (!alternatives || alternatives.length === 0) {
      throw new Error("No alternatives found in regex AST");
    }

    let fragment: NFAFragment;
    if (alternatives.length === 1) {
      // Single alternative
      fragment = this.buildFragment(alternatives[0]);
    } else {
      // Multiple alternatives - create a disjunction
      const disjunction = {
        type: "Disjunction" as const,
        alternatives,
      };
      fragment = this.buildDisjunction(disjunction);
    }

    return new NFA(
      fragment.startState,
      new Set([fragment.acceptState]),
      fragment.transitions,
      this.stateCounter
    );
  }

  /**
   * Build NFA fragment from AST node
   */
  private buildFragment(node: RegExpAST.Alternative): NFAFragment {
    // Handle different property names - newer versions use 'elements'
    const elements = node.body || node.elements;

    if (!elements || elements.length === 0) {
      // Empty alternative - epsilon transition
      const start = this.nextState();
      const accept = this.nextState();
      return {
        startState: start,
        acceptState: accept,
        transitions: [{ from: start, to: accept, symbol: null }],
      };
    }

    // Build fragments for each element and concatenate
    let current = this.buildElementFragment(elements[0]);

    for (let i = 1; i < elements.length; i++) {
      const next = this.buildElementFragment(elements[i]);
      current = this.concatenate(current, next);
    }

    return current;
  }

  /**
   * Build fragment from individual AST elements
   */
  private buildElementFragment(element: RegExpAST.Element): NFAFragment {
    switch (element.type) {
      case "Character":
        return this.buildCharacter(String.fromCharCode(element.value));

      case "CharacterClass":
        return this.buildCharacterClass(element);

      case "CharacterSet":
        // CharacterSet is another name for CharacterClass in newer versions
        return this.buildCharacterClass(element as RegExpAST.CharacterClass);

      case "Quantifier":
        return this.buildQuantifier(element);

      case "Group": {
        // Groups can contain disjunctions - handle both single alternatives and disjunctions
        if (element.alternatives && element.alternatives.length > 1) {
          // This is a disjunction inside a group - create disjunction structure
          const disjunction = {
            type: "Disjunction" as const,
            alternatives: element.alternatives,
          };
          return this.buildDisjunction(disjunction);
        }
        // Single alternative in group
        const groupAlternative = element.body?.[0] || element.alternatives?.[0];
        return this.buildFragment(groupAlternative);
      }

      case "Disjunction":
        return this.buildDisjunction(element);

      case "Assertion":
        // Assertions (^, $, \b, etc.) are epsilon transitions - they don't consume input
        return this.buildEpsilonFragment();

      case "CapturingGroup": {
        // CapturingGroup is similar to Group but with capturing semantics
        // For NFA purposes, treat it the same as Group
        if (element.alternatives && element.alternatives.length > 1) {
          const disjunction = {
            type: "Disjunction" as const,
            alternatives: element.alternatives,
          };
          return this.buildDisjunction(disjunction);
        }
        const groupAlternative = element.body?.[0] || element.alternatives?.[0];
        return this.buildFragment(groupAlternative);
      }

      default:
        // Fallback for unsupported elements - epsilon transition to be safe
        // Silently handle unsupported element types
        return this.buildEpsilonFragment();
    }
  }

  /**
   * Build epsilon fragment: start --ε--> accept
   */
  private buildEpsilonFragment(): NFAFragment {
    const start = this.nextState();
    const accept = this.nextState();

    return {
      startState: start,
      acceptState: accept,
      transitions: [{ from: start, to: accept, symbol: null }],
    };
  }

  /**
   * Build character fragment: start --char--> accept
   */
  private buildCharacter(char: string): NFAFragment {
    const start = this.nextState();
    const accept = this.nextState();

    return {
      startState: start,
      acceptState: accept,
      transitions: [{ from: start, to: accept, symbol: char }],
    };
  }

  /**
   * Build character class fragment (e.g., [A-Z], [0-9])
   */
  private buildCharacterClass(
    charClass: RegExpAST.CharacterClass
  ): NFAFragment {
    const start = this.nextState();
    const accept = this.nextState();
    const transitions: NFATransition[] = [];

    // Handle both body and elements properties
    const elements = charClass.body || charClass.elements || [];

    for (const element of elements) {
      switch (element.type) {
        case "Character":
          transitions.push({
            from: start,
            to: accept,
            symbol: String.fromCharCode(element.value),
          });
          break;

        case "CharacterClassRange":
          // Add transition for each character in range
          for (
            let code = element.min.value;
            code <= element.max.value;
            code++
          ) {
            transitions.push({
              from: start,
              to: accept,
              symbol: String.fromCharCode(code),
            });
          }
          break;

        default:
          // Skip unsupported character class elements
          break;
      }
    }

    return { startState: start, acceptState: accept, transitions };
  }

  /**
   * Build quantifier fragment (*, +, ?, {n,m})
   */
  private buildQuantifier(quantifier: RegExpAST.Quantifier): NFAFragment {
    const { min, max } = quantifier;

    // For exact repetitions like {8} or {7}, build a chain
    if (min === max && min > 0) {
      return this.buildExactRepetition(quantifier.element, min);
    }

    // For other quantifiers, use the general approach
    const innerFragment = this.buildElementFragment(quantifier.element);
    const start = this.nextState();
    const accept = this.nextState();

    const transitions: NFATransition[] = [...innerFragment.transitions];

    if (min === 0) {
      // Optional (?, *, {0,n}) - epsilon from start to accept
      transitions.push({ from: start, to: accept, symbol: null });
    }

    if (max === null || max > 1) {
      // Repeatable (+, *, {n,}) - epsilon loop back
      transitions.push({
        from: innerFragment.acceptState,
        to: innerFragment.startState,
        symbol: null,
      });
    }

    // Connect start to inner fragment
    transitions.push({
      from: start,
      to: innerFragment.startState,
      symbol: null,
    });

    // Connect inner fragment to accept
    transitions.push({
      from: innerFragment.acceptState,
      to: accept,
      symbol: null,
    });

    return { startState: start, acceptState: accept, transitions };
  }

  /**
   * Build exact repetition fragment for quantifiers like {8}
   */
  private buildExactRepetition(
    element: RegExpAST.Element,
    count: number
  ): NFAFragment {
    if (count === 0) {
      return this.buildEpsilonFragment();
    }

    // Build first fragment
    let current = this.buildElementFragment(element);

    // Chain additional fragments
    for (let i = 1; i < count; i++) {
      const next = this.buildElementFragment(element);
      current = this.concatenate(current, next);
    }

    return current;
  }

  /**
   * Build disjunction (alternation) fragment: a|b
   */
  private buildDisjunction(disjunction: RegExpAST.Disjunction): NFAFragment {
    const start = this.nextState();
    const accept = this.nextState();
    const transitions: NFATransition[] = [];

    // Connect start to each alternative via epsilon
    // Connect each alternative to accept via epsilon
    for (const alternative of disjunction.alternatives) {
      const fragment = this.buildFragment(alternative);

      // start --ε--> fragment.start
      transitions.push({ from: start, to: fragment.startState, symbol: null });

      // fragment.accept --ε--> accept
      transitions.push({
        from: fragment.acceptState,
        to: accept,
        symbol: null,
      });

      // Add fragment's transitions
      transitions.push(...fragment.transitions);
    }

    return { startState: start, acceptState: accept, transitions };
  }

  /**
   * Concatenate two NFA fragments
   */
  private concatenate(first: NFAFragment, second: NFAFragment): NFAFragment {
    const transitions = [
      ...first.transitions,
      ...second.transitions,
      // Connect first's accept to second's start via epsilon
      { from: first.acceptState, to: second.startState, symbol: null },
    ];

    return {
      startState: first.startState,
      acceptState: second.acceptState,
      transitions,
    };
  }
}
