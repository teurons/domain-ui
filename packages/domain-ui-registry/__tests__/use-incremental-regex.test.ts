import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIncrementalRegex } from '../hooks/use-incremental-regex'

describe('useIncrementalRegex Hook', () => {
  const USA_PASSPORT_REGEX = /^(?:[A-Z][0-9]{8}|[0-9]{9}|[A-Z][0-9]{7})$/

  describe('Uncontrolled Mode', () => {
    it('should initialize with empty value', () => {
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: USA_PASSPORT_REGEX })
      )
      
      expect(result.current.value).toBe('')
      expect(result.current.isValid).toBe(false)
      expect(typeof result.current.onChange).toBe('function')
    })

    it('should accept valid character input step by step', () => {
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: USA_PASSPORT_REGEX })
      )
      
      // Type 'A'
      act(() => {
        result.current.onChange({
          target: { value: 'A' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A')
      expect(result.current.isValid).toBe(false) // Not complete
      
      // Type 'A1'
      act(() => {
        result.current.onChange({
          target: { value: 'A1' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A1')
      expect(result.current.isValid).toBe(false)
      
      // Type complete valid input
      act(() => {
        result.current.onChange({
          target: { value: 'A12345678' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A12345678')
      expect(result.current.isValid).toBe(true)
    })

    it('should reject invalid character sequences', () => {
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: USA_PASSPORT_REGEX })
      )
      
      // Try invalid input that should be truncated
      act(() => {
        result.current.onChange({
          target: { value: 'AB1234567' } // Two letters
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A') // Should stop at first valid prefix
      expect(result.current.isValid).toBe(false)
    })

    it('should handle the 10-character bug case', () => {
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: USA_PASSPORT_REGEX })
      )
      
      act(() => {
        result.current.onChange({
          target: { value: 'A123456789' } // 10 characters - should truncate
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A12345678') // Truncated to 9 valid chars
      expect(result.current.isValid).toBe(true)
    })

    it('should handle backspace and deletion', () => {
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: USA_PASSPORT_REGEX })
      )
      
      // Build up valid input
      act(() => {
        result.current.onChange({
          target: { value: 'A12345678' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A12345678')
      expect(result.current.isValid).toBe(true)
      
      // Delete characters
      act(() => {
        result.current.onChange({
          target: { value: 'A1234567' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A1234567')
      expect(result.current.isValid).toBe(true) // Still valid (7-digit format)
      
      // Delete more to make invalid
      act(() => {
        result.current.onChange({
          target: { value: 'A123' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('A123')
      expect(result.current.isValid).toBe(false)
    })
  })

  describe('Controlled Mode', () => {
    it('should use controlled value when provided', () => {
      const { result } = renderHook(() => 
        useIncrementalRegex({ 
          regex: USA_PASSPORT_REGEX,
          value: 'A12345678'
        })
      )
      
      expect(result.current.value).toBe('A12345678')
      expect(result.current.isValid).toBe(true)
    })

    it('should call onChange callback with validated value', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() => 
        useIncrementalRegex({ 
          regex: USA_PASSPORT_REGEX,
          onChange
        })
      )
      
      act(() => {
        result.current.onChange({
          target: { value: 'A123456789' } // Invalid 10-char input
        } as React.ChangeEvent<HTMLInputElement>)
      })
      
      // Should call onChange with truncated valid value
      expect(onChange).toHaveBeenCalledWith('A12345678')
    })

    it('should work with controlled value updates', () => {
      const onChange = vi.fn()
      const { result, rerender } = renderHook(
        ({ value }) => useIncrementalRegex({ 
          regex: USA_PASSPORT_REGEX,
          value,
          onChange
        }),
        { initialProps: { value: '' } }
      )
      
      expect(result.current.value).toBe('')
      
      // Update controlled value
      rerender({ value: 'A12345678' })
      expect(result.current.value).toBe('A12345678')
      expect(result.current.isValid).toBe(true)
    })
  })

  describe('Different Regex Patterns', () => {
    it('should work with simple digit patterns', () => {
      const digitRegex = /^[0-9]{3}$/
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: digitRegex })
      )
      
      act(() => {
        result.current.onChange({
          target: { value: '12A34' } // Letter should be rejected
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('12') // Should stop before invalid char
    })

    it('should work with alternation patterns', () => {
      const catDogRegex = /^(cat|dog)$/
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: catDogRegex })
      )
      
      act(() => {
        result.current.onChange({
          target: { value: 'car' } // 'car' should be truncated to 'ca'
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('ca')
      expect(result.current.isValid).toBe(false)
      
      act(() => {
        result.current.onChange({
          target: { value: 'cat' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('cat')
      expect(result.current.isValid).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty input gracefully', () => {
      const { result } = renderHook(() => 
        useIncrementalRegex({ regex: USA_PASSPORT_REGEX })
      )
      
      act(() => {
        result.current.onChange({
          target: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>)
      })
      expect(result.current.value).toBe('')
      expect(result.current.isValid).toBe(false)
    })

    it('should be stable across re-renders', () => {
      const { result, rerender } = renderHook(() => 
        useIncrementalRegex({ regex: USA_PASSPORT_REGEX })
      )
      
      const firstOnChange = result.current.onChange
      rerender()
      const secondOnChange = result.current.onChange
      
      // Functions should be stable (memoized)
      expect(firstOnChange).toBe(secondOnChange)
    })
  })
})