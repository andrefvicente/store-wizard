import React, { useState } from 'react'
import { Palette, Sparkles } from 'lucide-react'

interface StoreDesignProps {
    data: any
    setData: (data: any) => void
}

const StoreDesign: React.FC<StoreDesignProps> = ({ data, setData }) => {
    const [selectedTheme, setSelectedTheme] = useState(data.selectedTheme || '')
    const [colorScheme, setColorScheme] = useState(data.colorScheme || 'blue')

    const themes = [
        { id: 'modern', name: 'Modern Minimal', description: 'Clean and contemporary design', preview: '🎨' },
        { id: 'classic', name: 'Classic Elegant', description: 'Timeless and sophisticated', preview: '✨' },
        { id: 'bold', name: 'Bold & Dynamic', description: 'Eye-catching and energetic', preview: '⚡' },
        { id: 'warm', name: 'Warm & Welcoming', description: 'Friendly and approachable', preview: '🌟' }
    ]

    const colorSchemes = [
        { id: 'blue', name: 'Ocean Blue', colors: ['#2563eb', '#3b82f6', '#60a5fa'] },
        { id: 'purple', name: 'Royal Purple', colors: ['#7c3aed', '#8b5cf6', '#a78bfa'] },
        { id: 'green', name: 'Emerald Green', colors: ['#059669', '#10b981', '#34d399'] },
        { id: 'orange', name: 'Sunset Orange', colors: ['#ea580c', '#f97316', '#fb923c'] }
    ]

    const handleThemeSelect = (themeId: string) => {
        setSelectedTheme(themeId)
        setData({ ...data, selectedTheme: themeId })
    }

    const handleColorSelect = (colorId: string) => {
        setColorScheme(colorId)
        setData({ ...data, colorScheme: colorId })
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Palette className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Design & Branding</h2>
                <p className="text-gray-600">Choose your theme and customize your store's appearance</p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Choose Your Theme</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`p-6 border rounded-lg text-left transition-all ${selectedTheme === theme.id
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <div className="text-3xl mb-3">{theme.preview}</div>
                            <div className="font-medium text-gray-900">{theme.name}</div>
                            <div className="text-sm text-gray-500">{theme.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Scheme */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Color Scheme</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {colorSchemes.map((scheme) => (
                        <button
                            key={scheme.id}
                            onClick={() => handleColorSelect(scheme.id)}
                            className={`p-4 border rounded-lg text-left transition-all ${colorScheme === scheme.id
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="flex space-x-1">
                                    {scheme.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="w-6 h-6 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <span className="font-medium text-gray-900">{scheme.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Design Recommendations */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">AI Design Intelligence</h3>
                </div>
                <p className="text-gray-600 text-sm">
                    Our AI analyzes your industry and target market to recommend the most effective
                    design elements, color psychology, and layout optimizations for maximum conversions.
                </p>
            </div>
        </div>
    )
}

export default StoreDesign 