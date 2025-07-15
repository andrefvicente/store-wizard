from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "content"})

@app.route('/generate', methods=['POST'])
def generate():
    return jsonify({
        "content": "Demo content generation - replace with real implementation",
        "type": "marketing_copy"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 9022)), debug=True) 