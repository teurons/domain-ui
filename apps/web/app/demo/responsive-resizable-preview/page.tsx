import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";
import { Button } from "@workspace/shadverse/components/button";
import { Badge } from "@workspace/shadverse/components/badge";

export default function ResponsiveResizablePreviewDemoPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          Responsive Design Demo
        </h1>
        <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
          This page demonstrates responsive behavior across different screen sizes.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📱 Mobile First
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Designed for mobile devices and scales up beautifully.
            </p>
            <Badge className="mt-3" variant="secondary">
              Responsive
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Clean Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Modern interface that adapts to all screen sizes.
            </p>
            <Badge className="mt-3" variant="outline">
              Modern
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Fast Loading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Optimized performance across all devices and screen sizes.
            </p>
            <Badge className="mt-3">Optimized</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-center text-xl font-semibold md:text-2xl">
          Responsive Navigation
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h3 className="font-medium">Adaptive Layout</h3>
                <p className="text-muted-foreground text-sm">
                  Elements stack on mobile and align horizontally on larger screens.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
                <Button variant="ghost" size="sm">
                  About
                </Button>
                <Button variant="ghost" size="sm">
                  Contact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary md:text-3xl">10K+</div>
          <p className="text-muted-foreground text-sm">Users</p>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary md:text-3xl">99.9%</div>
          <p className="text-muted-foreground text-sm">Uptime</p>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary md:text-3xl">50+</div>
          <p className="text-muted-foreground text-sm">Countries</p>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary md:text-3xl">24/7</div>
          <p className="text-muted-foreground text-sm">Support</p>
        </div>
      </div>

      <footer className="border-t pt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Perfect for testing with the responsive resizable preview component.
        </p>
      </footer>
    </div>
  );
}