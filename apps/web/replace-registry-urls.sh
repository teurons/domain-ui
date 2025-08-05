#!/bin/bash

echo "🔄 Starting registry URL replacement script..."
echo "📍 Current directory: $(pwd)"
echo "🌐 VERCEL_URL: ${VERCEL_URL:-'not set'}"

if [ -z "$VERCEL_URL" ]; then
    echo "⚠️  VERCEL_URL not set, skipping URL replacement"
    exit 0
fi

REPLACEMENT_URL="https://$VERCEL_URL"
echo "🔀 Replacing 'http://localhost:3000' with '$REPLACEMENT_URL'"

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ public directory not found at $(pwd)/public"
    exit 1
fi

# Check if registry directories exist
if [ ! -d "public/r" ]; then
    echo "❌ public/r directory not found"
    exit 1
fi

if [ ! -d "public/r/domain-ui" ]; then
    echo "❌ public/r/domain-ui directory not found"
    exit 1
fi

echo "📁 Found registry directories"

# Find and list JSON files before replacement
echo "📄 JSON files in public/r/domain-ui/:"
find public/r/domain-ui/ -name "*.json" -type f | head -5

echo "📄 JSON files in public/r/domain-ui-pro/ (if exists):"
find public/r/domain-ui-pro/ -name "*.json" -type f 2>/dev/null | head -5 || echo "  (directory not found or empty)"

# Count localhost occurrences before replacement
BEFORE_COUNT=$(grep -r "http://localhost:3000" public/r/ 2>/dev/null | wc -l)
echo "🔍 Found $BEFORE_COUNT occurrences of 'http://localhost:3000' before replacement"

# Perform replacement
echo "🔧 Performing URL replacement..."
find public/r/ -name "*.json" -type f -exec sed -i '' "s|http://localhost:3000|$REPLACEMENT_URL|g" {} \;

# Count localhost occurrences after replacement
AFTER_COUNT=$(grep -r "http://localhost:3000" public/r/ 2>/dev/null | wc -l)
echo "🔍 Found $AFTER_COUNT occurrences of 'http://localhost:3000' after replacement"

# Show some examples of the replacement
echo "📋 Sample of replaced URLs:"
grep -r "$REPLACEMENT_URL" public/r/ 2>/dev/null | head -3 || echo "  (no replacements found)"

echo "✅ Registry URL replacement completed successfully"