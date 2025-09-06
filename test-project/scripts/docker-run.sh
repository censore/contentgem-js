#!/bin/bash

# ContentGem JavaScript Client Docker Test Runner
# This script builds and runs the Docker container for testing

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        print_warning "Please edit .env file and set your CONTENTGEM_API_KEY"
        print_warning "Then run this script again."
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

print_status "Building Docker image..."
docker-compose build

print_status "Starting Docker container..."
docker-compose up -d

print_status "Waiting for container to be ready..."
sleep 10

# Check container health
if docker-compose ps | grep -q "healthy"; then
    print_success "Container is healthy and ready!"
else
    print_warning "Container might not be ready yet. Checking logs..."
    docker-compose logs
fi

print_status "Container is running!"
print_status "To view logs: docker-compose logs -f"
print_status "To stop: docker-compose down"
print_status "To run tests: docker-compose exec contentgem-js-test npm test"
print_status "To access shell: docker-compose exec contentgem-js-test sh"

echo ""
print_success "Docker container started successfully!"
print_status "Container name: contentgem-js-test"
print_status "Port: 3000"
