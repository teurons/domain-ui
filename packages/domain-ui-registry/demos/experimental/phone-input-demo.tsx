"use client"

import { useState } from "react"
import { PhoneInput, getPhoneData, type PhoneData } from "@workspace/domain-ui-registry/components/domain-ui/experimental/phone-input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/domain-ui-registry/components/ui/card"
import { Badge } from "@workspace/domain-ui-registry/components/ui/badge"

export default function PhoneInputDemo() {
  const [phoneValue, setPhoneValue] = useState("")
  const [phoneData, setPhoneData] = useState<PhoneData | null>(null)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Phone Input</h3>
        <p className="text-sm text-muted-foreground">
          Enter a phone number with country selection and automatic formatting.
        </p>
      </div>

      <div className="space-y-4">
        <PhoneInput
          value={phoneValue}
          onChange={setPhoneValue}
          onPhoneDataChange={setPhoneData}
          placeholder="Enter your phone number"
        />

        {phoneData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phone Data</CardTitle>
              <CardDescription>
                Information extracted from the phone number using the getPhoneData utility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Phone number:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.phoneNumber || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Country code:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.countryCode}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Country calling code:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.countryCallingCode}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">National number:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.nationalNumber || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">International number:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                    {phoneData.internationalNumber || "—"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">URI:</span>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono break-all">
                    {phoneData.uri || "—"}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-medium">Validation status:</span>
                <div className="mt-1">
                  <Badge variant={phoneData.isValid ? "default" : "secondary"}>
                    {phoneData.isValid ? "Valid" : "Invalid"}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="font-medium">Possible countries:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {phoneData.possibleCountries.map((country: string) => (
                    <Badge key={country} variant="outline" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-medium">Form Example</h4>
        <form className="space-y-4 max-w-md">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number *
            </label>
            <PhoneInput
              defaultCountry="US"
              placeholder="Enter a valid phone number"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select your country and enter your phone number
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
