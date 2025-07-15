from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "theme"})

@app.route('/recommendations', methods=['GET'])
def recommendations():
    return jsonify({
        "themes": [
            {"id": "modern-minimal", "name": "Modern Minimal", "score": 0.95},
            {"id": "elegant-fashion", "name": "Elegant Fashion", "score": 0.88}
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 9023)), debug=True) 