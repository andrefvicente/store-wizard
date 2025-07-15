import React, { useState } from 'react'
import { FileText, Search, Sparkles } from 'lucide-react'

interface ContentSEOProps {
    data: any
    setData: (data: any) => void
}

const ContentSEO: React.FC<ContentSEOProps> = ({ data, setData }) => {
    const [contentSettings, setContentSettings] = useState(data.contentSettings || {
        generateDescriptions: true,
        generateMarketingCopy: true,
        optimizeSEO: true,
        tone: 'professional',
        language: 'en'
    })

    const contentTypes = [
        { id: 'product-descriptions', name: 'Product Descriptions', description: 'SEO-optimized product descriptions' },
        { id: 'marketing-copy', name: 'Marketing Copy', description: 'Compelling sales copy and headlines' },
        { id: 'legal-documents', name: 'Legal Documents', description: 'Privacy policy, terms of service' },
        { id: 'blog-posts', name: 'Blog Posts', description: 'Industry-relevant content for SEO' }
    ]

    const tones = [
        { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
        { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
        { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
        { id: 'luxury', name: 'Luxury', description: 'Premium and sophisticated' }
    ]

    const handleSettingChange = (field: string, value: any) => {
        const newSettings = { ...contentSettings, [field]: value }
        setContentSettings(newSettings)
        setData({ ...data, contentSettings: newSettings })
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Content & SEO</h2>
                <p className="text-gray-600">Generate marketing content and optimize for search engines</p>
            </div>

            {/* Content Types */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Generation</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {contentTypes.map((type) => (
                        <div key={type.id} className="p-4 border border-gray-300 rounded-lg">
                            <div className="flex items-center space-x-3 mb-2">
                                <input
                                    type="checkbox"
                                    id={type.id}
                                    checked={contentSettings[type.id] !== false}
                                    onChange={(e) => handleSettingChange(type.id, e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={type.id} className="font-medium text-gray-900 cursor-pointer">
                                    {type.name}
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 ml-7">{type.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Brand Voice & Tone</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {tones.map((tone) => (
                        <button
                            key={tone.id}
                            onClick={() => handleSettingChange('tone', tone.id)}
                            className={`p-4 border rounded-lg text-left transition-all ${contentSettings.tone === tone.id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <div className="font-medium text-gray-900">{tone.name}</div>
                            <div className="text-sm text-gray-500">{tone.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Search className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">SEO Optimization</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="seo-optimization"
                            checked={contentSettings.optimizeSEO}
                            onChange={(e) => handleSettingChange('optimizeSEO', e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="seo-optimization" className="text-gray-900 cursor-pointer">
                            Optimize content for search engines
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="keyword-research"
                            checked={contentSettings.keywordResearch}
                            onChange={(e) => handleSettingChange('keywordResearch', e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="keyword-research" className="text-gray-900 cursor-pointer">
                            Perform keyword research for your industry
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="meta-tags"
                            checked={contentSettings.generateMetaTags}
                            onChange={(e) => handleSettingChange('generateMetaTags', e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="meta-tags" className="text-gray-900 cursor-pointer">
                            Generate meta tags and descriptions
                        </label>
                    </div>
                </div>
            </div>

            {/* AI Content Preview */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-3 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">AI Content Generation</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                    Our AI will analyze your business, industry, and target market to create compelling,
                    SEO-optimized content that converts visitors into customers.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-2xl mb-1">📝</div>
                        <div className="font-medium">Product Descriptions</div>
                        <div className="text-gray-500">SEO-optimized</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="font-medium">Marketing Copy</div>
                        <div className="text-gray-500">Conversion-focused</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-1">⚖️</div>
                        <div className="font-medium">Legal Documents</div>
                        <div className="text-gray-500">Compliance-ready</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentSEO 