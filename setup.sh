#!/usr/bin/env bash
set -e
echo "=== OopsMCP setup ==="
command -v node >/dev/null || { echo "Node.js 20+ is required."; exit 1; }
npm install
[ -f .env.local ] || cp .env.example .env.local
echo ""
echo "Next:"
echo "1. Add Supabase values to .env.local"
echo "2. Run the SQL in supabase/schema.sql"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo "5. MCP endpoint: http://localhost:3000/mcp"