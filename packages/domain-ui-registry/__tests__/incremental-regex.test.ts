import { describe, it, expect } from 'vitest'
import { canPartiallyMatch, matches, validateIncrementalInput } from '../lib/incremental-regex'

describe('Incremental Regex Matching', () => {
  describe('USA Passport Pattern: /^(?:[A-Z][0-9]{8}|[0-9]{9}|[A-Z][0-9]{7})$/', () => {
    const USA_PASSPORT_REGEX = /^(?:[A-Z][0-9]{8}|[0-9]{9}|[A-Z][0-9]{7})$/

    describe('Partial Matching (canPartiallyMatch)', () => {
      it('should accept valid prefixes for letter + digits format', () => {
        expect(canPartiallyMatch('', USA_PASSPORT_REGEX)).toBe(true)
        expect(canPartiallyMatch('A', USA_PASSPORT_REGEX)).toBe(true)
        expect(canPartiallyMatch('A1', USA_PASSPORT_REGEX)).toBe(true)
        expect(canPartiallyMatch('A12', USA_PASSPORT_REGEX)).toBe(true)
        expect(canPartiallyMatch('A1234567', USA_PASSPORT_REGEX)).toBe(true)
        expect(canPartiallyMatch('A12345678', USA_PASSPORT_REGEX)).toBe(true)
      })

      it('should accept valid prefixes for digits-only format', () => {
        expect(canPartiallyMatch('1', USA_PASSPORT_REGEX)).toBe(true)
        expect(canPartiallyMatch('12', USA_PASSPORT_REGEX)).toBe(true)
        expect(canPartiallyMatch('123456789', USA_PASSPORT_REGEX)).toBe(true)
      })

      it('should reject invalid prefixes', () => {
        expect(canPartiallyMatch('AB', USA_PASSPORT_REGEX)).toBe(false) // Two letters
        expect(canPartiallyMatch('A1A', USA_PASSPORT_REGEX)).toBe(false) // Letter in wrong position
        expect(canPartiallyMatch('1A', USA_PASSPORT_REGEX)).toBe(false) // Letter after digit
        expect(canPartiallyMatch('@', USA_PASSPORT_REGEX)).toBe(false) // Invalid start char
        expect(canPartiallyMatch('a', USA_PASSPORT_REGEX)).toBe(false) // Lowercase
      })

      it('should reject overly long inputs', () => {
        expect(canPartiallyMatch('A123456789', USA_PASSPORT_REGEX)).toBe(false) // 10 chars
        expect(canPartiallyMatch('1234567890', USA_PASSPORT_REGEX)).toBe(false) // 10 digits
      })
    })

    describe('Complete Matching (matches)', () => {
      it('should match valid USA passport formats', () => {
        // Current format: Letter + 8 digits
        expect(matches('A12345678', USA_PASSPORT_REGEX)).toBe(true)
        expect(matches('Z87654321', USA_PASSPORT_REGEX)).toBe(true)

        // Older format: 9 digits only
        expect(matches('123456789', USA_PASSPORT_REGEX)).toBe(true)
        expect(matches('987654321', USA_PASSPORT_REGEX)).toBe(true)

        // Rare format: Letter + 7 digits
        expect(matches('X1234567', USA_PASSPORT_REGEX)).toBe(true)
        expect(matches('B7654321', USA_PASSPORT_REGEX)).toBe(true)
      })

      it('should reject invalid USA passport formats', () => {
        expect(matches('A123456789', USA_PASSPORT_REGEX)).toBe(false) // Too long
        expect(matches('AB1234567', USA_PASSPORT_REGEX)).toBe(false) // Two letters
        expect(matches('a12345678', USA_PASSPORT_REGEX)).toBe(false) // Lowercase
        expect(matches('A12345', USA_PASSPORT_REGEX)).toBe(false) // Too short
        expect(matches('12345678', USA_PASSPORT_REGEX)).toBe(false) // Wrong digit count
        expect(matches('1234567890', USA_PASSPORT_REGEX)).toBe(false) // Too many digits
      })
    })

    describe('Incremental Input Validation', () => {
      it('should validate character by character correctly', () => {
        expect(validateIncrementalInput('A123456789', USA_PASSPORT_REGEX)).toBe('A12345678')
        expect(validateIncrementalInput('AB1234567', USA_PASSPORT_REGEX)).toBe('A')
        expect(validateIncrementalInput('A123-4567', USA_PASSPORT_REGEX)).toBe('A123')
        expect(validateIncrementalInput('1A2345678', USA_PASSPORT_REGEX)).toBe('1')
      })
    })
  })

  describe('Simple Patterns', () => {
    it('should handle basic character patterns', () => {
      const digitRegex = /^[0-9]+$/
      
      expect(canPartiallyMatch('1', digitRegex)).toBe(true)
      expect(canPartiallyMatch('12', digitRegex)).toBe(true)
      expect(canPartiallyMatch('A', digitRegex)).toBe(false)
      
      expect(matches('123', digitRegex)).toBe(true)
      expect(matches('12A', digitRegex)).toBe(false)
    })

    it('should handle alternation patterns', () => {
      const catDogRegex = /^(cat|dog)$/
      
      expect(canPartiallyMatch('c', catDogRegex)).toBe(true)
      expect(canPartiallyMatch('ca', catDogRegex)).toBe(true)
      expect(canPartiallyMatch('d', catDogRegex)).toBe(true)
      expect(canPartiallyMatch('do', catDogRegex)).toBe(true)
      expect(canPartiallyMatch('x', catDogRegex)).toBe(false)
      
      expect(matches('cat', catDogRegex)).toBe(true)
      expect(matches('dog', catDogRegex)).toBe(true)
      expect(matches('bird', catDogRegex)).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const anyRegex = /^.+$/
      
      expect(canPartiallyMatch('', anyRegex)).toBe(true)
      expect(matches('', anyRegex)).toBe(false)
    })

    it('should handle complex nested patterns', () => {
      const complexRegex = /^(?:(?:[A-Z]{2}[0-9]{2})|(?:[0-9]{4}))$/
      
      expect(canPartiallyMatch('A', complexRegex)).toBe(true)
      expect(canPartiallyMatch('AB', complexRegex)).toBe(true)
      expect(canPartiallyMatch('AB1', complexRegex)).toBe(true)
      expect(canPartiallyMatch('AB12', complexRegex)).toBe(true)
      expect(canPartiallyMatch('1', complexRegex)).toBe(true)
      expect(canPartiallyMatch('12', complexRegex)).toBe(true)
      expect(canPartiallyMatch('123', complexRegex)).toBe(true)
      expect(canPartiallyMatch('1234', complexRegex)).toBe(true)
      
      expect(matches('AB12', complexRegex)).toBe(true)
      expect(matches('1234', complexRegex)).toBe(true)
      expect(matches('ABC1', complexRegex)).toBe(false)
      expect(matches('12345', complexRegex)).toBe(false)
    })
  })
})