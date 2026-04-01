interface ConcentricCirclesProps {
  size?: number
  color?: string
  opacity?: number
  className?: string
  style?: React.CSSProperties
}

export function ConcentricCircles({
  size = 600,
  color = '#0D1F6E',
  opacity = 0.06,
  className = '',
  style = {},
}: ConcentricCirclesProps) {
  const circles = Array.from({ length: 12 }, (_, i) => ({
    r: (size / 2) * ((i + 1) / 12),
  }))

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
      aria-hidden="true"
    >
      {circles.map((c, i) => (
        <circle
          key={i}
          cx={size / 2}
          cy={size / 2}
          r={c.r}
          fill="none"
          stroke={color}
          strokeWidth={0.8}
          opacity={opacity}
        />
      ))}
    </svg>
  )
}
