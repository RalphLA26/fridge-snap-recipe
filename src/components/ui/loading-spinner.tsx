
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "fridge";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "default",
  text,
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    default: "text-gray-400",
    primary: "text-primary",
    fridge: "text-fridge-600",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size], colorClasses[color])} />
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
}
