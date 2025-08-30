"use client"

import * as React from "react"
import { PortfolioChart, PortfolioDataPoint } from "@workspace/domain-ui-registry/components/domain-ui/experimental/portfolio-chart"

// Seeded random function for deterministic data generation
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10_000
  return x - Math.floor(x)
}

// Generate sample portfolio data with deterministic values
const generatePortfolioData = (days: number, startValue = 10_000): PortfolioDataPoint[] => {
  const data: PortfolioDataPoint[] = []
  // Use a fixed base timestamp for consistent SSR/client rendering
  const baseTimestamp = new Date('2024-01-01').getTime()
  const msPerDay = 24 * 60 * 60 * 1000
  
  let currentValue = startValue
  
  for (let i = days; i >= 0; i--) {
    const timestamp = baseTimestamp + ((days - i) * msPerDay)
    
    // Add some realistic market volatility using seeded random
    const seed = i + days * 1000 // Deterministic seed
    const dailyChange = (seededRandom(seed) - 0.5) * 0.04 // ±2% daily change
    const trendFactor = Math.sin((days - i) / days * Math.PI) * 0.001 // Slight upward trend
    
    currentValue *= (1 + dailyChange + trendFactor)
    
    data.push({
      timestamp,
      value: Math.round(currentValue * 100) / 100
    })
  }
  
  return data
}

// Different datasets for different time periods
const portfolioDatasets = {
  "1D": generatePortfolioData(1, 10_000),
  "1W": generatePortfolioData(7, 10_000),
  "1M": generatePortfolioData(30, 10_000),
  "3M": generatePortfolioData(90, 10_000),
  "1Y": generatePortfolioData(365, 10_000),
  "ALL": generatePortfolioData(1095, 8000) // 3 years of data
}

export default function PortfolioChartDemo() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("1M")
  const [currentData, setCurrentData] = React.useState(portfolioDatasets["1M"])

  const handleTimePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    setCurrentData(portfolioDatasets[period as keyof typeof portfolioDatasets])
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Portfolio Chart</h2>
        <p className="text-muted-foreground">
          A Robinhood-style portfolio chart with interactive time period selection and hover tooltips.
        </p>
      </div>

      {/* Main Portfolio Chart */}
      <div className="border rounded-lg p-6 bg-card">
        <PortfolioChart
          data={currentData}
          height={300}
          selectedTimePeriod={selectedPeriod}
          onTimePeriodChange={handleTimePeriodChange}
          showGrid={true}
          showTooltip={true}
        />
      </div>

      {/* Multiple Chart Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compact Chart */}
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-4">Compact View</h3>
          <PortfolioChart
            data={portfolioDatasets["1W"]}
            height={150}
            showGrid={false}
            timePeriods={[
              { label: "1D", value: "1D", days: 1 },
              { label: "1W", value: "1W", days: 7 },
              { label: "1M", value: "1M", days: 30 }
            ]}
            selectedTimePeriod="1W"
          />
        </div>

        {/* Losing Portfolio */}
        <div className="border rounded-lg p-4 bg-card">
          <h3 className="text-lg font-semibold mb-4">Declining Portfolio</h3>
          <PortfolioChart
            data={generatePortfolioData(30, 10000).map(point => ({
              ...point,
              value: point.value * 0.85 // Make it decline
            }))}
            height={150}
            showGrid={false}
            timePeriods={[
              { label: "1M", value: "1M", days: 30 }
            ]}
            selectedTimePeriod="1M"
          />
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">📊 Interactive Charts</h4>
            <p className="text-muted-foreground">
              Hover over the chart to see detailed values and timestamps with smooth animations.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">📅 Time Periods</h4>
            <p className="text-muted-foreground">
              Switch between different time periods (1D, 1W, 1M, 3M, 1Y, ALL) with customizable options.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">🎨 Dynamic Colors</h4>
            <p className="text-muted-foreground">
              Automatically changes colors based on portfolio performance (green for gains, red for losses).
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">💰 Currency Formatting</h4>
            <p className="text-muted-foreground">
              Displays values in proper currency format with percentage changes.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">📱 Responsive Design</h4>
            <p className="text-muted-foreground">
              Works on all screen sizes with customizable dimensions and grid options.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">🎯 Precise Tooltips</h4>
            <p className="text-muted-foreground">
              Smart tooltip positioning that follows your cursor with detailed information.
            </p>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Usage Examples</h3>
        <div className="bg-muted rounded-lg p-4 text-sm font-mono">
          <div className="text-muted-foreground mb-2">// Basic usage</div>
          <div>{"<PortfolioChart data={portfolioData} />"}</div>
          
          <div className="text-muted-foreground mb-2 mt-4">{/* With custom dimensions and time periods */}</div>
          <div>{`<PortfolioChart
  data={portfolioData}
  height={400}
  selectedTimePeriod="1M"
  onTimePeriodChange={handlePeriodChange}
  showGrid={true}
  showTooltip={true}
/>`}</div>
        </div>
      </div>
    </div>
  )
}
