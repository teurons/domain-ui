import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegexInput } from '../components/domain-ui/regex-input'

describe('RegexInput Advanced Features', () => {
  const USA_PASSPORT_REGEX = /^(?:[A-Z][0-9]{8}|[0-9]{9}|[A-Z][0-9]{7})$/

  describe('Live Validation (Always Enabled)', () => {
    it('should always enable live validation by default', () => {
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Type invalid input - should be truncated with live validation always on
      fireEvent.change(input, { target: { value: 'AB123456789' } }) // Invalid: two letters
      expect(input).toHaveValue('A') // Should stop at valid prefix
    })
  })

  describe('Default Value Handling (Auto-configured)', () => {
    it('should accept default value and skip validation initially by default', () => {
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          defaultValue="InvalidDefault123"
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      expect(input).toHaveValue('InvalidDefault123') // Should accept invalid default
    })

    it('should apply live validation after first interaction', () => {
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          defaultValue="A123"
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      expect(input).toHaveValue('A123')
      
      // First interaction should enable live validation
      fireEvent.change(input, { target: { value: 'A123B456' } }) // B is invalid after digits
      expect(input).toHaveValue('A123') // Should reject B
    })
  })

  describe('Paste Handling', () => {
    it('should accept valid pasted content', () => {
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Simulate pasting valid content
      fireEvent.change(input, { target: { value: 'A12345678' } })
      
      expect(input).toHaveValue('A12345678')
    })

    it('should accept invalid pasted content but mark as invalid', () => {
      const onValidationChange = vi.fn()
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          onValidationChange={onValidationChange}
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Simulate paste event first
      fireEvent.paste(input)
      
      // Then simulate the change from paste (e.g., "12345678A" - wrong format)
      fireEvent.change(input, { target: { value: '12345678A' } })
      
      // Should accept the invalid content
      expect(input).toHaveValue('12345678A')
      
      // But should be marked as invalid
      expect(onValidationChange).toHaveBeenCalledWith('invalid', 'invalid-format')
    })
  })

  describe('Basic Input Functionality', () => {
    it('should handle input normally without visual styling', () => {
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Type complete valid input - RegexInput has no visual styling by default
      fireEvent.change(input, { target: { value: 'A12345678' } })
      expect(input).toHaveValue('A12345678')
    })

    it('should handle incomplete input', () => {
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Type incomplete input
      fireEvent.change(input, { target: { value: 'A123' } })
      expect(input).toHaveValue('A123')
    })
  })

  describe('Validation Callbacks', () => {
    it('should call onValidationChange for incomplete input', () => {
      const onValidationChange = vi.fn()
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          onValidationChange={onValidationChange}
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Type incomplete input
      fireEvent.change(input, { target: { value: 'A123' } })
      expect(onValidationChange).toHaveBeenCalledWith('potentially-valid', 'incomplete')
    })

    it('should call onValidationChange for valid input', () => {
      const onValidationChange = vi.fn()
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX} 
          onValidationChange={onValidationChange}
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      fireEvent.change(input, { target: { value: 'A12345678' } })
      expect(onValidationChange).toHaveBeenCalledWith('valid', null)
    })

  })

  describe('Validation States', () => {
    it('should call onValidationChange with correct states', () => {
      const onValidationChange = vi.fn()
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX}
          onValidationChange={onValidationChange}
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Test potentially valid state
      fireEvent.change(input, { target: { value: 'A' } })
      expect(onValidationChange).toHaveBeenCalledWith('potentially-valid', 'incomplete')
      
      // Test valid state  
      fireEvent.change(input, { target: { value: 'A12345678' } })
      expect(onValidationChange).toHaveBeenCalledWith('valid', null)
    })
  })

  describe('Integration with onChange callback', () => {
    it('should call onChange with validated value', () => {
      const onChange = vi.fn()
      render(
        <RegexInput 
          regex={USA_PASSPORT_REGEX}
          onChange={onChange}
          data-testid="input"
        />
      )
      
      const input = screen.getByTestId('input')
      
      // Type invalid input
      fireEvent.change(input, { target: { value: 'A123456789' } }) // Too long
      
      // Should call onChange with truncated valid value
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'A12345678' // Truncated to valid length
          })
        })
      )
    })
  })
})