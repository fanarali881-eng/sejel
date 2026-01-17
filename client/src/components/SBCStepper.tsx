import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface SBCStepperProps {
  steps: Step[];
}

export const SBCStepper = ({ steps }: SBCStepperProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-start justify-between relative w-full">
        {/* Connecting Line - Positioned behind the circles */}
        <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200 -z-10" />
        
        {/* Progress Line - Optional: to show progress color */}
        {/* <div className="absolute top-4 right-0 h-[2px] bg-green-600 -z-10" style={{ width: '50%' }} /> */}

        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col items-center relative">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold mb-2 transition-colors bg-white z-10",
                step.status === 'completed' ? "border-green-600 text-green-600" :
                step.status === 'current' ? "border-blue-600 text-blue-600" :
                "border-gray-300 text-gray-400"
              )}
            >
              {step.status === 'completed' ? (
                // If you want a checkmark for completed steps, uncomment below
                // <Check className="w-4 h-4" />
                step.id
              ) : (
                step.id
              )}
            </div>
            <span 
              className={cn(
                "text-xs font-medium text-center px-1",
                step.status === 'current' ? "text-blue-600" : 
                step.status === 'completed' ? "text-green-600" : "text-gray-500"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SBCStepper;
