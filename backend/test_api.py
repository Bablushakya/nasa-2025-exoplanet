"""
Simple API test script to verify the backend is working
"""

import asyncio
import aiohttp
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

async def test_health_check():
    """Test the health check endpoint"""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}/health") as response:
            data = await response.json()
            print("✅ Health Check:", data)
            return response.status == 200

async def test_prediction():
    """Test the prediction endpoint"""
    prediction_data = {
        "orbital_period": 365.25,
        "transit_duration": 4.2,
        "planetary_radius": 1.0,
        "transit_depth": 0.008,
        "stellar_magnitude": 4.83,
        "equilibrium_temperature": 288
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{BASE_URL}/api/v1/predictions/predict",
            json=prediction_data,
            headers={"Content-Type": "application/json"}
        ) as response:
            data = await response.json()
            print("✅ Prediction Result:", json.dumps(data, indent=2))
            return response.status == 200

async def test_exoplanets_list():
    """Test the exoplanets list endpoint"""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}/api/v1/exoplanets/?page=1&page_size=5") as response:
            data = await response.json()
            print("✅ Exoplanets List:", f"Found {len(data.get('data', []))} exoplanets")
            return response.status == 200

async def test_model_info():
    """Test the model information endpoint"""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}/api/v1/models/") as response:
            data = await response.json()
            print("✅ Model Info:", data.get('data', {}).get('default_model', 'Unknown'))
            return response.status == 200

async def main():
    """Run all tests"""
    print("🚀 Testing ExoPlanet AI API...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_check),
        ("Prediction", test_prediction),
        ("Exoplanets List", test_exoplanets_list),
        ("Model Info", test_model_info)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            print(f"\n🧪 Testing {test_name}...")
            success = await test_func()
            results.append((test_name, success))
            if success:
                print(f"✅ {test_name} passed")
            else:
                print(f"❌ {test_name} failed")
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {status} {test_name}")
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the API server and try again.")

if __name__ == "__main__":
    asyncio.run(main())