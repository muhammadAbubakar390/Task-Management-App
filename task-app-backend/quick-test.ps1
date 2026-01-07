# quick-test.ps1
$randomNumber = Get-Random -Minimum 10000 -Maximum 99999
$email = "test$randomNumber@example.com"

Write-Host "Testing with: $email" -ForegroundColor Cyan

$requestBody = @{
    email = $email
    password = "password123"
    name = "Test User $randomNumber"
    role = "USER"
}

$jsonBody = $requestBody | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/auth/signup" -Method Post -Body $jsonBody -ContentType "application/json"
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Access Token: $($response.accessToken.Substring(0, 30))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}