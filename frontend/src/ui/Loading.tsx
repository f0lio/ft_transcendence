import cn from "classnames";

const LoadingCircle = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin h-full w-full text-black", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const LoadingDots = () => (
  <svg
    className="w-5 h-5 mr-3 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <span className="absolute inline-flex w-full h-full bg-purple-400 rounded-full opacity-75 animate-ping"></span>
    <span className="relative inline-flex w-3 h-3 bg-purple-500 rounded-full"></span>
  </svg>
);

export default LoadingCircle;
