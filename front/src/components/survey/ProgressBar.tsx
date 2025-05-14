
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
  onChange?: (step: number) => void;
}

export function ProgressBar({ steps, currentStep, onChange }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <button
              type="button"
              onClick={() => index < currentStep && onChange?.(index)}
              disabled={index > currentStep}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium",
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
                index < currentStep && "cursor-pointer"
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </button>

            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2">
                <div
                  className={cn(
                    "h-full",
                    index < currentStep
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex items-center justify-between mt-2">
        {steps.map((step, index) => (
          <div
            key={`label-${index}`}
            className={cn(
              "flex-1 text-center text-xs font-medium",
              index === 0 ? "text-left" : "",
              index === steps.length - 1 ? "text-right" : ""
            )}
          >
            <span
              className={cn(
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
