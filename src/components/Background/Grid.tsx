export default function Grid() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </pattern>

        <radialGradient id="fade" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <mask id="mask">
          <rect width="100%" height="100%" fill="url(#fade)" />
        </mask>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        mask="url(#mask)"
        className="text-white"
      />
    </svg>
  )
}
