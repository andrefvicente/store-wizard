import React from 'react'
import { CheckCircle, Rocket, Settings, Bell, ExternalLink, Share2, Printer, ArrowRight } from 'lucide-react'

interface StoreSuccessPageProps {
    storeData: {
        businessName?: string
        industry?: string
        selectedTheme?: string
        products?: any[]
        integrations?: {
            payment?: any[]
            shipping?: any[]
            marketing?: any[]
        }
        launchSettings?: {
            selectedPlatform?: string
        }
    }
    storeUrl: string
    deploymentId: string
    onVisitStore: () => void
    onBackToDashboard?: () => void
}

const StoreSuccessPage: React.FC<StoreSuccessPageProps> = ({
    storeData,
    storeUrl,
    deploymentId,
    onVisitStore,
    onBackToDashboard
}) => {
    const handleShare = () => {
        const shareData = {
            title: `${storeData.businessName || 'My Store'} - Now Live!`,
            text: `Check out my new online store: ${storeUrl}`,
            url: storeUrl
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(storeUrl);
            alert('Store URL copied to clipboard!');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Store Successfully Launched!</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Congratulations! Your e-commerce store is now live and ready to welcome customers worldwide.
                    </p>
                </div>

                {/* Store URL Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Store URL</h2>
                                <p className="text-blue-600 font-mono text-lg break-all bg-white p-3 rounded border">
                                    {storeUrl}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Deployment ID: {deploymentId}
                                </p>
                            </div>
                            <button
                                onClick={onVisitStore}
                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                            >
                                <ExternalLink className="w-5 h-5" />
                                <span>Visit Store</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Store Summary Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Store Overview */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Rocket className="w-6 h-6 text-blue-600 mr-3" />
                            Store Overview
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Store Name</span>
                                <span className="font-semibold text-gray-900">{storeData.businessName || 'My Store'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Industry</span>
                                <span className="font-semibold text-gray-900">{storeData.industry || 'General'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Theme</span>
                                <span className="font-semibold text-gray-900">{storeData.selectedTheme || 'Default'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-gray-600">Products</span>
                                <span className="font-semibold text-gray-900">{storeData.products?.length || 0} items</span>
                            </div>
                        </div>
                    </div>

                    {/* Integrations */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Settings className="w-6 h-6 text-green-600 mr-3" />
                            Active Integrations
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Payment Gateways</span>
                                <span className="font-semibold text-gray-900">{storeData.integrations?.payment?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Shipping Providers</span>
                                <span className="font-semibold text-gray-900">{storeData.integrations?.shipping?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-600">Marketing Tools</span>
                                <span className="font-semibold text-gray-900">{storeData.integrations?.marketing?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-gray-600">Platform</span>
                                <span className="font-semibold text-gray-900 capitalize">{storeData.launchSettings?.selectedPlatform || 'nextbasket'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Bell className="w-6 h-6 text-green-600 mr-3" />
                        What's Next?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-xl">1</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Share Your Store</h4>
                            <p className="text-gray-600 text-sm">
                                Share your store URL with customers and promote it on social media platforms
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-xl">2</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Monitor Analytics</h4>
                            <p className="text-gray-600 text-sm">
                                Track visitor behavior, sales performance, and conversion rates
                            </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-xl">3</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Optimize & Scale</h4>
                            <p className="text-gray-600 text-sm">
                                Add more products, optimize for better performance, and scale your business
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button
                        onClick={onVisitStore}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                        <ExternalLink className="w-5 h-5" />
                        <span>Visit Your Store</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg"
                    >
                        <Share2 className="w-5 h-5" />
                        <span>Share Store</span>
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg"
                    >
                        <Printer className="w-5 h-5" />
                        <span>Print Details</span>
                    </button>
                </div>

                {/* Success Message */}
                <div className="text-center bg-white rounded-2xl shadow-xl p-8">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            🎊 Congratulations on Your Launch!
                        </h3>
                        <p className="text-lg text-gray-600 mb-6">
                            Your e-commerce journey has officially begun. Your store is now live and ready to generate sales!
                        </p>
                        {onBackToDashboard && (
                            <button
                                onClick={onBackToDashboard}
                                className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-all mx-auto"
                            >
                                <ArrowRight className="w-5 h-5" />
                                <span>Back to Dashboard</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSuccessPage; 