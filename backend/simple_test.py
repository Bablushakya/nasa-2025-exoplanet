"""
Simple test script using only standard library
"""

import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://localhost:8000"

def test_endpoint(url, method="GET", data=None):
    """Test an API endpoint"""
    try:
        if data:
            data = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=data, method=method)
            req.add_header('Content-Type', 'application/json')
        else:
            req = urllib.request.Request(url, method=method)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            return True, result
    except Exception as e:
        return False, str(e)

def main():
    """Run simple API tests"""
    print("🌌 Testing ExoPlanet AI API...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("\n🧪 Testing Health Check...")
    success, result = test_endpoint(f"{BASE_URL}/health")
    if success:
        print("✅ Health Check passed:", result.get('message', 'OK'))
    else:
        print("❌ Health Check failed:", result)
        print("💡 Make sure the API server is running on port 8000")
        return
    
    # Test 2: Prediction
    print("\n🧪 Testing Prediction...")
    prediction_data = {
        "orbital_period": 365.25,
        "transit_duration": 4.2,
        "planetary_radius": 1.0,
        "transit_depth": 0.008,
        "stellar_magnitude": 4.83,
        "equilibrium_temperature": 288
    }
    
    success, result = test_endpoint(
        f"{BASE_URL}/api/v1/predictions/predict", 
        method="POST", 
        data=prediction_data
    )
    if success:
        classification = result.get('data', {}).get('classification', 'Unknown')
        confidence = result.get('data', {}).get('confidence', 0)
        print(f"✅ Prediction passed: {classification} ({confidence}% confidence)")
    else:
        print("❌ Prediction failed:", result)
    
    # Test 3: Model Info
    print("\n🧪 Testing Model Info...")
    success, result = test_endpoint(f"{BASE_URL}/api/v1/models/")
    if success:
        model_name = result.get('data', {}).get('default_model', 'Unknown')
        print(f"✅ Model Info passed: {model_name}")
    else:
        print("❌ Model Info failed:", result)
    
    print("\n🎉 Basic API tests completed!")
    print("📖 Visit http://localhost:8000/docs for full API documentation")

if __name__ == "__main__":
    main()