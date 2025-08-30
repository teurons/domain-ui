"use client"

import { useState } from "react"
import { PhoneInput } from "@workspace/domain-ui-registry/components/domain-ui/experimental/phone-input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/domain-ui-registry/components/ui/card"
import { Badge } from "@workspace/domain-ui-registry/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { isValidPhoneNumber, parsePhoneNumber, getCountryCallingCode } from "react-phone-number-input"
import type { Value as PhoneValue } from "react-phone-number-input"

export default function PhoneInputDemo() {
  const [phoneValue, setPhoneValue] = useState<PhoneValue>()
  const [formPhoneValue, setFormPhoneValue] = useState<PhoneValue>()

  // Parse phone number for detailed information
  const parsePhone = (value: PhoneValue) => {
    if (!value) return null
    
    try {
      const phoneNumber = parsePhoneNumber(value)
      return {
        isValid: isValidPhoneNumber(value),
        country: phoneNumber?.country,
        countryCallingCode: phoneNumber?.countryCallingCode,
        nationalNumber: phoneNumber?.nationalNumber,
        formatInternational: phoneNumber?.formatInternational(),
        formatNational: phoneNumber?.formatNational(),
        uri: phoneNumber?.getURI(),
        type: phoneNumber?.getType()
      }
    } catch {
      return {
        isValid: false,
        country: undefined,
        countryCallingCode: undefined,
        nationalNumber: undefined,
        formatInternational: undefined,
        formatNational: undefined,
        uri: undefined,
        type: undefined
      }
    }
  }

  const phoneData = parsePhone(phoneValue)
  const formPhoneData = parsePhone(formPhoneValue)

  const getValidationIcon = (isValid: boolean | undefined, hasValue: boolean) => {
    if (!hasValue) return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    return isValid ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />
  }

  const getValidationColor = (isValid: boolean | undefined, hasValue: boolean) => {
    if (!hasValue) return "border-input"
    return isValid ? "border-green-500 ring-green-500/20" : "border-red-500 ring-red-500/20"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Phone Input with Validation</h3>
        <p className="text-sm text-muted-foreground">
          Enter a phone number with real-time validation feedback using react-phone-number-input.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <div className="relative">
            <PhoneInput
              value={phoneValue}
              onChange={setPhoneValue}
              placeholder="Enter your phone number"
              className={`transition-colors ${getValidationColor(phoneData?.isValid, !!phoneValue)}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getValidationIcon(phoneData?.isValid, !!phoneValue)}
            </div>
          </div>
          {phoneValue && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={phoneData?.isValid ? "default" : "destructive"}>
                {phoneData?.isValid ? "Valid" : "Invalid"}
              </Badge>
              {phoneData?.isValid && phoneData?.type && (
                <Badge variant="outline">{phoneData.type}</Badge>
              )}
            </div>
          )}
        </div>

        {phoneData && phoneValue && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Phone Number Details
                {getValidationIcon(phoneData.isValid, !!phoneValue)}
              </CardTitle>
              <CardDescription>
                Parsed information from react-phone-number-input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Raw Value:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneValue || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Country:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.country || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Country Code:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    +{phoneData.countryCallingCode || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">National Number:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.nationalNumber || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">International Format:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.formatInternational || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">National Format:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.formatNational || "—"}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <span className="font-medium">Tel URI:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono break-all">
                    {phoneData.uri || "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-medium">Form Example with Validation</h4>
        <form className="max-w-md space-y-4">
          <div>
            <label htmlFor="phone" className="mb-2 block font-medium text-sm">
              Phone Number *
            </label>
            <div className="relative">
              <PhoneInput
                value={formPhoneValue}
                onChange={setFormPhoneValue}
                defaultCountry="US"
                placeholder="Enter a valid phone number"
                className={`transition-colors ${getValidationColor(formPhoneData?.isValid, !!formPhoneValue)}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getValidationIcon(formPhoneData?.isValid, !!formPhoneValue)}
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                Select your country and enter your phone number
              </p>
              {formPhoneValue && (
                <Badge 
                  variant={formPhoneData?.isValid ? "default" : "destructive"}
                  className="text-xs"
                >
                  {formPhoneData?.isValid ? "Valid" : "Invalid"}
                </Badge>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={!formPhoneData?.isValid}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-medium">Test Examples</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Valid Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="font-mono">+1 555 123 4567 (US)</div>
              <div className="font-mono">+44 20 7946 0958 (UK)</div>
              <div className="font-mono">+91 98765 43210 (India)</div>
              <div className="font-mono">+49 30 12345678 (Germany)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Invalid Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="font-mono">123 (Too short)</div>
              <div className="font-mono">+1 000 000 0000 (Invalid US)</div>
              <div className="font-mono">abc123def (Non-numeric)</div>
              <div className="font-mono">+999 123 456 789 (Invalid country)</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
