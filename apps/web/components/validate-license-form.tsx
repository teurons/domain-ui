"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/shadverse/components/button";
import { Input } from "@workspace/shadverse/components/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/shadverse/components/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/shadverse/components/card";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { cn } from "@workspace/shadverse/lib/utils";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/shadverse/components/alert";

const validateSchema = z.object({
  licenseKey: z.string().min(1, { message: "License key is required." }),
});

interface ValidateFormData {
  licenseKey: string;
}

interface ValidateLicenseFormProps {
  logo?: React.ReactNode;
  className?: string;
  onSubmit: (data: ValidateFormData) => void | Promise<void>;
  description?: React.ReactNode;
  error?: string | null;
}

export function ValidateLicenseForm({
  logo,
  className,
  description,
  onSubmit,
  error,
}: ValidateLicenseFormProps) {
  const [showKey, setShowKey] = React.useState(false);
  const form = useForm<ValidateFormData>({
    resolver: zodResolver(validateSchema),
    defaultValues: { licenseKey: "" },
  });

  return (
    <div
      className={cn("flex min-h-[60vh] items-center justify-center", className)}
    >
      <Card className="w-full rounded-2xl border-none bg-background/90 shadow-xl backdrop-blur dark:bg-background/80">
        <CardHeader className="flex flex-col items-center gap-2 pb-0">
          {logo && (
            <span className="mb-2 rounded-full bg-primary/10 p-3 shadow">
              {logo}
            </span>
          )}
          <CardTitle className="text-center font-semibold text-xl tracking-tight">
            Enter your key
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="licenseKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Key</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                        <Input
                          type={showKey ? "text" : "password"}
                          autoComplete="off"
                          placeholder="Enter your key"
                          className="border border-border bg-background/80 pr-10 pl-10 text-base transition focus:ring-2 focus:ring-primary/30"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground transition hover:text-primary"
                          onClick={() => setShowKey((v) => !v)}
                          aria-label={
                            showKey ? "Hide product key" : "Show product key"
                          }
                        >
                          {showKey ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="sm"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Checking..." : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <span className="text-muted-foreground text-xs">
            Powered by <span className="font-semibold">Polar</span>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ValidateLicenseForm;
