import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import StoreSuccessPage from '../../components/wizard/StoreSuccessPage'

const StoreSuccess: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [storeData, setStoreData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get store data from URL params or localStorage
        const storeUrl = searchParams.get('store_url')
        const deploymentId = searchParams.get('deployment_id')

        if (!storeUrl || !deploymentId) {
            // Try to get from localStorage
            const savedData = localStorage.getItem('storeLaunchData')
            if (savedData) {
                const parsed = JSON.parse(savedData)
                setStoreData(parsed)
            } else {
                // Redirect to wizard if no data
                navigate('/wizard')
                return
            }
        } else {
            // Use URL params
            const data = {
                storeUrl,
                deploymentId,
                storeData: JSON.parse(searchParams.get('store_data') || '{}')
            }
            setStoreData(data)
        }

        setLoading(false)
    }, [searchParams, navigate])

    const handleVisitStore = () => {
        if (storeData?.storeUrl) {
            window.open(storeData.storeUrl, '_blank')
        }
    }

    const handleBackToDashboard = () => {
        navigate('/dashboard')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your success page...</p>
                </div>
            </div>
        )
    }

    if (!storeData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Data Not Found</h1>
                    <p className="text-gray-600 mb-6">Unable to load store launch information.</p>
                    <button
                        onClick={() => navigate('/wizard')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Wizard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <StoreSuccessPage
            storeData={storeData.storeData || storeData}
            storeUrl={storeData.storeUrl}
            deploymentId={storeData.deploymentId}
            onVisitStore={handleVisitStore}
            onBackToDashboard={handleBackToDashboard}
        />
    )
}

export default StoreSuccess 