from flask import Flask, jsonify, request
import os
import random
import uuid

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "llm"})

@app.route('/generate', methods=['POST'])
def generate():
    return jsonify({
        "content": "Demo AI-generated content - replace with real LLM integration",
        "model": "demo-model"
    })

@app.route('/generate-products', methods=['POST'])
def generate_products():
    """Generate mocked products based on selected categories"""
    data = request.get_json()
    categories = data.get('categories', [])
    count = data.get('count', len(categories) * 3)
    
    # Product templates for different categories with image keywords
    product_templates = {
        'electronics': [
            {'name': 'iPhone 15 Pro Max 256GB', 'price': 1199.99, 'description': 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 5x optical zoom.', 'imageKeywords': 'smartphone phone mobile device'},
            {'name': 'MacBook Air M3 13-inch', 'price': 1099.99, 'description': 'Ultra-thin laptop with M3 chip, 18-hour battery life, and Liquid Retina display.', 'imageKeywords': 'laptop computer macbook'},
            {'name': 'Sony WH-1000XM5 Headphones', 'price': 399.99, 'description': 'Premium noise-canceling headphones with 30-hour battery and exceptional sound quality.', 'imageKeywords': 'headphones audio wireless'},
            {'name': 'Samsung 65" QLED 4K TV', 'price': 1299.99, 'description': 'Smart TV with Quantum Dot technology, HDR10+, and built-in streaming apps.', 'imageKeywords': 'tv television samsung qled'},
            {'name': 'DJI Mini 3 Pro Drone', 'price': 759.99, 'description': 'Ultra-lightweight drone with 4K camera, obstacle avoidance, and 34-minute flight time.', 'imageKeywords': 'drone dji camera aerial'}
        ],
        'fashion': [
            {'name': 'Nike Air Jordan 1 Retro High', 'price': 170.00, 'description': 'Classic basketball sneakers with premium leather upper and Air-Sole unit for comfort.', 'imageKeywords': 'sneakers shoes nike jordan'},
            {'name': 'Levi\'s 501 Original Jeans', 'price': 89.50, 'description': 'Iconic straight-fit jeans with button fly and classic 5-pocket styling.', 'imageKeywords': 'jeans denim pants'},
            {'name': 'Chanel Classic Flap Bag', 'price': 8800.00, 'description': 'Timeless quilted leather handbag with chain strap and CC logo closure.', 'imageKeywords': 'handbag purse luxury bag'},
            {'name': 'Rolex Submariner Date', 'price': 9100.00, 'description': 'Luxury dive watch with automatic movement, water resistance to 300m.', 'imageKeywords': 'watch rolex luxury timepiece'},
            {'name': 'Canada Goose Expedition Parka', 'price': 1495.00, 'description': 'Arctic-grade down jacket with coyote fur trim and extreme weather protection.', 'imageKeywords': 'jacket parka winter coat'}
        ],
        'home': [
            {'name': 'Dyson V15 Detect Cordless Vacuum', 'price': 749.99, 'description': 'Advanced cordless vacuum with laser dust detection and 60-minute runtime.', 'imageKeywords': 'vacuum cleaner dyson'},
            {'name': 'KitchenAid Professional 600 Stand Mixer', 'price': 449.99, 'description': 'Professional stand mixer with 6-quart bowl and 10-speed planetary mixing.', 'imageKeywords': 'mixer kitchen appliance'},
            {'name': 'IKEA PAX Wardrobe System', 'price': 299.99, 'description': 'Customizable wardrobe with sliding doors, drawers, and hanging rails.', 'imageKeywords': 'wardrobe closet furniture'},
            {'name': 'Philips Hue Smart Bulb Starter Kit', 'price': 199.99, 'description': 'Smart lighting system with 3 bulbs, bridge, and voice control compatibility.', 'imageKeywords': 'smart bulb lighting philips hue'},
            {'name': 'Weber Genesis II E-335 Gas Grill', 'price': 899.99, 'description': 'Premium gas grill with 3 burners, side burner, and sear station.', 'imageKeywords': 'grill barbecue weber gas'}
        ],
        'sports': [
            {'name': 'Peloton Bike+', 'price': 2495.00, 'description': 'Premium indoor cycling bike with 24" rotating HD touchscreen and live classes.', 'imageKeywords': 'exercise bike peloton'},
            {'name': 'Wilson Pro Staff RF97 Tennis Racket', 'price': 249.99, 'description': 'Roger Federer signature racket with 97 sq inch head and 16x19 string pattern.', 'imageKeywords': 'tennis racket sports'},
            {'name': 'Nike ZoomX Vaporfly NEXT% 2', 'price': 250.00, 'description': 'Elite racing shoes with carbon fiber plate and ZoomX foam for maximum speed.', 'imageKeywords': 'running shoes nike'},
            {'name': 'Garmin Fenix 7 Sapphire Solar', 'price': 899.99, 'description': 'Premium multisport GPS watch with solar charging and advanced training metrics.', 'imageKeywords': 'gps watch garmin fitness'},
            {'name': 'Yeti Tundra 65 Cooler', 'price': 399.99, 'description': 'Premium rotomolded cooler with 3-inch insulation and bear-resistant certification.', 'imageKeywords': 'cooler yeti outdoor camping'}
        ],
        'beauty': [
            {'name': 'La Mer Moisturizing Cream', 'price': 345.00, 'description': 'Luxury moisturizer with Miracle Broth™ and marine ingredients for intense hydration.', 'imageKeywords': 'skincare cream moisturizer'},
            {'name': 'Dyson Airwrap Multi-styler', 'price': 599.99, 'description': 'Revolutionary hair styling tool with Coanda airflow technology for multiple styles.', 'imageKeywords': 'hair dryer styling tool'},
            {'name': 'SK-II Facial Treatment Essence', 'price': 159.00, 'description': 'Iconic essence with Pitera™ complex for clear, radiant skin.', 'imageKeywords': 'skincare essence beauty'},
            {'name': 'Chanel N°5 Eau de Parfum', 'price': 135.00, 'description': 'Timeless fragrance with aldehydes, jasmine, and vanilla notes.', 'imageKeywords': 'perfume fragrance chanel'},
            {'name': 'Foreo LUNA 3 Facial Cleansing Brush', 'price': 199.00, 'description': 'Silicone facial brush with T-Sonic pulsations and anti-aging massage.', 'imageKeywords': 'facial brush skincare foreo'}
        ],
        'books': [
            {'name': 'The Seven Husbands of Evelyn Hugo', 'price': 16.99, 'description': 'Bestselling historical fiction novel by Taylor Jenkins Reid about Hollywood glamour.', 'imageKeywords': 'book novel fiction'},
            {'name': 'Atomic Habits by James Clear', 'price': 23.99, 'description': 'International bestseller on building good habits and breaking bad ones.', 'imageKeywords': 'book self help'},
            {'name': 'The Midnight Library by Matt Haig', 'price': 15.99, 'description': 'Fiction novel about infinite possibilities and the choices that shape our lives.', 'imageKeywords': 'book fiction novel'},
            {'name': 'A Court of Thorns and Roses Box Set', 'price': 89.99, 'description': 'Complete 5-book fantasy series by Sarah J. Maas with exclusive bonus content.', 'imageKeywords': 'book fantasy series'},
            {'name': 'The Psychology of Money by Morgan Housel', 'price': 19.99, 'description': 'Timeless lessons on wealth, greed, and happiness through 19 short stories.', 'imageKeywords': 'book psychology money'}
        ],
        'toys': [
            {'name': 'LEGO Star Wars Millennium Falcon', 'price': 159.99, 'description': 'Iconic 1,329-piece LEGO set with detailed interior and minifigures.', 'imageKeywords': 'lego star wars toy'},
            {'name': 'Nintendo Switch OLED Model', 'price': 349.99, 'description': 'Gaming console with 7-inch OLED screen, enhanced audio, and 64GB storage.', 'imageKeywords': 'nintendo switch gaming console'},
            {'name': 'Hot Wheels Ultimate Garage Playset', 'price': 89.99, 'description': 'Multi-level garage with elevator, car wash, and 6 Hot Wheels cars included.', 'imageKeywords': 'hot wheels toy cars'},
            {'name': 'Barbie Dreamhouse Dollhouse', 'price': 199.99, 'description': '3-story dollhouse with 10 rooms, elevator, pool, and 70+ accessories.', 'imageKeywords': 'barbie dollhouse toy'},
            {'name': 'PlayStation 5 DualSense Controller', 'price': 69.99, 'description': 'Next-gen controller with haptic feedback, adaptive triggers, and built-in microphone.', 'imageKeywords': 'playstation controller gaming'}
        ],
        'automotive': [
            {'name': 'Tesla Model 3 Long Range', 'price': 45990.00, 'description': 'Electric sedan with 358-mile range, 0-60 mph in 4.2 seconds, and Autopilot.', 'imageKeywords': 'tesla car electric vehicle'},
            {'name': 'Michelin Pilot Sport 4S Tires', 'price': 299.99, 'description': 'Ultra-high performance summer tires with excellent grip and handling.', 'imageKeywords': 'tires car wheels'},
            {'name': 'Garmin DriveSmart 65 GPS Navigator', 'price': 199.99, 'description': '6.95-inch GPS with traffic alerts, voice control, and smartphone connectivity.', 'imageKeywords': 'gps navigator car'},
            {'name': 'BlackVue DR900X-2CH Dash Cam', 'price': 399.99, 'description': '4K dual-channel dash cam with cloud connectivity and parking mode.', 'imageKeywords': 'dash cam camera car'},
            {'name': 'WeatherTech FloorLiner Custom Mats', 'price': 199.99, 'description': 'Precision-fit floor mats with laser-measured protection and easy cleaning.', 'imageKeywords': 'floor mats car accessories'}
        ],
        'health': [
            {'name': 'Oura Ring Gen 3', 'price': 299.00, 'description': 'Smart ring with sleep tracking, heart rate monitoring, and activity insights.', 'imageKeywords': 'smart ring fitness tracker'},
            {'name': 'Theragun PRO Massage Device', 'price': 599.00, 'description': 'Professional-grade percussion therapy device with 5 speeds and 4 attachments.', 'imageKeywords': 'massage device theragun'},
            {'name': 'Vitamix 5200 Blender', 'price': 449.99, 'description': 'Professional blender with 2-horsepower motor and 64-ounce container.', 'imageKeywords': 'blender vitamix kitchen'},
            {'name': 'Tempur-Pedic TEMPUR-Adapt Pro Mattress', 'price': 2499.00, 'description': 'Memory foam mattress with cooling technology and pressure relief.', 'imageKeywords': 'mattress bed tempur pedic'},
            {'name': 'WHOOP 4.0 Fitness Tracker', 'price': 30.00, 'description': 'Monthly subscription fitness tracker with recovery monitoring and strain analysis.', 'imageKeywords': 'fitness tracker whoop'}
        ],
        'food': [
            {'name': 'Blue Bottle Coffee Subscription', 'price': 89.99, 'description': 'Monthly subscription to freshly roasted single-origin coffee beans.', 'imageKeywords': 'coffee beans subscription'},
            {'name': 'Omakase Sushi Experience Kit', 'price': 299.99, 'description': 'Premium sushi-making kit with fresh fish, rice, and traditional tools.', 'imageKeywords': 'sushi kit japanese food'},
            {'name': 'Truffle Black Truffle Oil', 'price': 49.99, 'description': 'Premium black truffle oil for enhancing pasta, risotto, and gourmet dishes.', 'imageKeywords': 'truffle oil gourmet food'},
            {'name': 'Dom Pérignon Vintage 2012', 'price': 299.00, 'description': 'Prestigious champagne with complex flavors of citrus, white flowers, and minerality.', 'imageKeywords': 'champagne wine dom perignon'},
            {'name': 'Wagyu A5 Japanese Beef', 'price': 199.99, 'description': 'Premium marbled beef with intense flavor and melt-in-your-mouth texture.', 'imageKeywords': 'wagyu beef japanese meat'}
        ]
    }
    
    # Category name mapping
    category_names = {
        'electronics': 'Electronics',
        'fashion': 'Fashion & Apparel',
        'home': 'Home & Garden',
        'sports': 'Sports & Outdoors',
        'beauty': 'Beauty & Personal Care',
        'books': 'Books & Media',
        'toys': 'Toys & Games',
        'automotive': 'Automotive',
        'health': 'Health & Wellness',
        'food': 'Food & Beverages'
    }
    
    generated_products = []
    product_id = 1
    
    for category_id in categories:
        if category_id in product_templates:
            templates = product_templates[category_id]
            category_name = category_names.get(category_id, category_id.title())
            
            # Generate 3 products per category
            for i in range(3):
                template = templates[i % len(templates)]
                
                # Generate semantically appropriate images using Unsplash API with product-specific keywords
                def get_product_image(keywords, product_id):
                    import urllib.parse
                    encoded_keywords = urllib.parse.quote(keywords)
                    return f'https://source.unsplash.com/300x300/?{encoded_keywords}&sig={product_id}'
                
                product = {
                    'id': f'product-{product_id}',
                    'name': template['name'],
                    'price': template['price'],
                    'category': category_name,
                    'description': template['description'],
                    'imageUrl': get_product_image(template['imageKeywords'], product_id)
                }
                generated_products.append(product)
                product_id += 1
    
    return jsonify({
        "success": True,
        "products": generated_products,
        "total_generated": len(generated_products),
        "categories_processed": len(categories)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 9021)), debug=True) 