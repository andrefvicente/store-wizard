import React, { useState } from 'react'
import { Building2, Users, Target } from 'lucide-react'

interface BusinessSetupProps {
    data: any
    setData: (data: any) => void
}

const BusinessSetup: React.FC<BusinessSetupProps> = ({ data, setData }) => {
    const [formData, setFormData] = useState({
        businessName: data.businessName || '',
        industry: data.industry || '',
        businessType: data.businessType || 'b2c',
        targetMarket: data.targetMarket || '',
        experienceLevel: data.experienceLevel || 'beginner'
    })

    const industries = [
        'Fashion & Apparel',
        'Electronics',
        'Home & Garden',
        'Health & Beauty',
        'Sports & Outdoor',
        'Food & Beverage',
        'Books & Media',
        'Automotive',
        'Jewelry & Accessories',
        'Toys & Games'
    ]

    const handleInputChange = (field: string, value: string) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        setData({ ...data, ...newData })
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Setup</h2>
                <p className="text-gray-600">Tell us about your business to get personalized recommendations</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Business Name *
                    </label>
                    <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your business name"
                    />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Industry *
                    </label>
                    <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select your industry</option>
                        {industries.map((industry) => (
                            <option key={industry} value={industry}>
                                {industry}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Business Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleInputChange('businessType', 'b2c')}
                            className={`p-4 border rounded-lg text-left transition-all ${formData.businessType === 'b2c'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <Users className="w-5 h-5 mb-2 text-blue-600" />
                            <div className="font-medium">B2C</div>
                            <div className="text-sm text-gray-500">Business to Consumer</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange('businessType', 'b2b')}
                            className={`p-4 border rounded-lg text-left transition-all ${formData.businessType === 'b2b'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <Building2 className="w-5 h-5 mb-2 text-blue-600" />
                            <div className="font-medium">B2B</div>
                            <div className="text-sm text-gray-500">Business to Business</div>
                        </button>
                    </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Experience Level
                    </label>
                    <select
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="beginner">Beginner - New to e-commerce</option>
                        <option value="intermediate">Intermediate - Some experience</option>
                        <option value="advanced">Advanced - Experienced seller</option>
                    </select>
                </div>
            </div>

            {/* Target Market */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Target Market
                </label>
                <textarea
                    value={formData.targetMarket}
                    onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your target customers (age, interests, location, etc.)"
                />
            </div>

            {/* AI Recommendations Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
                </div>
                <p className="text-gray-600 text-sm">
                    Based on your selections, we'll recommend the best platforms, themes, and integrations for your business.
                </p>
            </div>
        </div>
    )
}

export default BusinessSetup 