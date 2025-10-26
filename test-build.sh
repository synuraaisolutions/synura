#!/bin/bash

echo "🔍 COMPREHENSIVE BUILD VALIDATION"
echo "=================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Clean up any existing processes
print_status "Cleaning up existing processes..."
pkill -f "npm run" 2>/dev/null || true
sleep 2

# Step 1: TypeScript compilation check
print_status "Step 1: TypeScript compilation check..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    print_success "TypeScript compilation passed"
else
    print_error "TypeScript compilation failed"
    exit 1
fi

# Step 2: ESLint check
print_status "Step 2: ESLint validation..."
npm run lint 2>&1 | tee lint-output.log
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    print_success "ESLint validation passed"
else
    print_error "ESLint validation failed"
    echo "See lint-output.log for details"
    exit 1
fi

# Step 3: Contentlayer build
print_status "Step 3: Contentlayer build..."
npx contentlayer build
if [ $? -eq 0 ]; then
    print_success "Contentlayer build passed"
else
    print_error "Contentlayer build failed"
    exit 1
fi

# Step 4: Next.js build
print_status "Step 4: Next.js build..."
npm run build 2>&1 | tee build-output.log
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    print_success "Next.js build passed"
else
    print_error "Next.js build failed"
    echo "See build-output.log for details"
    exit 1
fi

# Step 5: Development server test
print_status "Step 5: Development server test..."
timeout 30s npm run dev &
DEV_PID=$!
sleep 10

# Test if server responds
curl -f -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    print_success "Development server responds correctly"
else
    print_error "Development server not responding"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

kill $DEV_PID 2>/dev/null

print_success "🎉 ALL TESTS PASSED! Ready for deployment."
echo ""
print_status "Summary:"
echo "✅ TypeScript compilation"
echo "✅ ESLint validation"
echo "✅ Contentlayer build"
echo "✅ Next.js build"
echo "✅ Development server"
echo ""
print_status "Safe to commit and deploy!"