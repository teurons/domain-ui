import { describe, it, expect } from 'vitest'

// Import the USA passport regex directly
const USA_PASSPORT_REGEX = /^(?:[A-Z][0-9]{8}|[0-9]{9}|[A-Z][0-9]{7})$/

describe('USA Passport Regex Validation', () => {
  describe('Valid USA passport numbers', () => {
    it('should accept current format: 1 letter + 8 digits (9 total)', () => {
      const validCurrentFormats = [
        'A12345678',
        'B98765432',
        'Z00000001',
        'X87654321',
        'M11111111',
      ]

      validCurrentFormats.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(true)
      })
    })

    it('should accept older format: 9 digits only', () => {
      const validOlderFormats = [
        '123456789',
        '987654321',
        '000000001',
        '999999999',
        '111111111',
      ]

      validOlderFormats.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(true)
      })
    })

    it('should accept rare older format: 1 letter + 7 digits (8 total)', () => {
      const validRareFormats = [
        'X1234567',
        'A0000001',
        'Z9999999',
        'B1111111',
        'M7777777',
      ]

      validRareFormats.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(true)
      })
    })
  })

  describe('Invalid USA passport numbers', () => {
    it('should reject numbers with incorrect lengths', () => {
      const invalidLengths = [
        '12345',           // Too short
        'A123',            // Too short
        '1234567890',      // Too long (10 digits)
        'A123456789',      // Too long (1 letter + 9 digits = 10 total)
        'AB12345678',      // Too long (2 letters + 8 digits = 10 total)
        '',                // Empty
        '1',               // Single digit
        'A',               // Single letter
      ]

      invalidLengths.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(false)
      })
    })

    it('should reject numbers with multiple letters', () => {
      const invalidMultipleLetters = [
        'AB1234567',       // 2 letters + 7 digits
        'ABC123456',       // 3 letters + 6 digits
        'ABCD12345',       // 4 letters + 5 digits
        'AA12345678',      // 2 same letters + 8 digits
      ]

      invalidMultipleLetters.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(false)
      })
    })

    it('should reject numbers with lowercase letters', () => {
      const invalidLowercase = [
        'a12345678',       // Lowercase letter
        'x1234567',        // Lowercase letter (rare format)
        'b123456789',      // Lowercase letter + too many digits
      ]

      invalidLowercase.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(false)
      })
    })

    it('should reject numbers with special characters', () => {
      const invalidSpecialChars = [
        'A1234567!',       // Special character at end
        '@12345678',       // Special character at start
        'A123-4567',       // Hyphen in middle
        'A123 4567',       // Space in middle
        'A123.4567',       // Dot in middle
        '123456789!',      // Special character at end of digits-only
      ]

      invalidSpecialChars.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(false)
      })
    })

    it('should reject numbers with letters in wrong positions', () => {
      const invalidPositions = [
        '1A2345678',       // Letter in second position
        '12A345678',       // Letter in middle
        '123456A78',       // Letter in middle of digits
        '12345678A',       // Letter at end
        '1234567A8',       // Letter near end
      ]

      invalidPositions.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(false)
      })
    })

    it('should reject mixed alphanumeric patterns not matching any format', () => {
      const invalidMixedPatterns = [
        '1A3456789',       // Digit-letter-digit pattern
        'A1B345678',       // Letter-digit-letter pattern
        '12A45B678',       // Multiple letters scattered
        'AA1234567',       // Two letters at start
        '123ABC456',       // Letters in middle
      ]

      invalidMixedPatterns.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(false)
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle boundary cases correctly', () => {
      // These should be valid
      expect(USA_PASSPORT_REGEX.test('A0000000')).toBe(true)  // Minimum rare format
      expect(USA_PASSPORT_REGEX.test('Z9999999')).toBe(true)  // Maximum rare format
      expect(USA_PASSPORT_REGEX.test('A00000000')).toBe(true) // Minimum current format
      expect(USA_PASSPORT_REGEX.test('Z99999999')).toBe(true) // Maximum current format
      expect(USA_PASSPORT_REGEX.test('000000000')).toBe(true) // Minimum older format
      expect(USA_PASSPORT_REGEX.test('999999999')).toBe(true) // Maximum older format
    })

    it('should be case-sensitive', () => {
      // These should be invalid (lowercase)
      expect(USA_PASSPORT_REGEX.test('a12345678')).toBe(false)
      expect(USA_PASSPORT_REGEX.test('z1234567')).toBe(false)
      
      // These should be valid (uppercase)
      expect(USA_PASSPORT_REGEX.test('A12345678')).toBe(true)
      expect(USA_PASSPORT_REGEX.test('Z1234567')).toBe(true)
    })

    it('should not match substrings', () => {
      // These contain valid passport numbers but have extra characters
      expect(USA_PASSPORT_REGEX.test('XA12345678')).toBe(false)  // Extra char at start
      expect(USA_PASSPORT_REGEX.test('A12345678X')).toBe(false)  // Extra char at end
      expect(USA_PASSPORT_REGEX.test(' A12345678')).toBe(false)  // Space at start
      expect(USA_PASSPORT_REGEX.test('A12345678 ')).toBe(false)  // Space at end
      expect(USA_PASSPORT_REGEX.test('123456789X')).toBe(false)  // Extra char after digits
      expect(USA_PASSPORT_REGEX.test('X123456789')).toBe(false)  // Extra char before digits
    })
  })

  describe('Real-world scenarios', () => {
    it('should validate realistic passport numbers', () => {
      const realisticValid = [
        'A12345678',  // Current format example
        'N87654321',  // Current format with different letter
        '123456789',  // Older format
        '987654321',  // Different older format
        'X1234567',   // Rare format
        'Z9876543',   // Rare format with different letter
      ]

      realisticValid.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(true)
      })
    })

    it('should reject commonly mistaken formats', () => {
      const commonMistakes = [
        'A123456789',      // Too long - this was the bug we fixed!
        '12345678',        // Too short for any format
        'AA1234567',       // Double letter
        'A12-34-5678',     // With hyphens
        'A 12345678',      // With space
        'a12345678',       // Lowercase letter
        '1A2345678',       // Letter in wrong position
      ]

      commonMistakes.forEach(passport => {
        expect(USA_PASSPORT_REGEX.test(passport)).toBe(false)
      })
    })
  })
})