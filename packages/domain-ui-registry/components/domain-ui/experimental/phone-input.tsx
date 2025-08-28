"use client"

import * as React from "react"
import { Input } from "@workspace/domain-ui-registry/components/ui/input"
import { cn } from "@workspace/domain-ui-registry/lib/utils"

// Country data with flags, names, and calling codes
const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", dialCode: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", dialCode: "+34" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dialCode: "+31" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", dialCode: "+32" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", dialCode: "+41" },
  { code: "AT", name: "Austria", flag: "🇦🇹", dialCode: "+43" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", dialCode: "+46" },
  { code: "NO", name: "Norway", flag: "🇳🇴", dialCode: "+47" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", dialCode: "+45" },
  { code: "FI", name: "Finland", flag: "🇫🇮", dialCode: "+358" },
  { code: "PL", name: "Poland", flag: "🇵🇱", dialCode: "+48" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", dialCode: "+420" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", dialCode: "+36" },
  { code: "RO", name: "Romania", flag: "🇷🇴", dialCode: "+40" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", dialCode: "+359" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", dialCode: "+385" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", dialCode: "+386" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", dialCode: "+421" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", dialCode: "+370" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", dialCode: "+371" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", dialCode: "+372" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", dialCode: "+353" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "GR", name: "Greece", flag: "🇬🇷", dialCode: "+30" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", dialCode: "+357" },
  { code: "MT", name: "Malta", flag: "🇲🇹", dialCode: "+356" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", dialCode: "+352" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", dialCode: "+354" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", dialCode: "+82" },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", dialCode: "+852" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", dialCode: "+886" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", dialCode: "+60" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", dialCode: "+66" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", dialCode: "+64" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dialCode: "+52" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", dialCode: "+54" },
  { code: "CL", name: "Chile", flag: "🇨🇱", dialCode: "+56" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", dialCode: "+57" },
  { code: "PE", name: "Peru", flag: "🇵🇪", dialCode: "+51" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", dialCode: "+598" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", dialCode: "+595" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", dialCode: "+591" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", dialCode: "+593" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", dialCode: "+58" }
]

export interface PhoneData {
  phoneNumber: string
  countryCode: string
  countryCallingCode: string
  nationalNumber: string
  internationalNumber: string
  uri: string
  possibleCountries: string[]
  isValid: boolean
}

export interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  onPhoneDataChange?: (data: PhoneData) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultCountry?: string
}

// Format phone number based on country
const formatPhoneNumber = (value: string, countryCode: string): string => {
  const digits = value.replace(/\D/g, "")
  
  if (countryCode === "US" || countryCode === "CA") {
    // Format: (XXX) XXX-XXXX
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
  
  // International format: add spaces every 3-4 digits
  if (digits.length <= 4) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`
}

// Validate phone number based on country
const validatePhoneNumber = (digits: string, countryCode: string): boolean => {
  if (countryCode === "US" || countryCode === "CA") {
    return digits.length === 10 && digits[0] !== "0" && digits[0] !== "1"
  }
  
  // Basic international validation
  return digits.length >= 7 && digits.length <= 15
}

// Extract phone data utility
export const getPhoneData = (phoneNumber: string, selectedCountry: string): PhoneData => {
  const country = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]
  const digits = phoneNumber.replace(/\D/g, "")
  
  const nationalNumber = digits
  const internationalNumber = country.dialCode + digits
  const isValid = validatePhoneNumber(digits, selectedCountry)
  
  // Find possible countries based on phone number patterns
  const possibleCountries = COUNTRIES
    .filter(c => {
      if (c.code === selectedCountry) return true
      // Simple heuristic: same dial code or similar number length
      return c.dialCode === country.dialCode
    })
    .map(c => c.code)

  return {
    phoneNumber,
    countryCode: selectedCountry,
    countryCallingCode: country.dialCode,
    nationalNumber,
    internationalNumber,
    uri: `tel:${internationalNumber}`,
    possibleCountries,
    isValid
  }
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, onPhoneDataChange, placeholder = "Enter phone number", disabled, className, defaultCountry = "US" }, ref) => {
    const [selectedCountry, setSelectedCountry] = React.useState(defaultCountry)
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [inputValue, setInputValue] = React.useState(value)
    
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const searchRef = React.useRef<HTMLInputElement>(null)

    const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]

    // Filter countries based on search
    const filteredCountries = React.useMemo(() => {
      if (!searchQuery) return COUNTRIES
      return COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dialCode.includes(searchQuery)
      )
    }, [searchQuery])

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formattedValue = formatPhoneNumber(rawValue, selectedCountry)
      
      setInputValue(formattedValue)
      onChange?.(formattedValue)
      
      // Generate phone data
      const phoneData = getPhoneData(formattedValue, selectedCountry)
      onPhoneDataChange?.(phoneData)
    }

    // Handle country selection
    const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
      setSelectedCountry(country.code)
      setIsDropdownOpen(false)
      setSearchQuery("")
      
      // Reformat current input for new country
      const formattedValue = formatPhoneNumber(inputValue, country.code)
      setInputValue(formattedValue)
      onChange?.(formattedValue)
      
      const phoneData = getPhoneData(formattedValue, country.code)
      onPhoneDataChange?.(phoneData)
    }

    // Handle click outside to close dropdown
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false)
          setSearchQuery("")
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Focus search when dropdown opens
    React.useEffect(() => {
      if (isDropdownOpen && searchRef.current) {
        searchRef.current.focus()
      }
    }, [isDropdownOpen])

    // Update input value when prop changes
    React.useEffect(() => {
      setInputValue(value)
    }, [value])

    return (
      <div className="relative">
        <div className="flex">
          {/* Country Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border border-r-0 rounded-l-md bg-background hover:bg-accent transition-colors h-10",
                "border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="text-base">{selectedCountryData.flag}</span>
              <span className="text-sm font-mono text-muted-foreground">{selectedCountryData.dialCode}</span>
              <svg
                className={cn("w-4 h-4 transition-transform text-muted-foreground", isDropdownOpen && "rotate-180")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-50 w-80 mt-1 bg-popover border rounded-md shadow-lg border-border">
                {/* Search */}
                <div className="p-2 border-b border-border">
                  <Input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search countries..."
                    className="h-8 text-sm"
                  />
                </div>

                {/* Countries List */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors text-sm",
                        selectedCountry === country.code && "bg-accent"
                      )}
                    >
                      <span className="text-base">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{country.name}</div>
                        <div className="text-xs text-muted-foreground">{country.code}</div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{country.dialCode}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No countries found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phone Input */}
          <Input
            ref={ref}
            type="tel"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("rounded-l-none border-l-0", className)}
          />
        </div>
      </div>
    )
  }
)

PhoneInput.displayName = "PhoneInput"
