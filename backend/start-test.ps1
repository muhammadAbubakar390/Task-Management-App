# start-test.ps1
cd "C:\Users\my computer\Pictures\task-assignment-app\task-app-backend"

# Set environment variables
$env:JWT_SECRET="5R8HxfzPdcrqugD90pZF3VtjGEYSkJwK7lmCisLQANMbo6y4eaIh1XWTUOBnv2"
$env:JWT_REFRESH_SECRET="7Mc6oOQnG9ji4hpSKrqFCWyDwlVBHEPZ5sefYz1tTLdJkv0aum2xAINXR3Ug8b"

Write-Host "Starting backend..." -ForegroundColor Green
npm run start:dev