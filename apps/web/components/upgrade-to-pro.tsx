"use client";

import { Button } from "@workspace/shadverse/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";

export function UpgradeToPro() {
  const handleUpgrade = () => {
    window.location.href = "/checkout";
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock premium features and get access to advanced functionality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleUpgrade} className="w-full">
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  );
}
