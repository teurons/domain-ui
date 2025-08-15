import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";
import { Button } from "@workspace/shadverse/components/button";
import { Badge } from "@workspace/shadverse/components/badge";

export default function ResponsivePreviewDemoPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div className="space-y-4 text-center">
        <h1 className="font-bold text-3xl tracking-tight">
          Responsive Preview Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          This page demonstrates how components adapt across different screen
          sizes. Use this URL in the iframe example:
          <code className="mx-1 rounded bg-muted px-2 py-1 text-sm">
            /demo/responsive-preview
          </code>
        </p>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <section className="space-y-4 text-center">
          <h2 className="font-semibold text-2xl">Welcome to Our Platform</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Experience our responsive design across mobile, tablet, and desktop
            viewports. Every element adapts beautifully to different screen
            sizes.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="space-y-6">
          <h3 className="text-center font-semibold text-xl">Features</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📱 Mobile First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Designed for mobile devices and scales up to larger screens
                  seamlessly.
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="secondary">Responsive</Badge>
                  <Badge variant="outline">Modern</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎨 Beautiful Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Clean, modern interface that works across all devices and
                  screen sizes.
                </p>
                <Button className="mt-4" size="sm">
                  View Gallery
                </Button>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Fast Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Optimized for speed on all devices. Notice how this card spans
                  2 columns on tablet but 1 on desktop.
                </p>
                <div className="mt-4">
                  <Badge variant="default">Optimized</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation Example */}
        <section className="space-y-4">
          <h3 className="text-center font-semibold text-xl">Navigation</h3>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-2">
                  <h4 className="font-medium">Adaptive Navigation</h4>
                  <p className="text-muted-foreground text-sm">
                    Menu items stack vertically on mobile and align horizontally
                    on desktop.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="ghost" size="sm">
                    Home
                  </Button>
                  <Button variant="ghost" size="sm">
                    About
                  </Button>
                  <Button variant="ghost" size="sm">
                    Services
                  </Button>
                  <Button variant="ghost" size="sm">
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="space-y-6">
          <h3 className="text-center font-semibold text-xl">Statistics</h3>
          <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="font-bold text-2xl text-primary">10K+</div>
                <p className="text-muted-foreground text-sm">Active Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="font-bold text-2xl text-primary">99.9%</div>
                <p className="text-muted-foreground text-sm">Uptime</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="font-bold text-2xl text-primary">50+</div>
                <p className="text-muted-foreground text-sm">Countries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="font-bold text-2xl text-primary">24/7</div>
                <p className="text-muted-foreground text-sm">Support</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            This demo page showcases responsive design patterns. Perfect for
            testing with the responsive preview component.
          </p>
        </footer>
      </div>
    </div>
  );
}
