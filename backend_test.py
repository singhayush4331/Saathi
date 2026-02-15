import requests
import sys
import json
from datetime import datetime, timezone, timedelta
import uuid

class SaathiAPITester:
    def __init__(self, base_url="https://saathi-support.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} - {name}"
        if details:
            result += f" | {details}"
        
        print(result)
        self.test_results.append({"name": name, "success": success, "details": details})
        return success

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected {expected_status})"
                try:
                    error_data = response.json()
                    if 'detail' in error_data:
                        details += f" - {error_data['detail']}"
                except:
                    details += f" - {response.text[:100]}"
            
            return self.log_test(name, success, details), response

        except Exception as e:
            return self.log_test(name, False, f"Error: {str(e)}"), None

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test("Root API Endpoint", "GET", "", 200)
        if success and response:
            try:
                data = response.json()
                if "Saathi" in data.get("message", ""):
                    self.log_test("Root Message Content", True, "Contains 'Saathi'")
                else:
                    self.log_test("Root Message Content", False, f"Message: {data.get('message', 'N/A')}")
            except:
                self.log_test("Root Message Content", False, "Invalid JSON response")

    def test_anonymous_login(self):
        """Test anonymous login"""
        success, response = self.run_test(
            "Anonymous Login",
            "POST",
            "auth/anonymous",
            200,
            data={"display_name": "Test Anonymous User"}
        )
        
        if success and response:
            try:
                data = response.json()
                if data.get("status") == "success" and "session_token" in data:
                    self.session_token = data["session_token"]
                    self.user_id = data["user"]["user_id"]
                    self.log_test("Anonymous Login Token", True, f"User ID: {self.user_id}")
                    return True
                else:
                    self.log_test("Anonymous Login Token", False, "Missing session_token or status")
            except:
                self.log_test("Anonymous Login Token", False, "Invalid JSON response")
        return False

    def test_otp_flow(self):
        """Test OTP send (may fail in test environment)"""
        test_email = f"test.{uuid.uuid4().hex[:8]}@example.com"
        success, response = self.run_test(
            "OTP Send",
            "POST",
            "auth/otp/send",
            200,
            data={"email": test_email}
        )
        
        if success:
            self.log_test("OTP Send Flow", True, "OTP endpoint working")
        else:
            self.log_test("OTP Send Flow", False, "OTP send failed (expected in test env)")

    def test_auth_me(self):
        """Test current user endpoint"""
        if not self.session_token:
            return self.log_test("Auth Me", False, "No session token available")
        
        success, response = self.run_test("Auth Me", "GET", "auth/me", 200)
        if success and response:
            try:
                data = response.json()
                if data.get("user_id") == self.user_id:
                    self.log_test("Auth Me Data", True, f"User ID matches: {self.user_id}")
                else:
                    self.log_test("Auth Me Data", False, f"User ID mismatch: {data.get('user_id')} vs {self.user_id}")
            except:
                self.log_test("Auth Me Data", False, "Invalid JSON response")

    def test_psychologists_endpoints(self):
        """Test psychologist-related endpoints"""
        # Test get approved psychologists
        success, response = self.run_test("Get Approved Psychologists", "GET", "psychologists?approved_only=true", 200)
        if success and response:
            try:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Psychologists List Format", True, f"Found {len(data)} psychologists")
                    if len(data) > 0:
                        # Check if psychologists have required fields
                        first_psy = data[0]
                        required_fields = ["psychologist_id", "name", "specialization", "pricing"]
                        missing_fields = [field for field in required_fields if field not in first_psy]
                        if not missing_fields:
                            self.log_test("Psychologist Data Structure", True, "All required fields present")
                        else:
                            self.log_test("Psychologist Data Structure", False, f"Missing fields: {missing_fields}")
                else:
                    self.log_test("Psychologists List Format", False, "Response is not a list")
            except:
                self.log_test("Psychologists List Format", False, "Invalid JSON response")

        # Test get all psychologists
        self.run_test("Get All Psychologists", "GET", "psychologists?approved_only=false", 200)

    def test_success_stories(self):
        """Test success stories endpoint"""
        success, response = self.run_test("Get Success Stories", "GET", "stories", 200)
        if success and response:
            try:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Stories List Format", True, f"Found {len(data)} stories")
                else:
                    self.log_test("Stories List Format", False, "Response is not a list")
            except:
                self.log_test("Stories List Format", False, "Invalid JSON response")

    def test_chat_functionality(self):
        """Test AI chat functionality"""
        if not self.session_token:
            return self.log_test("Chat Test", False, "No session token available")

        chat_session_id = f"test_session_{uuid.uuid4().hex[:8]}"
        
        # Test normal message
        success, response = self.run_test(
            "AI Chat Normal Message",
            "POST",
            "chat",
            200,
            data={
                "message": "I'm having relationship issues with my partner",
                "session_id": chat_session_id
            }
        )
        
        if success and response:
            try:
                data = response.json()
                if "response" in data and data["response"]:
                    self.log_test("AI Chat Response", True, f"Response length: {len(data['response'])}")
                    
                    # Test crisis detection
                    crisis_success, crisis_response = self.run_test(
                        "AI Chat Crisis Detection",
                        "POST",
                        "chat",
                        200,
                        data={
                            "message": "I want to die and end my life",
                            "session_id": chat_session_id
                        }
                    )
                    
                    if crisis_success and crisis_response:
                        try:
                            crisis_data = crisis_response.json()
                            if crisis_data.get("is_crisis") and crisis_data.get("helplines"):
                                self.log_test("Crisis Detection", True, "Crisis detected with helplines")
                            else:
                                self.log_test("Crisis Detection", False, f"Crisis: {crisis_data.get('is_crisis')}, Helplines: {bool(crisis_data.get('helplines'))}")
                        except:
                            self.log_test("Crisis Detection", False, "Invalid JSON response")
                else:
                    self.log_test("AI Chat Response", False, "No response content")
            except:
                self.log_test("AI Chat Response", False, "Invalid JSON response")

        # Test chat history
        self.run_test("Get Chat History", "GET", f"chat/history/{chat_session_id}", 200)
        
        # Test delete chat history
        self.run_test("Delete Chat History", "DELETE", f"chat/history/{chat_session_id}", 200)

    def test_booking_flow(self):
        """Test booking creation (without payment completion)"""
        if not self.session_token:
            return self.log_test("Booking Test", False, "No session token available")

        # First get a psychologist
        success, response = self.run_test("Get Psychologist for Booking", "GET", "psychologists?approved_only=true", 200)
        if success and response:
            try:
                psychologists = response.json()
                if len(psychologists) > 0:
                    psy_id = psychologists[0]["psychologist_id"]
                    
                    # Test create booking order
                    booking_success, booking_response = self.run_test(
                        "Create Booking Order",
                        "POST",
                        "bookings/create-order",
                        200,
                        data={
                            "psychologist_id": psy_id,
                            "slot_date": "2025-09-15",
                            "slot_time": "10:00"
                        }
                    )
                    
                    if booking_success and booking_response:
                        try:
                            booking_data = booking_response.json()
                            required_fields = ["booking_id", "order_id", "amount", "key"]
                            missing_fields = [field for field in required_fields if field not in booking_data]
                            if not missing_fields:
                                self.log_test("Booking Order Data", True, f"Order ID: {booking_data.get('order_id')}")
                            else:
                                self.log_test("Booking Order Data", False, f"Missing fields: {missing_fields}")
                        except:
                            self.log_test("Booking Order Data", False, "Invalid JSON response")
                else:
                    self.log_test("Booking Test", False, "No psychologists available for booking")
            except:
                self.log_test("Booking Test", False, "Invalid psychologists response")

        # Test get user bookings
        self.run_test("Get User Bookings", "GET", "bookings", 200)

    def test_logout(self):
        """Test logout functionality"""
        if not self.session_token:
            return self.log_test("Logout Test", False, "No session token available")
        
        success, response = self.run_test("Logout", "POST", "auth/logout", 200)
        if success:
            # Test that session is invalidated
            invalid_success, _ = self.run_test("Auth Me After Logout", "GET", "auth/me", 401)
            if invalid_success:
                self.log_test("Session Invalidation", True, "Session properly invalidated")
            else:
                self.log_test("Session Invalidation", False, "Session still valid after logout")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Saathi API Tests")
        print("=" * 50)
        
        # Basic tests
        self.test_root_endpoint()
        self.test_otp_flow()
        
        # Authentication tests
        if self.test_anonymous_login():
            self.test_auth_me()
            
            # Protected endpoint tests
            self.test_psychologists_endpoints()
            self.test_success_stories()
            self.test_chat_functionality()
            self.test_booking_flow()
            
            # Logout test
            self.test_logout()
        else:
            print("❌ Anonymous login failed - skipping protected endpoint tests")
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        # Print failed tests
        failed_tests = [test for test in self.test_results if not test["success"]]
        if failed_tests:
            print("\n❌ Failed Tests:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SaathiAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())