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
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -z-10 transform -translate-y-1/2" />
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center px-2">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold mb-2 transition-colors",
                step.status === 'completed' ? "bg-green-500 border-green-500 text-white" :
                step.status === 'current' ? "bg-white border-blue-600 text-blue-600" :
                "bg-white border-gray-300 text-gray-400"
              )}
            >
              {step.status === 'completed' ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <span 
              className={cn(
                "text-xs font-medium text-center max-w-[100px]",
                step.status === 'current' ? "text-blue-600" : "text-gray-500"
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
