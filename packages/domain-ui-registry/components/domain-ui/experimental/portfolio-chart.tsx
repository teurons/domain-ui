"use client"

import * as React from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { cn } from "@workspace/domain-ui-registry/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/domain-ui-registry/components/ui/chart"

export interface PortfolioDataPoint {
  timestamp: number
  value: number
}

export interface PortfolioChartProps {
  data: PortfolioDataPoint[]
  className?: string
  height?: number
  showGrid?: boolean
  showTooltip?: boolean
  timePeriods?: Array<{
    label: string
    value: string
    days: number
  }>
  onTimePeriodChange?: (period: string) => void
  selectedTimePeriod?: string
}

const DEFAULT_TIME_PERIODS = [
  { label: "1D", value: "1D", days: 1 },
  { label: "1W", value: "1W", days: 7 },
  { label: "1M", value: "1M", days: 30 },
  { label: "3M", value: "3M", days: 90 },
  { label: "1Y", value: "1Y", days: 365 },
  { label: "ALL", value: "ALL", days: -1 }
]

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PortfolioChart({
  data,
  className,
  height = 200,
  showGrid = true,
  showTooltip = true,
  timePeriods = DEFAULT_TIME_PERIODS,
  onTimePeriodChange,
  selectedTimePeriod = "1D"
}: PortfolioChartProps) {
  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    return data.map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
      date: new Date(point.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: new Date(point.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }))
  }, [data])

  // Determine if portfolio is up or down
  const isPositive = data.length > 1 && 
    data[data.length - 1]?.value !== undefined && 
    data[0]?.value !== undefined && 
    data[data.length - 1].value >= data[0].value
  const currentColor = isPositive ? "#00C805" : "#FF3B30"

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  // Calculate percentage change
  const calculateChange = () => {
    if (data.length < 2) return { amount: 0, percentage: 0 }
    const start = data[0]?.value || 0
    const end = data[data.length - 1]?.value || 0
    const amount = end - start
    const percentage = start !== 0 ? (amount / start) * 100 : 0
    return { amount, percentage }
  }

  const change = calculateChange()
  const currentValue = data[data.length - 1]?.value || 0

  return (
    <div className={cn("relative", className)}>
      {/* Header with current value and change */}
      <div className="mb-4">
        <div className="text-2xl font-bold">
          {formatCurrency(currentValue)}
        </div>
        <div className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? "+" : ""}{formatCurrency(change.amount)} ({isPositive ? "+" : ""}{change.percentage.toFixed(2)}%)
        </div>
      </div>

      {/* Time period selector */}
      <div className="flex gap-1 mb-4">
        {timePeriods.map((period) => (
          <button
            key={period.value}
            onClick={() => onTimePeriodChange?.(period.value)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded transition-colors",
              selectedTimePeriod === period.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ChartContainer
        config={chartConfig}
        className={cn("h-[200px]", `h-[${height}px]`)}
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          {showGrid && (
            <>
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                hide
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                hide
              />
            </>
          )}
          {showTooltip && (
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => (
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">
                        {formatCurrency(value as number)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {props.payload?.date} at {props.payload?.time}
                      </div>
                    </div>
                  )}
                />
              }
            />
          )}
          <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={currentColor}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={currentColor}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            type="monotone"
            fill="url(#fillValue)"
            fillOpacity={0.4}
            stroke={currentColor}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: currentColor,
              stroke: "white",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
