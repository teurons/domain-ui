"use client";

/**
 * Minimal NFA (Non-deterministic Finite Automaton) Implementation
 * for Incremental Regular Expression Matching
 *
 * Based on Thompson's construction algorithm:
 * - Characters create simple transitions
 * - Concatenation connects NFAs sequentially
 * - Alternation creates epsilon branches
 * - Quantifiers create epsilon loops/choices
 */

export interface NFATransition {
  from: number;
  to: number;
  symbol: string | null; // null represents epsilon (ε) transition
}

export class NFA {
  readonly startState: number;
  readonly acceptStates: Set<number>;
  readonly transitions: NFATransition[];
  readonly stateCount: number;

  constructor(
    startState: number,
    acceptStates: Set<number>,
    transitions: NFATransition[],
    stateCount: number
  ) {
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.transitions = transitions;
    this.stateCount = stateCount;
  }

  /**
   * Compute epsilon closure of a set of states
   * (all states reachable via epsilon transitions)
   */
  private epsilonClosure(states: Set<number>): Set<number> {
    const closure = new Set(states);
    const stack = Array.from(states);

    while (stack.length > 0) {
      const state = stack.pop();
      if (state === undefined) {
        break;
      }

      // Find all epsilon transitions from this state
      for (const transition of this.transitions) {
        if (
          transition.from === state &&
          transition.symbol === null &&
          !closure.has(transition.to)
        ) {
          closure.add(transition.to);
          stack.push(transition.to);
        }
      }
    }

    return closure;
  }

  /**
   * Get all states reachable from given states on a specific symbol
   */
  private move(states: Set<number>, symbol: string): Set<number> {
    const nextStates = new Set<number>();

    for (const state of states) {
      for (const transition of this.transitions) {
        if (transition.from === state && transition.symbol === symbol) {
          nextStates.add(transition.to);
        }
      }
    }

    return nextStates;
  }

  /**
   * Check if partial input could eventually match the regex
   * Returns true if there's a path from current states to accept states
   */
  canPartiallyMatch(input: string): boolean {
    // Start with epsilon closure of start state
    let currentStates = this.epsilonClosure(new Set([this.startState]));

    // Process each character in input
    for (const char of input) {
      // Move on character and compute epsilon closure
      const nextStates = this.move(currentStates, char);
      currentStates = this.epsilonClosure(nextStates);

      // If no states reachable, input cannot match
      if (currentStates.size === 0) {
        return false;
      }
    }

    // For partial matching, we just need to have reachable states
    // The input doesn't need to be complete
    return currentStates.size > 0;
  }

  /**
   * Check if input fully matches the regex
   */
  matches(input: string): boolean {
    let currentStates = this.epsilonClosure(new Set([this.startState]));

    for (const char of input) {
      const nextStates = this.move(currentStates, char);
      currentStates = this.epsilonClosure(nextStates);

      if (currentStates.size === 0) {
        return false;
      }
    }

    // For full match, we need to be in an accept state
    for (const state of currentStates) {
      if (this.acceptStates.has(state)) {
        return true;
      }
    }

    return false;
  }
}
