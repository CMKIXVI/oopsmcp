$ErrorActionPreference = "Stop"
Write-Host "=== OopsMCP setup ==="
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js 20+ is required."
}
npm install
if (-not (Test-Path ".env.local")) { Copy-Item ".env.example" ".env.local" }
Write-Host ""
Write-Host "Next:"
Write-Host "1. Add Supabase values to .env.local"
Write-Host "2. Run the SQL in supabase/schema.sql"
Write-Host "3. Run: npm run dev"
Write-Host "4. Open: http://localhost:3000"
Write-Host "5. MCP endpoint: http://localhost:3000/mcp"