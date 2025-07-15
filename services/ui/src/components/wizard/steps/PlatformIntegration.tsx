import React, { useState } from 'react'
import { CreditCard, Truck, Zap } from 'lucide-react'

interface PlatformIntegrationProps {
    data: any
    setData: (data: any) => void
}

const PlatformIntegration: React.FC<PlatformIntegrationProps> = ({ data, setData }) => {
    const [integrations, setIntegrations] = useState(data.integrations || {
        payment: [],
        shipping: [],
        marketing: []
    })

    const paymentProviders = [
        { id: 'stripe', name: 'Stripe', description: 'Credit cards, digital wallets', icon: '💳' },
        { id: 'paypal', name: 'PayPal', description: 'PayPal, Venmo', icon: '🅿️' },
        { id: 'square', name: 'Square', description: 'In-person & online payments', icon: '⬜' }
    ]

    const shippingProviders = [
        { id: 'usps', name: 'USPS', description: 'United States Postal Service', icon: '📮' },
        { id: 'fedex', name: 'FedEx', description: 'Express & ground shipping', icon: '🚚' },
        { id: 'ups', name: 'UPS', description: 'United Parcel Service', icon: '📦' }
    ]

    const marketingTools = [
        { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing', icon: '📧' },
        { id: 'google-analytics', name: 'Google Analytics', description: 'Website analytics', icon: '📊' },
        { id: 'facebook-pixel', name: 'Facebook Pixel', description: 'Social media tracking', icon: '📱' }
    ]

    const toggleIntegration = (category: string, providerId: string) => {
        const current = integrations[category] || []
        const updated = current.includes(providerId)
            ? current.filter((id: string) => id !== providerId)
            : [...current, providerId]

        setIntegrations({ ...integrations, [category]: updated })
        setData({ ...data, integrations: { ...integrations, [category]: updated } })
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Integrations</h2>
                <p className="text-gray-600">Connect your store with payment, shipping, and marketing services</p>
            </div>

            {/* Payment Providers */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment Providers</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {paymentProviders.map((provider) => (
                        <button
                            key={provider.id}
                            onClick={() => toggleIntegration('payment', provider.id)}
                            className={`p-4 border rounded-lg text-left transition-all ${integrations.payment?.includes(provider.id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <div className="text-2xl mb-2">{provider.icon}</div>
                            <div className="font-medium text-gray-900">{provider.name}</div>
                            <div className="text-sm text-gray-500">{provider.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Shipping Providers */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Providers</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {shippingProviders.map((provider) => (
                        <button
                            key={provider.id}
                            onClick={() => toggleIntegration('shipping', provider.id)}
                            className={`p-4 border rounded-lg text-left transition-all ${integrations.shipping?.includes(provider.id)
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <div className="text-2xl mb-2">{provider.icon}</div>
                            <div className="font-medium text-gray-900">{provider.name}</div>
                            <div className="text-sm text-gray-500">{provider.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Marketing Tools */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Marketing & Analytics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {marketingTools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => toggleIntegration('marketing', tool.id)}
                            className={`p-4 border rounded-lg text-left transition-all ${integrations.marketing?.includes(tool.id)
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <div className="text-2xl mb-2">{tool.icon}</div>
                            <div className="font-medium text-gray-900">{tool.name}</div>
                            <div className="text-sm text-gray-500">{tool.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-gray-900 mb-2">Automatic Setup</h3>
                <p className="text-gray-600 text-sm">
                    We'll automatically configure your selected integrations with optimal settings
                    for your business type and industry.
                </p>
            </div>
        </div>
    )
}

export default PlatformIntegration 