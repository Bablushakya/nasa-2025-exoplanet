#!/usr/bin/env python3
"""
Test script to verify ExoPlanet AI Enhanced deployment
"""

import requests
import time
import sys

def test_backend():
    """Test backend API"""
    print("🔧 Testing Backend API...")
    
    try:
        # Test health endpoint
        response = requests.get("http://127.0.0.1:8000/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend Health: {data.get('message', 'OK')}")
            return True
        else:
            print(f"❌ Backend Health Check Failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend Connection Failed: {e}")
        return False

def test_frontend():
    """Test frontend server"""
    print("🌐 Testing Frontend Server...")
    
    try:
        response = requests.get("http://127.0.0.1:3000", timeout=5)
        if response.status_code == 200:
            if "ExoPlanet AI" in response.text:
                print("✅ Frontend: ExoPlanet AI loaded successfully")
                return True
            else:
                print("⚠️ Frontend: Page loaded but content may be incorrect")
                return False
        else:
            print(f"❌ Frontend Failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend Connection Failed: {e}")
        return False

def test_api_docs():
    """Test API documentation"""
    print("📚 Testing API Documentation...")
    
    try:
        response = requests.get("http://127.0.0.1:8000/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API Documentation: Available at /docs")
            return True
        else:
            print(f"❌ API Docs Failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Docs Connection Failed: {e}")
        return False

def test_cors():
    """Test CORS configuration"""
    print("🔗 Testing CORS Configuration...")
    
    try:
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        response = requests.options("http://127.0.0.1:8000/health", headers=headers, timeout=5)
        if response.status_code in [200, 204]:
            print("✅ CORS: Properly configured")
            return True
        else:
            print(f"⚠️ CORS: May have issues (HTTP {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ CORS Test Failed: {e}")
        return False

def main():
    """Main test function"""
    print("🌌 ExoPlanet AI Enhanced - Deployment Test")
    print("=" * 50)
    
    # Wait a moment for servers to be ready
    print("⏳ Waiting for servers to be ready...")
    time.sleep(2)
    
    # Run tests
    tests = [
        ("Backend API", test_backend),
        ("Frontend Server", test_frontend),
        ("API Documentation", test_api_docs),
        ("CORS Configuration", test_cors)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name} test...")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("\n🎉 All tests passed! Your ExoPlanet AI Enhanced is ready!")
        print("\n🌐 Access your application:")
        print("   Frontend: http://localhost:3000")
        print("   Backend:  http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
        print("\n🌌 Ready to explore the cosmos!")
        return True
    else:
        print(f"\n⚠️ {len(tests) - passed} test(s) failed. Check the output above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)