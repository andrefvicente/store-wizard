import React from 'react'
import { ShoppingBag, Sparkles } from 'lucide-react'

const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">NEXT BASKET</h1>
                            <p className="text-xs text-gray-500">Store Launch Wizard</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Features
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Pricing
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Support
                        </a>
                        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                            <Sparkles className="w-4 h-4" />
                            <span>Get Started</span>
                        </button>
                    </nav>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header 