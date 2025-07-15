import React, { useState, useEffect } from 'react'
import { Package, Sparkles, Loader2 } from 'lucide-react'

interface ProductConfigurationProps {
    data: any
    setData: (data: any) => void
}

interface Category {
    id: string
    name: string
    description: string
}

interface GeneratedProduct {
    id: string
    name: string
    price: number
    category: string
    description: string
    imageUrl?: string
}

const ProductConfiguration: React.FC<ProductConfigurationProps> = ({ data, setData }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(data.selectedCategories || [])
    const [generatedProducts, setGeneratedProducts] = useState<GeneratedProduct[]>(data.products || [])
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationProgress, setGenerationProgress] = useState(0)

    const availableCategories: Category[] = [
        { id: 'electronics', name: 'Electronics', description: 'Premium smartphones, laptops, audio equipment, and smart devices' },
        { id: 'fashion', name: 'Fashion & Apparel', description: 'Luxury clothing, designer accessories, premium footwear, and watches' },
        { id: 'home', name: 'Home & Garden', description: 'High-end appliances, smart home systems, premium furniture, and outdoor equipment' },
        { id: 'sports', name: 'Sports & Outdoors', description: 'Professional sports equipment, fitness technology, outdoor gear, and athletic wear' },
        { id: 'beauty', name: 'Beauty & Personal Care', description: 'Luxury skincare, premium cosmetics, advanced hair tools, and fragrances' },
        { id: 'books', name: 'Books & Media', description: 'Bestselling novels, self-help books, educational content, and digital media' },
        { id: 'toys', name: 'Toys & Games', description: 'Premium toys, gaming consoles, educational games, and collectibles' },
        { id: 'automotive', name: 'Automotive', description: 'Electric vehicles, performance parts, navigation systems, and car accessories' },
        { id: 'health', name: 'Health & Wellness', description: 'Advanced fitness trackers, wellness devices, premium supplements, and health technology' },
        { id: 'food', name: 'Food & Beverages', description: 'Gourmet foods, premium beverages, luxury ingredients, and culinary experiences' }
    ]

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const generateProducts = async () => {
        if (selectedCategories.length === 0) {
            alert('Please select at least one category')
            return
        }

        setIsGenerating(true)
        setGenerationProgress(0)

        try {
            // Simulate API call to LLM service
            const response = await fetch('/api/v1/wizard/llm/generate-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categories: selectedCategories,
                    count: selectedCategories.length * 3 // 3 products per category
                })
            })

            if (!response.ok) {
                throw new Error('Failed to generate products')
            }

            const result = await response.json()
            const newProducts = result.products || []

            setGeneratedProducts(newProducts)
            setData({
                ...data,
                products: newProducts,
                selectedCategories: selectedCategories
            })

        } catch (error) {
            console.error('Error generating products:', error)
            // Fallback to mock data if API fails
            const mockProducts = generateMockProducts(selectedCategories)
            setGeneratedProducts(mockProducts)
            setData({
                ...data,
                products: mockProducts,
                selectedCategories: selectedCategories
            })
        } finally {
            setIsGenerating(false)
            setGenerationProgress(100)
        }
    }

    const generateMockProducts = (categories: string[]): GeneratedProduct[] => {
        const mockProducts: GeneratedProduct[] = []
        let productId = 1

        categories.forEach(categoryId => {
            const category = availableCategories.find(c => c.id === categoryId)
            if (!category) return

            // Generate 3 products per category
            for (let i = 0; i < 3; i++) {
                const product = generateMockProduct(category, productId++)
                mockProducts.push(product)
            }
        })

        return mockProducts
    }

    const generateMockProduct = (category: Category, id: number): GeneratedProduct => {
        const productTemplates = {
            electronics: [
                { name: 'iPhone 15 Pro Max 256GB', price: 1199.99, description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 5x optical zoom.', imageKeywords: 'smartphone phone mobile device' },
                { name: 'MacBook Air M3 13-inch', price: 1099.99, description: 'Ultra-thin laptop with M3 chip, 18-hour battery life, and Liquid Retina display.', imageKeywords: 'laptop computer macbook' },
                { name: 'Sony WH-1000XM5 Headphones', price: 399.99, description: 'Premium noise-canceling headphones with 30-hour battery and exceptional sound quality.', imageKeywords: 'headphones audio wireless' }
            ],
            fashion: [
                { name: 'Nike Air Jordan 1 Retro High', price: 170.00, description: 'Classic basketball sneakers with premium leather upper and Air-Sole unit for comfort.', imageKeywords: 'sneakers shoes nike jordan' },
                { name: 'Levi\'s 501 Original Jeans', price: 89.50, description: 'Iconic straight-fit jeans with button fly and classic 5-pocket styling.', imageKeywords: 'jeans denim pants' },
                { name: 'Chanel Classic Flap Bag', price: 8800.00, description: 'Timeless quilted leather handbag with chain strap and CC logo closure.', imageKeywords: 'handbag purse luxury bag' }
            ],
            home: [
                { name: 'Dyson V15 Detect Cordless Vacuum', price: 749.99, description: 'Advanced cordless vacuum with laser dust detection and 60-minute runtime.', imageKeywords: 'vacuum cleaner dyson' },
                { name: 'KitchenAid Professional 600 Stand Mixer', price: 449.99, description: 'Professional stand mixer with 6-quart bowl and 10-speed planetary mixing.', imageKeywords: 'mixer kitchen appliance' },
                { name: 'IKEA PAX Wardrobe System', price: 299.99, description: 'Customizable wardrobe with sliding doors, drawers, and hanging rails.', imageKeywords: 'wardrobe closet furniture' }
            ],
            sports: [
                { name: 'Peloton Bike+', price: 2495.00, description: 'Premium indoor cycling bike with 24" rotating HD touchscreen and live classes.', imageKeywords: 'exercise bike peloton' },
                { name: 'Wilson Pro Staff RF97 Tennis Racket', price: 249.99, description: 'Roger Federer signature racket with 97 sq inch head and 16x19 string pattern.', imageKeywords: 'tennis racket sports' },
                { name: 'Nike ZoomX Vaporfly NEXT% 2', price: 250.00, description: 'Elite racing shoes with carbon fiber plate and ZoomX foam for maximum speed.', imageKeywords: 'running shoes nike' }
            ],
            beauty: [
                { name: 'La Mer Moisturizing Cream', price: 345.00, description: 'Luxury moisturizer with Miracle Broth™ and marine ingredients for intense hydration.', imageKeywords: 'skincare cream moisturizer' },
                { name: 'Dyson Airwrap Multi-styler', price: 599.99, description: 'Revolutionary hair styling tool with Coanda airflow technology for multiple styles.', imageKeywords: 'hair dryer styling tool' },
                { name: 'SK-II Facial Treatment Essence', price: 159.00, description: 'Iconic essence with Pitera™ complex for clear, radiant skin.', imageKeywords: 'skincare essence beauty' }
            ],
            books: [
                { name: 'The Seven Husbands of Evelyn Hugo', price: 16.99, description: 'Bestselling historical fiction novel by Taylor Jenkins Reid about Hollywood glamour.', imageKeywords: 'book novel fiction' },
                { name: 'Atomic Habits by James Clear', price: 23.99, description: 'International bestseller on building good habits and breaking bad ones.', imageKeywords: 'book self help' },
                { name: 'The Midnight Library by Matt Haig', price: 15.99, description: 'Fiction novel about infinite possibilities and the choices that shape our lives.', imageKeywords: 'book fiction novel' }
            ],
            toys: [
                { name: 'LEGO Star Wars Millennium Falcon', price: 159.99, description: 'Iconic 1,329-piece LEGO set with detailed interior and minifigures.', imageKeywords: 'lego star wars toy' },
                { name: 'Nintendo Switch OLED Model', price: 349.99, description: 'Gaming console with 7-inch OLED screen, enhanced audio, and 64GB storage.', imageKeywords: 'nintendo switch gaming console' },
                { name: 'Hot Wheels Ultimate Garage Playset', price: 89.99, description: 'Multi-level garage with elevator, car wash, and 6 Hot Wheels cars included.', imageKeywords: 'hot wheels toy cars' }
            ],
            automotive: [
                { name: 'Tesla Model 3 Long Range', price: 45990.00, description: 'Electric sedan with 358-mile range, 0-60 mph in 4.2 seconds, and Autopilot.', imageKeywords: 'tesla car electric vehicle' },
                { name: 'Michelin Pilot Sport 4S Tires', price: 299.99, description: 'Ultra-high performance summer tires with excellent grip and handling.', imageKeywords: 'tires car wheels' },
                { name: 'Garmin DriveSmart 65 GPS Navigator', price: 199.99, description: '6.95-inch GPS with traffic alerts, voice control, and smartphone connectivity.', imageKeywords: 'gps navigator car' }
            ],
            health: [
                { name: 'Oura Ring Gen 3', price: 299.00, description: 'Smart ring with sleep tracking, heart rate monitoring, and activity insights.', imageKeywords: 'smart ring fitness tracker' },
                { name: 'Theragun PRO Massage Device', price: 599.00, description: 'Professional-grade percussion therapy device with 5 speeds and 4 attachments.', imageKeywords: 'massage device theragun' },
                { name: 'Vitamix 5200 Blender', price: 449.99, description: 'Professional blender with 2-horsepower motor and 64-ounce container.', imageKeywords: 'blender vitamix kitchen' }
            ],
            food: [
                { name: 'Blue Bottle Coffee Subscription', price: 89.99, description: 'Monthly subscription to freshly roasted single-origin coffee beans.', imageKeywords: 'coffee beans subscription' },
                { name: 'Omakase Sushi Experience Kit', price: 299.99, description: 'Premium sushi-making kit with fresh fish, rice, and traditional tools.', imageKeywords: 'sushi kit japanese food' },
                { name: 'Truffle Black Truffle Oil', price: 49.99, description: 'Premium black truffle oil for enhancing pasta, risotto, and gourmet dishes.', imageKeywords: 'truffle oil gourmet food' }
            ]
        }

        const templates = productTemplates[category.id as keyof typeof productTemplates] || productTemplates.electronics
        const template = templates[id % templates.length]

        // Generate semantically appropriate images using Unsplash API with product-specific keywords
        const getProductImage = (keywords: string, productId: number) => {
            // Use Unsplash API for more relevant images
            const encodedKeywords = encodeURIComponent(keywords)
            return `https://source.unsplash.com/300x300/?${encodedKeywords}&sig=${productId}`
        }

        return {
            id: `product-${id}`,
            name: template.name,
            price: template.price,
            category: category.name,
            description: template.description,
            imageUrl: getProductImage(template.imageKeywords, id)
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Configuration</h2>
                <p className="text-gray-600">Select categories and let AI generate your product catalog</p>
            </div>

            {/* Category Selection */}
            <div className="space-y-6">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Select Product Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableCategories.map((category) => (
                            <div
                                key={category.id}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedCategories.includes(category.id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => { }}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                                        <p className="text-sm text-gray-600">{category.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Generate Products Button */}
                <div className="card p-6">
                    <button
                        onClick={generateProducts}
                        disabled={isGenerating || selectedCategories.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Generating Products... {generationProgress}%</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span>Generate Products with AI</span>
                            </>
                        )}
                    </button>
                    {selectedCategories.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            Please select at least one category to generate products
                        </p>
                    )}
                </div>

                {/* Generated Products Display */}
                {generatedProducts.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Generated Products ({generatedProducts.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {generatedProducts.map((product) => (
                                <div key={product.id} className="card p-4">
                                    {product.imageUrl && (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-32 object-cover rounded-lg mb-3"
                                        />
                                    )}
                                    <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                    <p className="text-lg font-bold text-green-600">${product.price}</p>
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Product Generation</h3>
                <p className="text-gray-600 text-sm">
                    Our AI analyzes your selected categories and generates realistic product suggestions
                    with optimized descriptions, pricing, and marketing copy. Each category will generate
                    3 diverse products to start your catalog.
                </p>
            </div>
        </div>
    )
}

export default ProductConfiguration 