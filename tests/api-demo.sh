#!/bin/bash

# API Demo Script for Synura Website Authentication and Analytics System
# This script demonstrates how external platforms can use the APIs
#
# Prerequisites:
# 1. Development server running: npm run dev
# 2. PostgreSQL database configured
# 3. Environment variables set
#
# Usage: bash tests/api-demo.sh

echo "🚀 Synura API Demo Script"
echo "========================="
echo ""

# Configuration
BASE_URL="http://localhost:3000"
ADMIN_API_KEY="YOUR_ADMIN_API_KEY"  # Replace with actual admin API key
TEST_API_KEY=""  # Will be set after creation

echo "📋 Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}$1${NC}"
    echo "$(echo "$1" | sed 's/./─/g')"
}

# Function to make API calls and display results
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    local auth_header=$5

    echo ""
    print_info "$description"
    echo "Request: $method $endpoint"

    if [ ! -z "$data" ]; then
        echo "Data: $data"
    fi

    echo ""

    # Build curl command
    local curl_cmd="curl -s -X $method"

    if [ ! -z "$auth_header" ]; then
        curl_cmd="$curl_cmd -H 'Authorization: Bearer $auth_header'"
    fi

    curl_cmd="$curl_cmd -H 'Content-Type: application/json'"

    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi

    curl_cmd="$curl_cmd '$BASE_URL$endpoint'"

    # Execute curl command and capture response
    response=$(eval $curl_cmd)
    http_code=$(eval "$curl_cmd -w '%{http_code}'" | tail -c 3)

    # Display response
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        print_success "Response ($http_code):"
        echo "$response" | jq . 2>/dev/null || echo "$response"
    else
        print_error "Response ($http_code):"
        echo "$response" | jq . 2>/dev/null || echo "$response"
    fi

    echo ""
    echo "Raw curl command:"
    echo "$curl_cmd"
    echo ""
}

# Check if jq is available for JSON formatting
if ! command -v jq &> /dev/null; then
    print_warning "jq not found. JSON responses will not be formatted."
    print_info "Install jq for better output: brew install jq (macOS) or apt-get install jq (Ubuntu)"
    echo ""
fi

print_section "🔑 Admin API: Create Test API Key"

# Create a test API key
api_call "POST" "/api/v1/admin/keys" '{
    "name": "Demo API Key",
    "description": "Test API key created by demo script"
}' "Creating a new API key for testing" "$ADMIN_API_KEY"

print_warning "Note: Replace YOUR_ADMIN_API_KEY with an actual admin API key to test admin functions"

print_section "📊 Public APIs (No Authentication Required)"

# Test FAQ endpoint
api_call "GET" "/api/v1/faqs?category=general&limit=3" "" "Fetching FAQ data"

# Test Services endpoint
api_call "GET" "/api/v1/services" "" "Fetching services data"

print_section "📝 Lead Capture API"

# Test lead capture
api_call "POST" "/api/v1/voice/leads" '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "company": "Demo Company",
    "phone": "+1-555-0123",
    "intent": "consultation",
    "message": "Interested in AI automation solutions",
    "source": "website",
    "utm_source": "demo_script",
    "utm_campaign": "api_demo",
    "utm_medium": "direct"
}' "Capturing a new lead"

print_section "🧮 ROI Calculator API"

# Test ROI calculation
api_call "POST" "/api/v1/roi/estimate" '{
    "companySize": "11-50",
    "industry": "technology",
    "employeeCount": 25,
    "averageHourlyRate": 50,
    "manualTaskHours": 20,
    "errorRate": 5,
    "automationAreas": ["customer-service", "lead-management"],
    "primaryGoal": "efficiency",
    "timeframe": "6-months",
    "email": "john.doe@example.com",
    "name": "John Doe"
}' "Calculating ROI estimate"

print_section "📅 Meeting Booking API"

# Test meeting booking
api_call "POST" "/api/v1/voice/meetings" '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "company": "Demo Company",
    "phone": "+1-555-0123",
    "meetingType": "consultation",
    "duration": "30",
    "description": "Interested in discussing AI automation for our customer service",
    "urgency": "medium",
    "source": "website"
}' "Booking a consultation meeting"

print_section "💬 Feedback API"

