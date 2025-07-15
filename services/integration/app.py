from flask import Flask, jsonify, request
import os
import uuid
import time
from datetime import datetime

app = Flask(__name__)

# Mock deployment status storage
deployment_status = {}

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "integration"})

@app.route('/setup', methods=['POST'])
def setup():
    return jsonify({
        "status": "configured",
        "integrations": ["shopify", "stripe", "mailchimp"]
    })

@app.route('/deploy-store', methods=['POST'])
def deploy_store():
    """Deploy store to selected platform"""
    data = request.get_json()
    store_id = data.get('store_id')
    store_config = data.get('store_config', {})
    launch_settings = data.get('launch_settings', {})
    deployment_id = data.get('deployment_id')
    
    # Store deployment status
    deployment_status[deployment_id] = {
        "deployment_id": deployment_id,
        "store_id": store_id,
        "status": "deploying",
        "progress": 0,
        "start_time": datetime.utcnow().isoformat(),
        "store_config": store_config,
        "launch_settings": launch_settings
    }
    
    # Simulate deployment process
    # In real implementation, this would:
    # 1. Create store on selected platform (Shopify, WooCommerce, etc.)
    # 2. Configure theme and settings
    # 3. Import products
    # 4. Set up payment and shipping
    # 5. Configure domain and SSL
    
    return jsonify({
        "deployment_id": deployment_id,
        "store_id": store_id,
        "status": "deploying",
        "message": "Store deployment initiated successfully",
        "estimated_time": 120
    })

@app.route('/deployment-status/<deployment_id>', methods=['GET'])
def get_deployment_status(deployment_id):
    """Get deployment status"""
    if deployment_id not in deployment_status:
        return jsonify({"error": "Deployment not found"}), 404
    
    status = deployment_status[deployment_id]
    
    # Simulate progress updates
    if status["status"] == "deploying":
        # Simulate deployment progress
        elapsed_time = (datetime.utcnow() - datetime.fromisoformat(status["start_time"])).total_seconds()
        progress = min(int((elapsed_time / 120) * 100), 95)  # Max 95% while deploying
        
        if progress >= 95:
            status["status"] = "completed"
            status["progress"] = 100
            status["store_url"] = f"https://{status['store_id']}.nextbasket.com"
            status["completion_time"] = datetime.utcnow().isoformat()
        else:
            status["progress"] = progress
    
    return jsonify(status)

@app.route('/send-notifications', methods=['POST'])
def send_notifications():
    """Send launch notifications"""
    data = request.get_json()
    store_id = data.get('store_id')
    notification_type = data.get('notification_type', 'launch')
    timestamp = data.get('timestamp')
    
    # Mock notification sending
    notifications_sent = []
    
    if notification_type == "launch":
        notifications_sent = [
            {
                "type": "email",
                "recipient": "store_owner@example.com",
                "subject": "Your store is now live!",
                "status": "sent"
            },
            {
                "type": "sms",
                "recipient": "+1234567890",
                "message": "Your store is now live! Visit your store to start selling.",
                "status": "sent"
            },
            {
                "type": "webhook",
                "url": "https://analytics.nextbasket.com/launch",
                "payload": {"store_id": store_id, "launch_time": timestamp},
                "status": "sent"
            }
        ]
    
    return jsonify({
        "store_id": store_id,
        "notification_type": notification_type,
        "notifications_sent": notifications_sent,
        "total_sent": len(notifications_sent),
        "timestamp": timestamp
    })

@app.route('/platforms', methods=['GET'])
def get_available_platforms():
    """Get available e-commerce platforms"""
    return jsonify({
        "platforms": [
            {
                "id": "shopify",
                "name": "Shopify",
                "description": "Popular e-commerce platform with extensive features",
                "setup_time": "5-10 minutes",
                "monthly_cost": "$29-299",
                "features": ["Payment processing", "Inventory management", "Marketing tools"]
            },
            {
                "id": "woocommerce",
                "name": "WooCommerce",
                "description": "WordPress-based e-commerce solution",
                "setup_time": "10-15 minutes",
                "monthly_cost": "$0-50",
                "features": ["Customizable", "WordPress integration", "Free to start"]
            },
            {
                "id": "bigcommerce",
                "name": "BigCommerce",
                "description": "Enterprise-grade e-commerce platform",
                "setup_time": "8-12 minutes",
                "monthly_cost": "$29-299",
                "features": ["Multi-channel selling", "Advanced analytics", "B2B features"]
            },
            {
                "id": "nextbasket",
                "name": "Next Basket",
                "description": "AI-powered e-commerce platform",
                "setup_time": "3-5 minutes",
                "monthly_cost": "$19-99",
                "features": ["AI optimization", "Smart pricing", "Automated marketing"]
            }
        ]
    })

@app.route('/integrations/<platform_id>', methods=['GET'])
def get_platform_integrations(platform_id):
    """Get available integrations for a platform"""
    integrations = {
        "shopify": {
            "payment": ["Stripe", "PayPal", "Shopify Payments"],
            "shipping": ["Shopify Shipping", "FedEx", "UPS", "DHL"],
            "marketing": ["Mailchimp", "Klaviyo", "Facebook Ads"],
            "analytics": ["Google Analytics", "Shopify Analytics", "Hotjar"]
        },
        "woocommerce": {
            "payment": ["Stripe", "PayPal", "Square"],
            "shipping": ["WooCommerce Shipping", "FedEx", "UPS"],
            "marketing": ["Mailchimp", "ConvertKit", "Facebook Pixel"],
            "analytics": ["Google Analytics", "WooCommerce Analytics", "MonsterInsights"]
        },
        "bigcommerce": {
            "payment": ["Stripe", "PayPal", "Square", "BigCommerce Payments"],
            "shipping": ["BigCommerce Shipping", "FedEx", "UPS", "DHL"],
            "marketing": ["Mailchimp", "Klaviyo", "Facebook Ads"],
            "analytics": ["Google Analytics", "BigCommerce Analytics", "Hotjar"]
        },
        "nextbasket": {
            "payment": ["Stripe", "PayPal", "NextBasket Pay"],
            "shipping": ["NextBasket Shipping", "FedEx", "UPS", "DHL"],
            "marketing": ["NextBasket Marketing", "Mailchimp", "Facebook Ads"],
            "analytics": ["NextBasket Analytics", "Google Analytics", "Hotjar"]
        }
    }
    
    return jsonify({
        "platform_id": platform_id,
        "integrations": integrations.get(platform_id, {})
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 9024)), debug=True) 