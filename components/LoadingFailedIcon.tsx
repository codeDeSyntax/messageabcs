interface LoadingFailedIconProps {
  className?: string;
}

export function LoadingFailedIcon({
  className = "h-16 w-16",
}: LoadingFailedIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle
        cx="60"
        cy="60"
        r="55"
        fill="currentColor"
        className="text-gray-100 dark:text-gray-800"
        opacity="0.1"
      />

      {/* Cloud shape */}
      <path
        d="M35 55C35 47.268 41.268 41 49 41C51.2 41 53.267 41.6 55 42.667C57.667 38.4 62.4 35.5 67.833 35.5C75.567 35.5 81.833 41.767 81.833 49.5C81.833 50.133 81.8 50.767 81.7 51.367C84.567 52.667 86.5 55.533 86.5 59C86.5 63.7 82.7 67.5 78 67.5H40C34.5 67.5 30 63 30 57.5C30 52.7 33.1 48.8 37.4 47.9C35.9 50.1 35 52.9 35 55Z"
        fill="currentColor"
        className="text-gray-400 dark:text-gray-500"
      />

      {/* WiFi/Connection bars with X */}
      <g className="text-gray-300 dark:text-gray-600">
        {/* WiFi bars */}
        <path
          d="M45 75C45 74.4 45.4 74 46 74H48C48.6 74 49 74.4 49 75V79C49 79.6 48.6 80 48 80H46C45.4 80 45 79.6 45 79V75Z"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M52 71C52 70.4 52.4 70 53 70H55C55.6 70 56 70.4 56 71V79C56 79.6 55.6 80 55 80H53C52.4 80 52 79.6 52 79V71Z"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M59 67C59 66.4 59.4 66 60 66H62C62.6 66 63 66.4 63 67V79C63 79.6 62.6 80 62 80H60C59.4 80 59 79.6 59 79V67Z"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M66 63C66 62.4 66.4 62 67 62H69C69.6 62 70 62.4 70 63V79C70 79.6 69.6 80 69 80H67C66.4 80 66 79.6 66 79V63Z"
          fill="currentColor"
          opacity="0.3"
        />
      </g>

      {/* X mark over connection */}
      <g className="text-red-500">
        <path
          d="M50 66L65 81M65 66L50 81"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Error indicator circle */}
      <circle
        cx="85"
        cy="35"
        r="15"
        fill="currentColor"
        className="text-red-500"
      />

      {/* Exclamation mark */}
      <path
        d="M85 28V38M85 42V42.01"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