# Test feedback submission
api_call "POST" "/api/v1/voice/feedback" '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "type": "suggestion",
    "category": "website",
    "rating": 5,
    "subject": "Great API Documentation",
    "message": "The API is well-designed and easy to use. Great work!",
    "priority": "low",
    "contactBack": true
}' "Submitting feedback"

print_section "📞 Voice Call Creation API"

# Test voice call creation
api_call "POST" "/api/v1/voice/create-call" '{
    "agentId": "your-retell-agent-id"
}' "Creating a voice call session"

print_section "🔐 API Authentication Examples"

print_info "Testing with API key authentication..."

# Example with API key in Authorization header
echo ""
echo "Example 1: Using Authorization header"
echo "curl -H 'Authorization: Bearer YOUR_API_KEY' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     '$BASE_URL/api/v1/services'"

echo ""
echo "Example 2: Using X-API-Key header"
echo "curl -H 'X-API-Key: YOUR_API_KEY' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     '$BASE_URL/api/v1/services'"

print_section "📈 Admin Analytics APIs"

print_warning "The following require admin authentication:"

echo ""
echo "Get dashboard summary:"
echo "curl -H 'Authorization: Bearer \$ADMIN_API_KEY' \\"
echo "     '$BASE_URL/api/v1/admin/dashboard'"

echo ""
echo "Get analytics data:"
echo "curl -H 'Authorization: Bearer \$ADMIN_API_KEY' \\"
echo "     '$BASE_URL/api/v1/admin/analytics?type=summary&startDate=2024-10-01&endDate=2024-10-27'"

echo ""
echo "List API keys:"
echo "curl -H 'Authorization: Bearer \$ADMIN_API_KEY' \\"
echo "     '$BASE_URL/api/v1/admin/keys'"

echo ""
echo "Create new API key:"
echo "curl -X POST \\"
echo "     -H 'Authorization: Bearer \$ADMIN_API_KEY' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"name\":\"My API Key\",\"description\":\"For my application\"}' \\"
echo "     '$BASE_URL/api/v1/admin/keys'"

print_section "🛠️ Rate Limiting Information"

print_info "Rate limits by endpoint type:"
echo "• Public APIs: 100 requests/minute (IP-based)"
echo "• Authenticated APIs: 60 requests/minute (per API key)"
echo "• Admin APIs: 300 requests/minute (per admin key)"
echo ""
echo "Rate limit headers in responses:"
echo "• X-RateLimit-Limit: Maximum requests per window"
echo "• X-RateLimit-Remaining: Requests remaining in current window"
echo "• X-RateLimit-Reset: Unix timestamp when window resets"

print_section "📚 API Documentation"

print_info "Available endpoints:"
echo ""
echo "Public APIs (no authentication):"
echo "• GET  /api/v1/services - Get services and pricing"
echo "• GET  /api/v1/faqs - Get FAQ content"
echo "• POST /api/v1/faqs - Advanced FAQ search"
echo ""
echo "Business APIs (optional authentication):"
echo "• POST /api/v1/voice/leads - Capture leads"
echo "• POST /api/v1/voice/meetings - Book meetings"
echo "• POST /api/v1/voice/feedback - Submit feedback"
echo "• POST /api/v1/voice/create-call - Create voice calls"
echo "• POST /api/v1/roi/estimate - Calculate ROI"
echo ""
echo "Admin APIs (admin authentication required):"
echo "• GET    /api/v1/admin/dashboard - Dashboard summary"
echo "• GET    /api/v1/admin/analytics - Analytics data"
echo "• GET    /api/v1/admin/keys - List API keys"
echo "• POST   /api/v1/admin/keys - Create API key"
echo "• DELETE /api/v1/admin/keys - Deactivate/delete API key"

print_section "🎯 Next Steps"

echo ""
print_info "To get started with the API:"
echo "1. Get an admin API key to create regular API keys"
echo "2. Use the admin dashboard at $BASE_URL/admin"
echo "3. Create API keys for your applications"
echo "4. Integrate the APIs into your systems"
echo "5. Monitor usage via the analytics dashboard"

echo ""
print_success "Demo completed! The API system is ready for integration."
echo ""
echo "Visit the admin dashboard: $BASE_URL/admin"
echo "API Documentation: Check the route files in src/app/api/v1/"
echo ""