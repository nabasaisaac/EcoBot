export const CircularProgress = ({
  value,
  color = "success",
  label,
  unit = "%",
}) => {
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (value / 100) * circumference;

  const colorClasses = {
    success: "stroke-success",
    warning: "stroke-warning",
    critical: "stroke-critical",
    info: "stroke-info",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-24">
        <svg
          className="size-full"
          height="36"
          viewBox="0 0 36 36"
          width="36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="stroke-current text-gray-200 dark:text-white/10"
            cx="18"
            cy="18"
            fill="none"
            r="16"
            strokeWidth="3"
          />
          <circle
            className={`stroke-current ${colorClasses[color]}`}
            cx="18"
            cy="18"
            fill="none"
            r="16"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeWidth="3"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-primary dark:text-white font-bold text-lg">
          {value}
          {unit}
        </div>
      </div>
      <p className="text-sm text-text-secondary dark:text-white/70">
        {label}
      </p>
    </div>
  );
};
