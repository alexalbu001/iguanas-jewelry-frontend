#!/bin/bash

# Deploy Frontend to S3 Script
# Usage: ./scripts/deploy-to-s3.sh [environment]
# Environment: dev, staging, prod (default: dev)

set -e

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION="eu-west-1"
BUCKET_NAME="iguanas-jewelry-frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting frontend deployment to S3...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Check if build directory exists
if [ ! -d "build" ]; then
    echo -e "${YELLOW}⚠️  Build directory not found. Building the application...${NC}"
    npm run build
fi

echo -e "${GREEN}📦 Build directory found. Starting deployment...${NC}"

# Deploy static assets with long cache
echo -e "${YELLOW}📁 Uploading static assets...${NC}"
aws s3 sync build/ s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "robots.txt" \
    --exclude "sitemap.xml" \
    --exclude "manifest.json"

# Deploy HTML files with no-cache
echo -e "${YELLOW}📄 Uploading HTML files...${NC}"
aws s3 sync build/ s3://$BUCKET_NAME \
    --cache-control "no-cache, no-store, must-revalidate" \
    --include "*.html"

# Deploy robots.txt and sitemap.xml
echo -e "${YELLOW}🤖 Uploading SEO files...${NC}"
aws s3 cp build/robots.txt s3://$BUCKET_NAME/robots.txt \
    --cache-control "public, max-age=86400"

aws s3 cp build/sitemap.xml s3://$BUCKET_NAME/sitemap.xml \
    --cache-control "public, max-age=86400"

# Deploy manifest.json
aws s3 cp build/manifest.json s3://$BUCKET_NAME/manifest.json \
    --cache-control "public, max-age=86400"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your site should be available at: https://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com${NC}"

# Optional: Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*"
    echo -e "${GREEN}✅ CloudFront cache invalidated!${NC}"
else
    echo -e "${YELLOW}⚠️  CLOUDFRONT_DISTRIBUTION_ID not set. Skipping cache invalidation.${NC}"
fi

echo -e "${GREEN}🎉 Deployment process completed!${NC}"
