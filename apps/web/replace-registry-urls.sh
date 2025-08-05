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

echo "📁 Found registry directories"

# Find and list JSON files before replacement
echo "📄 JSON files in public/r/:"
find public/r/ -name "*.json" -type f | head -5

echo "📄 JSON files in public/r-pro/ (if exists):"
find public/r-pro/ -name "*.json" -type f 2>/dev/null | head -5 || echo "  (directory not found or empty)"

# Count localhost occurrences before replacement
BEFORE_COUNT=$(grep -r "http://localhost:3000" public/r* 2>/dev/null | wc -l)
echo "🔍 Found $BEFORE_COUNT occurrences of 'http://localhost:3000' before replacement"

# Perform replacement
echo "🔧 Performing URL replacement..."
echo "🖥️  OS Type: ${OSTYPE:-unknown}"

# Try different sed approaches based on environment
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Using macOS sed syntax"
    find public/r* -name "*.json" -type f -exec sed -i '' "s|http://localhost:3000|$REPLACEMENT_URL|g" {} \; 2>/dev/null
else
    echo "🐧 Using Linux sed syntax"
    find public/r* -name "*.json" -type f -exec sed -i "s|http://localhost:3000|$REPLACEMENT_URL|g" {} \; 2>/dev/null
fi

# Fallback: use perl if sed fails
if [ $? -ne 0 ]; then
    echo "⚠️  sed failed, trying perl as fallback"
    find public/r* -name "*.json" -type f -exec perl -pi -e "s|http://localhost:3000|$REPLACEMENT_URL|g" {} \; 2>/dev/null
fi

# Count localhost occurrences after replacement
AFTER_COUNT=$(grep -r "http://localhost:3000" public/r* 2>/dev/null | wc -l)
echo "🔍 Found $AFTER_COUNT occurrences of 'http://localhost:3000' after replacement"

# Show some examples of the replacement
echo "📋 Sample of replaced URLs:"
grep -r "$REPLACEMENT_URL" public/r* 2>/dev/null | head -3 || echo "  (no replacements found)"

# Debug: Show content of a specific file to verify replacement
echo "🔍 Debug - Content of page-title.json registryDependencies:"
if [ -f "public/r/page-title.json" ]; then
    grep -A 5 "registryDependencies" public/r/page-title.json | head -10
elif [ -f "public/r-pro/page-title.json" ]; then
    grep -A 5 "registryDependencies" public/r-pro/page-title.json | head -10
else
    echo "  (page-title.json not found)"
fi

echo "✅ Registry URL replacement completed successfully"