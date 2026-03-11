#!/bin/sh
set -e

# Replace placeholder with actual environment variable in built static files
if [ -n "$GEMINI_API_KEY" ]; then
  echo "Injecting GEMINI_API_KEY into static files..."
  
  # Find files containing the placeholder
  TARGET_FILES=$(grep -rl "DT_GEMINI_API_KEY_PLACEHOLDER" /app/build || true)
  
  if [ -n "$TARGET_FILES" ]; then
    echo "Found placeholder in: $TARGET_FILES"
    # Use xargs to handle the list of files. 
    # In some sed versions, -i requires an empty string argument if no suffix is wanted.
    # But often on Linux it's just -i. The error 'requires an argument' suggest it might want the extension.
    # However, if TARGET_FILES was empty, sed was called with only one argument (the pattern).
    echo "$TARGET_FILES" | xargs sed -i "s/DT_GEMINI_API_KEY_PLACEHOLDER/$GEMINI_API_KEY/g"
  else
    echo "Warning: No files found containing 'DT_GEMINI_API_KEY_PLACEHOLDER'. The key may already be set or the build didn't include it."
  fi
else
  echo "GEMINI_API_KEY is not set. Skipping injection."
fi

# Hand over to the original command (serve)
exec "$@"
