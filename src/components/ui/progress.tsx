interface ProgressProps {
  value: number
  max: number
  label: string
  className?: string
}

// Native <progress>, styled through its browser pseudo-elements
export function Progress({ value, max, label, className = '' }: ProgressProps) {
  return (
    <progress
      value={Math.min(value, max)}
      max={max}
      aria-label={label}
      className={`h-2 w-full appearance-none overflow-hidden rounded-full bg-gray-200 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary-500 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary-500 ${className}`}
    />
  )
}
