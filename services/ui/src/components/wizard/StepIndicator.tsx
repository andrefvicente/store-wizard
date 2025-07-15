import React from 'react'
import { Check } from 'lucide-react'

interface Step {
    id: number
    title: string
    description: string
}

interface StepIndicatorProps {
    steps: Step[]
    currentStep: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        <div
                            className={`step-indicator ${step.id < currentStep
                                    ? 'step-completed'
                                    : step.id === currentStep
                                        ? 'step-active'
                                        : 'step-pending'
                                }`}
                        >
                            {step.id < currentStep ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                step.id
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <p className="text-sm font-medium text-gray-900">{step.title}</p>
                            <p className="text-xs text-gray-500">{step.description}</p>
                        </div>
                    </div>

                    {index < steps.length - 1 && (
                        <div
                            className={`w-16 h-0.5 ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export default StepIndicator 