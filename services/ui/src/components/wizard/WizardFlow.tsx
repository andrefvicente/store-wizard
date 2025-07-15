import React from 'react'
import StepIndicator from './StepIndicator'
import BusinessSetup from './steps/BusinessSetup'
import ProductConfiguration from './steps/ProductConfiguration'
import StoreDesign from './steps/StoreDesign'
import PlatformIntegration from './steps/PlatformIntegration'
import ContentSEO from './steps/ContentSEO'
import LaunchReadiness from './steps/LaunchReadiness'

interface WizardFlowProps {
    currentStep: number
    setCurrentStep: (step: number) => void
    wizardData: any
    setWizardData: (data: any) => void
}

const WizardFlow: React.FC<WizardFlowProps> = ({
    currentStep,
    setCurrentStep,
    wizardData,
    setWizardData
}) => {
    const steps = [
        { id: 1, title: 'Business Setup', description: 'Configure your business details' },
        { id: 2, title: 'Products', description: 'Set up your product catalog' },
        { id: 3, title: 'Design', description: 'Choose your store theme' },
        { id: 4, title: 'Integrations', description: 'Connect payment & shipping' },
        { id: 5, title: 'Content', description: 'Generate marketing content' },
        { id: 6, title: 'Launch', description: 'Review & launch your store' }
    ]

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <BusinessSetup data={wizardData} setData={setWizardData} />
            case 2:
                return <ProductConfiguration data={wizardData} setData={setWizardData} />
            case 3:
                return <StoreDesign data={wizardData} setData={setWizardData} />
            case 4:
                return <PlatformIntegration data={wizardData} setData={setWizardData} />
            case 5:
                return <ContentSEO data={wizardData} setData={setWizardData} />
            case 6:
                return <LaunchReadiness data={wizardData} setData={setWizardData} />
            default:
                return <BusinessSetup data={wizardData} setData={setWizardData} />
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Launch Your <span className="gradient-text">E-commerce Store</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    AI-powered wizard that guides you through setting up your online store from start to finish
                </p>
            </div>

            {/* Progress Indicator */}
            <StepIndicator steps={steps} currentStep={currentStep} />

            {/* Step Content */}
            <div className="mt-12">
                <div className="card p-8">
                    {renderCurrentStep()}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    ← Previous
                </button>

                <div className="flex space-x-4">
                    {currentStep < steps.length ? (
                        <button
                            onClick={handleNext}
                            className="btn-primary"
                        >
                            Next Step →
                        </button>
                    ) : (
                        <button className="btn-primary">
                            Launch Store 🚀
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WizardFlow 