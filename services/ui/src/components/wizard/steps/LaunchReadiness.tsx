import React, { useState, useEffect } from 'react'
import { CheckCircle, Rocket, AlertCircle, Settings, Play, ExternalLink, Bell, Loader2, Globe } from 'lucide-react'
import StoreSuccessPage from '../StoreSuccessPage'

interface LaunchReadinessProps {
    data: any
    setData: (data: any) => void
}

interface DeploymentStatus {
    deployment_id: string
    status: 'idle' | 'validating' | 'deploying' | 'completed' | 'failed'
    progress: number
    store_url?: string
    message?: string
    errors?: string[]
    warnings?: string[]
}

interface Platform {
    id: string
    name: string
    description: string
    setup_time: string
    monthly_cost: string
    features: string[]
}

const LaunchReadiness: React.FC<LaunchReadinessProps> = ({ data, setData }) => {
    const [launchSettings, setLaunchSettings] = useState(data.launchSettings || {
        autoLaunch: true,
        sendNotifications: true,
        createBackup: true,
        selectedPlatform: 'nextbasket'
    })

    const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
        deployment_id: '',
        status: 'idle',
        progress: 0
    })

    const [isLaunching, setIsLaunching] = useState(false)
    const [validationResult, setValidationResult] = useState<any>(null)
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [loadingPlatforms, setLoadingPlatforms] = useState(false)
    const [showSuccessPage, setShowSuccessPage] = useState(false)

    const checklistItems = [
        { id: 'business-setup', label: 'Business information configured', completed: !!data.businessName },
        { id: 'products', label: 'Product catalog created', completed: data.products && data.products.length > 0 },
        { id: 'design', label: 'Store theme selected', completed: !!data.selectedTheme },
        { id: 'integrations', label: 'Payment & shipping configured', completed: data.integrations && Object.keys(data.integrations).length > 0 },
        { id: 'content', label: 'Marketing content generated', completed: !!data.contentSettings },
        { id: 'seo', label: 'SEO optimization completed', completed: data.contentSettings?.optimizeSEO }
    ]

    const completedCount = checklistItems.filter(item => item.completed).length
    const totalCount = checklistItems.length

    useEffect(() => {
        loadPlatforms()
    }, [])

    const loadPlatforms = async () => {
        setLoadingPlatforms(true)
        try {
            const response = await fetch('/api/v1/integrations/platforms')
            if (response.ok) {
                const data = await response.json()
                setPlatforms(data.platforms)
            }
        } catch (error) {
            console.error('Failed to load platforms:', error)
            // Fallback to default platforms
            setPlatforms([
                {
                    id: 'nextbasket',
                    name: 'Next Basket',
                    description: 'AI-powered e-commerce platform',
                    setup_time: '3-5 minutes',
                    monthly_cost: '$19-99',
                    features: ['AI optimization', 'Smart pricing', 'Automated marketing']
                },
                {
                    id: 'shopify',
                    name: 'Shopify',
                    description: 'Popular e-commerce platform with extensive features',
                    setup_time: '5-10 minutes',
                    monthly_cost: '$29-299',
                    features: ['Payment processing', 'Inventory management', 'Marketing tools']
                },
                {
                    id: 'woocommerce',
                    name: 'WooCommerce',
                    description: 'WordPress-based e-commerce solution',
                    setup_time: '10-15 minutes',
                    monthly_cost: '$0-50',
                    features: ['Customizable', 'WordPress integration', 'Free to start']
                }
            ])
        } finally {
            setLoadingPlatforms(false)
        }
    }

    const handleSettingChange = (field: string, value: any) => {
        const newSettings = { ...launchSettings, [field]: value }
        setLaunchSettings(newSettings)
        setData({ ...data, launchSettings: newSettings })
    }

    const validateStore = async () => {
        try {
            const response = await fetch('/api/v1/wizard/launch/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: data.sessionId || 'default',
                    store_config: data,
                    launch_settings: launchSettings
                })
            })

            if (response.ok) {
                const result = await response.json()
                setValidationResult(result)
                return result.valid
            } else {
                throw new Error('Validation failed')
            }
        } catch (error) {
            console.error('Validation error:', error)
            return false
        }
    }

    const launchStore = async () => {
        if (!validationResult?.valid) {
            const isValid = await validateStore()
            if (!isValid) {
                alert('Store validation failed. Please complete all required steps.')
                return
            }
        }

        setIsLaunching(true)
        setDeploymentStatus({
            deployment_id: '',
            status: 'deploying',
            progress: 0
        })

        try {
            // Deploy store
            const deployResponse = await fetch('/api/v1/wizard/launch/deploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: data.sessionId || 'default',
                    store_config: data,
                    launch_settings: launchSettings
                })
            })

            if (deployResponse.ok) {
                const deployResult = await deployResponse.json()
                setDeploymentStatus({
                    deployment_id: deployResult.deployment_id,
                    status: 'deploying',
                    progress: 0
                })

                // Start polling for status
                pollDeploymentStatus(deployResult.deployment_id)
            } else {
                throw new Error('Deployment failed')
            }
        } catch (error) {
            console.error('Launch error:', error)
            setDeploymentStatus({
                deployment_id: '',
                status: 'failed',
                progress: 0,
                message: 'Launch failed. Please try again.'
            })
        } finally {
            setIsLaunching(false)
        }
    }

    const pollDeploymentStatus = async (deploymentId: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/v1/wizard/launch/status/${deploymentId}`)
                if (response.ok) {
                    const status = await response.json()
                    setDeploymentStatus({
                        deployment_id: status.deployment_id,
                        status: status.status,
                        progress: status.progress,
                        store_url: status.store_url,
                        message: status.message
                    })

                    if (status.status === 'completed') {
                        clearInterval(pollInterval)

                        // Send notifications if enabled
                        if (launchSettings.sendNotifications) {
                            await sendLaunchNotifications(status.store_id)
                        }

                        // Update data with store URL
                        const updatedData = {
                            ...data,
                            storeUrl: status.store_url,
                            deploymentId: deploymentId,
                            launchStatus: 'completed'
                        }
                        setData(updatedData)

                        // Save to localStorage for success page access
                        localStorage.setItem('storeLaunchData', JSON.stringify({
                            storeUrl: status.store_url,
                            deploymentId: deploymentId,
                            storeData: updatedData
                        }))
                    } else if (status.status === 'failed') {
                        clearInterval(pollInterval)
                    }
                }
            } catch (error) {
                console.error('Status polling error:', error)
            }
        }, 2000) // Poll every 2 seconds
    }

    const sendLaunchNotifications = async (storeId: string) => {
        try {
            await fetch('/api/v1/wizard/launch/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    store_id: storeId,
                    notification_type: 'launch'
                })
            })
        } catch (error) {
            console.error('Notification error:', error)
        }
    }

    const openStore = () => {
        if (deploymentStatus.store_url) {
            window.open(deploymentStatus.store_url, '_blank')
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Launch Readiness</h2>
                <p className="text-gray-600">Review your store configuration and launch when ready</p>
            </div>

            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Setup Progress</h3>
                    <div className="text-2xl font-bold text-green-600">
                        {completedCount}/{totalCount}
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Choose Your Platform</h3>
                </div>
                {loadingPlatforms ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading platforms...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {platforms.map((platform) => (
                            <div
                                key={platform.id}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${launchSettings.selectedPlatform === platform.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => handleSettingChange('selectedPlatform', platform.id)}
                            >
                                <div className="flex items-center space-x-3 mb-3">
                                    <input
                                        type="radio"
                                        name="platform"
                                        checked={launchSettings.selectedPlatform === platform.id}
                                        onChange={() => { }}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                                <div className="space-y-2 text-xs text-gray-500">
                                    <div><span className="font-medium">Setup:</span> {platform.setup_time}</div>
                                    <div><span className="font-medium">Cost:</span> {platform.monthly_cost}/month</div>
                                </div>
                                <div className="mt-3">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Features:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {platform.features.slice(0, 2).map((feature, index) => (
                                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {feature}
                                            </span>
                                        ))}
                                        {platform.features.length > 2 && (
                                            <span className="text-xs text-gray-500">+{platform.features.length - 2} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Checklist */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Pre-Launch Checklist</h3>
                <div className="space-y-3">
                    {checklistItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                            {item.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                            )}
                            <span className={`flex-1 ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {item.label}
                            </span>
                            {item.completed && (
                                <span className="text-sm text-green-600 font-medium">✓ Complete</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Launch Settings */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Launch Settings</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="auto-launch"
                            checked={launchSettings.autoLaunch}
                            onChange={(e) => handleSettingChange('autoLaunch', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="auto-launch" className="text-gray-900 cursor-pointer">
                            Automatically launch store when ready
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="send-notifications"
                            checked={launchSettings.sendNotifications}
                            onChange={(e) => handleSettingChange('sendNotifications', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="send-notifications" className="text-gray-900 cursor-pointer">
                            Send launch notifications to customers
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="create-backup"
                            checked={launchSettings.createBackup}
                            onChange={(e) => handleSettingChange('createBackup', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="create-backup" className="text-gray-900 cursor-pointer">
                            Create backup before launch
                        </label>
                    </div>
                </div>
            </div>

            {/* Store Preview */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Preview</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Store Details</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Name:</span> {data.businessName || 'Not set'}</div>
                            <div><span className="font-medium">Industry:</span> {data.industry || 'Not set'}</div>
                            <div><span className="font-medium">Theme:</span> {data.selectedTheme || 'Not set'}</div>
                            <div><span className="font-medium">Products:</span> {data.products?.length || 0} items</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Integrations</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Payment:</span> {data.integrations?.payment?.length || 0} providers</div>
                            <div><span className="font-medium">Shipping:</span> {data.integrations?.shipping?.length || 0} providers</div>
                            <div><span className="font-medium">Marketing:</span> {data.integrations?.marketing?.length || 0} tools</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Results */}
            {validationResult && (
                <div className={`p-4 rounded-lg border ${validationResult.valid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                    }`}>
                    <h4 className="font-medium text-gray-900 mb-2">
                        {validationResult.valid ? '✓ Store Validation Passed' : '✗ Store Validation Failed'}
                    </h4>
                    {validationResult.errors?.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-red-700">Errors:</p>
                            <ul className="text-sm text-red-600 list-disc list-inside">
                                {validationResult.errors.map((error: string, index: number) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {validationResult.warnings?.length > 0 && (
                        <div className="space-y-1 mt-2">
                            <p className="text-sm font-medium text-yellow-700">Warnings:</p>
                            <ul className="text-sm text-yellow-600 list-disc list-inside">
                                {validationResult.warnings.map((warning: string, index: number) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Deployment Status */}
            {deploymentStatus.status !== 'idle' && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                        {deploymentStatus.status === 'deploying' ? (
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        ) : deploymentStatus.status === 'completed' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                        <h4 className="font-medium text-gray-900">
                            {deploymentStatus.status === 'deploying' && 'Deploying Store...'}
                            {deploymentStatus.status === 'completed' && 'Store Deployed Successfully!'}
                            {deploymentStatus.status === 'failed' && 'Deployment Failed'}
                        </h4>
                    </div>

                    {deploymentStatus.status === 'deploying' && (
                        <div className="space-y-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${deploymentStatus.progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600">
                                Progress: {deploymentStatus.progress}% - {deploymentStatus.message}
                            </p>
                        </div>
                    )}

                    {deploymentStatus.status === 'completed' && deploymentStatus.store_url && (
                        <div className="space-y-6">
                            {/* Success Header */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Store Successfully Launched!</h3>
                                <p className="text-gray-600">
                                    Congratulations! Your e-commerce store is now live and ready to welcome customers.
                                </p>
                                <button
                                    onClick={() => setShowSuccessPage(true)}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View Full Success Page
                                </button>
                            </div>

                            {/* Store URL Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Your Store URL</h4>
                                        <p className="text-blue-600 font-mono text-sm break-all">{deploymentStatus.store_url}</p>
                                    </div>
                                    <button
                                        onClick={openStore}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Visit Store</span>
                                    </button>
                                </div>
                            </div>

                            {/* Store Summary */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <Rocket className="w-5 h-5 text-blue-600 mr-2" />
                                        Store Overview
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Store Name:</span>
                                            <span className="font-medium">{data.businessName || 'My Store'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Industry:</span>
                                            <span className="font-medium">{data.industry || 'General'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Theme:</span>
                                            <span className="font-medium">{data.selectedTheme || 'Default'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Products:</span>
                                            <span className="font-medium">{data.products?.length || 0} items</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <Settings className="w-5 h-5 text-green-600 mr-2" />
                                        Integrations Active
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Gateways:</span>
                                            <span className="font-medium">{data.integrations?.payment?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping Providers:</span>
                                            <span className="font-medium">{data.integrations?.shipping?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Marketing Tools:</span>
                                            <span className="font-medium">{data.integrations?.marketing?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Platform:</span>
                                            <span className="font-medium">{launchSettings.selectedPlatform}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <Bell className="w-5 h-5 text-green-600 mr-2" />
                                    What's Next?
                                </h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-blue-600 font-bold">1</span>
                                        </div>
                                        <h5 className="font-medium text-gray-900 mb-1">Share Your Store</h5>
                                        <p className="text-sm text-gray-600">Share your store URL with customers and on social media</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-purple-600 font-bold">2</span>
                                        </div>
                                        <h5 className="font-medium text-gray-900 mb-1">Monitor Analytics</h5>
                                        <p className="text-sm text-gray-600">Track visitor behavior and sales performance</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-green-600 font-bold">3</span>
                                        </div>
                                        <h5 className="font-medium text-gray-900 mb-1">Optimize & Scale</h5>
                                        <p className="text-sm text-gray-600">Add more products and optimize for better performance</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={openStore}
                                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    <span>Visit Your Store</span>
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all"
                                >
                                    <span>📄 Print Details</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (!deploymentStatus.store_url) return;
                                        const shareData = {
                                            title: `${data.businessName || 'My Store'} - Now Live!`,
                                            text: `Check out my new online store: ${deploymentStatus.store_url}`,
                                            url: deploymentStatus.store_url
                                        };
                                        if (navigator.share) {
                                            navigator.share(shareData);
                                        } else {
                                            navigator.clipboard.writeText(deploymentStatus.store_url);
                                            alert('Store URL copied to clipboard!');
                                        }
                                    }}
                                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all"
                                >
                                    <span>📤 Share Store</span>
                                </button>
                            </div>

                            {/* Success Message */}
                            <div className="text-center bg-white p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600">
                                    🎊 <strong>Congratulations!</strong> Your e-commerce journey has officially begun.
                                    Your store is now live and ready to generate sales!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Launch Ready Message */}
            {completedCount === totalCount && deploymentStatus.status === 'idle' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Ready to Launch!</h3>
                    <p className="text-gray-600 mb-4">
                        Your store is fully configured and ready to go live. Click "Launch Store" to make it public.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={launchStore}
                            disabled={isLaunching}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLaunching ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Launching Store...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" />
                                    <span>Launch Store</span>
                                </>
                            )}
                        </button>

                        {/* Demo button for testing success page */}
                        <button
                            onClick={() => {
                                setDeploymentStatus({
                                    deployment_id: 'demo-123',
                                    status: 'completed',
                                    progress: 100,
                                    store_url: 'https://demo-store.example.com',
                                    message: 'Store deployed successfully!'
                                });
                                setData({
                                    ...data,
                                    storeUrl: 'https://demo-store.example.com',
                                    deploymentId: 'demo-123',
                                    launchStatus: 'completed'
                                });
                                localStorage.setItem('storeLaunchData', JSON.stringify({
                                    storeUrl: 'https://demo-store.example.com',
                                    deploymentId: 'demo-123',
                                    storeData: data
                                }));
                            }}
                            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all"
                        >
                            <span>🎯 Demo Success Page</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Full Success Page */}
            {showSuccessPage && deploymentStatus.status === 'completed' && deploymentStatus.store_url && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Store Launch Success</h2>
                                <button
                                    onClick={() => setShowSuccessPage(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <StoreSuccessPage
                                storeData={data}
                                storeUrl={deploymentStatus.store_url}
                                deploymentId={deploymentStatus.deployment_id}
                                onVisitStore={openStore}
                                onBackToDashboard={() => setShowSuccessPage(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LaunchReadiness 