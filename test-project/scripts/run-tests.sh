#!/bin/bash

# ContentGem JavaScript Client Test Runner
# This script runs the test suite for the JavaScript client

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        print_warning "Please edit .env file and set your CONTENTGEM_API_KEY"
        exit 1
    else
        print_error "env.example not found. Please create .env file manually."
        exit 1
    fi
fi

# Load environment variables
source .env

# Check if API key is set
if [ -z "$CONTENTGEM_API_KEY" ]; then
    print_error "CONTENTGEM_API_KEY is not set in .env file"
    exit 1
fi

print_status "Starting ContentGem JavaScript Client Tests..."
print_status "Base URL: ${CONTENTGEM_BASE_URL:-https://gemcontent.com/api/v1}"
print_status "Timeout: ${TEST_TIMEOUT:-30000}ms"
echo ""

# Check if running in Docker
if [ -f /.dockerenv ]; then
    print_status "Running inside Docker container"
    npm test
else
    print_status "Running locally - checking Docker container status..."
    
    # Check if Docker container is running
    if docker-compose ps | grep -q "Up"; then
        print_status "Docker container is running. Executing tests in container..."
        docker-compose exec contentgem-js-test npm test
    else
        print_warning "Docker container is not running."
        print_status "Starting Docker container..."
        docker-compose up -d
        
        print_status "Waiting for container to be ready..."
        sleep 10
        
        print_status "Executing tests in container..."
        docker-compose exec contentgem-js-test npm test
    fi
fi

print_success "Tests completed!"
