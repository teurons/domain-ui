"use client"

import * as React from "react"
import { cn } from "@workspace/domain-ui-registry/lib/utils"

export interface PortfolioDataPoint {
  timestamp: number
  value: number
}

export interface PortfolioChartProps {
  data: PortfolioDataPoint[]
  className?: string
  width?: number
  height?: number
  showGrid?: boolean
  showTooltip?: boolean
  lineColor?: string
  fillColor?: string
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

export function PortfolioChart({
  data,
  className,
  width = 400,
  height = 200,
  showGrid = true,
  showTooltip = true,
  lineColor = "#00C805",
  fillColor = "rgba(0, 200, 5, 0.1)",
  timePeriods = DEFAULT_TIME_PERIODS,
  onTimePeriodChange,
  selectedTimePeriod = "1D"
}: PortfolioChartProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<PortfolioDataPoint | null>(null)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const svgRef = React.useRef<SVGSVGElement>(null)

  // Calculate chart dimensions with padding
  const padding = { top: 20, right: 20, bottom: 40, left: 20 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Calculate data bounds
  const minValue = data.length > 0 ? Math.min(...data.map(d => d.value)) : 0
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0
  const minTime = data.length > 0 ? Math.min(...data.map(d => d.timestamp)) : 0
  const maxTime = data.length > 0 ? Math.max(...data.map(d => d.timestamp)) : 0

  // Add some padding to the value range
  const valueRange = maxValue - minValue
  const paddedMinValue = minValue - valueRange * 0.1
  const paddedMaxValue = maxValue + valueRange * 0.1

  // Scale functions
  const xScale = (timestamp: number) => 
    ((timestamp - minTime) / (maxTime - minTime)) * chartWidth

  const yScale = (value: number) => 
    chartHeight - ((value - paddedMinValue) / (paddedMaxValue - paddedMinValue)) * chartHeight

  // Generate path for the line chart
  const linePath = data.reduce((path, point, index) => {
    const x = xScale(point.timestamp)
    const y = yScale(point.value)
    return path + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`)
  }, "")

  // Generate path for the filled area
  const areaPath = data.length > 0 ? linePath + 
    ` L ${xScale(data[data.length - 1]!.timestamp)} ${chartHeight}` +
    ` L ${xScale(data[0]!.timestamp)} ${chartHeight} Z` : ""

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const mouseX = event.clientX - rect.left - padding.left
    const mouseY = event.clientY - rect.top - padding.top

    // Find closest data point
    const relativeX = mouseX / chartWidth
    const targetTimestamp = minTime + (maxTime - minTime) * relativeX
    
    let closestPoint = data[0]!
    let minDistance = Math.abs(data[0]!.timestamp - targetTimestamp)
    
    for (const point of data) {
      const distance = Math.abs(point.timestamp - targetTimestamp)
      if (distance < minDistance) {
        minDistance = distance
        closestPoint = point
      }
    }

    setHoveredPoint(closestPoint)
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  // Determine if portfolio is up or down
  const isPositive = data.length > 1 && data[data.length - 1].value >= data[0].value
  const currentLineColor = isPositive ? "#00C805" : "#FF3B30"
  const currentFillColor = isPositive ? "rgba(0, 200, 5, 0.1)" : "rgba(255, 59, 48, 0.1)"

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Calculate percentage change
  const calculateChange = () => {
    if (data.length < 2) return { amount: 0, percentage: 0 }
    const start = data[0]!.value
    const end = data[data.length - 1]!.value
    const amount = end - start
    const percentage = (amount / start) * 100
    return { amount, percentage }
  }

  const change = calculateChange()

  return (
    <div className={cn("relative", className)}>
      {/* Header with current value and change */}
      <div className="mb-4">
        <div className="text-2xl font-bold">
          {formatCurrency(hoveredPoint?.value || data[data.length - 1]?.value || 0)}
        </div>
        <div className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? "+" : ""}{formatCurrency(change.amount)} ({isPositive ? "+" : ""}{change.percentage.toFixed(2)}%)
        </div>
        {hoveredPoint && (
          <div className="text-xs text-muted-foreground">
            {formatDate(hoveredPoint.timestamp)}
          </div>
        )}
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
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-20">
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={`h-${ratio}`}
                  x1={padding.left}
                  y1={padding.top + ratio * chartHeight}
                  x2={padding.left + chartWidth}
                  y2={padding.top + ratio * chartHeight}
                  stroke="currentColor"
                  strokeWidth={0.5}
                />
              ))}
              {/* Vertical grid lines */}
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
                <line
                  key={`v-${ratio}`}
                  x1={padding.left + ratio * chartWidth}
                  y1={padding.top}
                  x2={padding.left + ratio * chartWidth}
                  y2={padding.top + chartHeight}
                  stroke="currentColor"
                  strokeWidth={0.5}
                />
              ))}
            </g>
          )}

          {/* Chart area */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Filled area */}
            <path
              d={areaPath}
              fill={currentFillColor}
              className="transition-colors duration-200"
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke={currentLineColor}
              strokeWidth={2}
              className="transition-colors duration-200"
            />

            {/* Hover indicator */}
            {hoveredPoint && (
              <circle
                cx={xScale(hoveredPoint.timestamp)}
                cy={yScale(hoveredPoint.value)}
                r={4}
                fill={currentLineColor}
                stroke="white"
                strokeWidth={2}
                className="drop-shadow-sm"
              />
            )}
          </g>
        </svg>

        {/* Tooltip */}
        {showTooltip && hoveredPoint && (
          <div
            className="fixed z-50 px-2 py-1 text-xs bg-popover border rounded shadow-lg pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="font-medium">{formatCurrency(hoveredPoint.value)}</div>
            <div className="text-muted-foreground">{formatDate(hoveredPoint.timestamp)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
