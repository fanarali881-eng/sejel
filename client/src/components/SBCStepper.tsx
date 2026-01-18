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
    <div className="w-full py-4 md:py-6 overflow-x-auto">
      <div className="flex items-start justify-between relative min-w-[320px] w-full px-2">
        {/* Connecting Line - Positioned behind the circles */}
        <div className="absolute top-4 left-2 right-2 h-[2px] bg-gray-200 -z-10" />
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col items-center relative min-w-[60px]">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold mb-2 transition-colors bg-white z-10",
                step.status === 'completed' ? "border-green-600 text-green-600" :
                step.status === 'current' ? "border-blue-600 text-blue-600" :
                "border-gray-300 text-gray-400"
              )}
            >
              {step.id}
            </div>
            <span 
              className={cn(
                "text-[10px] md:text-xs font-medium text-center px-0.5 leading-tight",
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
