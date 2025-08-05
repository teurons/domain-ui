"use client";

import { useState, type ChangeEvent } from "react";
import { RegexInput } from "@workspace/domain-ui-registry/components/domain-ui/regex-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/domain-ui-registry/components/ui/card";
import { Badge } from "@workspace/domain-ui-registry/components/ui/badge";
import { Label } from "@workspace/domain-ui-registry/components/ui/label";

// Regex pattern for Indian PAN validation
const PAN_REGEX = /^[A-Z]{3}[PCFTABGHLJE]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;

export function PanInput() {
  const [pan, setPan] = useState("");
  const isValid = PAN_REGEX.test(pan);
  const hasValue = pan.length > 0;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPan(e.target.value);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          PAN Number
          {hasValue && (
            <Badge variant={isValid ? "default" : "secondary"}>
              {isValid ? "✓ Valid" : "Invalid"}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Indian PAN format: 3 letters, specific 4th letter, 1 letter, 4 digits, 1
          letter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="pan">PAN Number</Label>
          <RegexInput
            id="pan"
            regex={PAN_REGEX}
            placeholder="ABCDE1234F"
            value={pan}
            onChange={handleChange}
          />
          <p className="text-muted-foreground text-sm">
            Try typing: abcp1234f (lowercase will auto-convert to uppercase)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}