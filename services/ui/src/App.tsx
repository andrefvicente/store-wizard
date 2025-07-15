import './App.css'
import { useState } from 'react'
import WizardFlow from './components/wizard/WizardFlow'

function App() {
    const [currentStep, setCurrentStep] = useState(1)
    const [wizardData, setWizardData] = useState({})

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                <WizardFlow
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    wizardData={wizardData}
                    setWizardData={setWizardData}
                />
            </div>
        </div>
    )
}

export default App 