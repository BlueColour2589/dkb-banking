# Simple test for Das Kann Kredit API

Write-Host "=== Simple API Test ===" -ForegroundColor Cyan

# Test with existing user (john@example.com)
Write-Host "`nLogging in with existing user..." -ForegroundColor Yellow
$login = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"john@example.com","password":"SecurePass123!"}'

if ($login.access_token) {
    Write-Host "✓ Login successful!" -ForegroundColor Green
    $token = $login.access_token
    Write-Host "User: $($login.user.email)" -ForegroundColor Gray
    
    # Create a new account
    Write-Host "`nCreating a new account..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $account = Invoke-RestMethod -Uri "http://localhost:3000/accounts" `
        -Method POST `
        -Headers $headers `
        -Body '{"name":"My Savings Account","currency":"EUR"}'
    
    if ($account.success) {
        Write-Host "✓ Account created successfully!" -ForegroundColor Green
        Write-Host "Account ID: $($account.data.id)" -ForegroundColor Gray
        Write-Host "Account Name: $($account.data.name)" -ForegroundColor Gray
        Write-Host "Balance: $($account.data.balance) EUR" -ForegroundColor Gray
    }
    
    # List all accounts
    Write-Host "`nFetching all accounts..." -ForegroundColor Yellow
    $accounts = Invoke-RestMethod -Uri "http://localhost:3000/accounts" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $token"}
    
    if ($accounts.success) {
        Write-Host "✓ Found $($accounts.data.Count) account(s):" -ForegroundColor Green
        foreach ($acc in $accounts.data) {
            Write-Host "  - $($acc.name): $($acc.balance) EUR" -ForegroundColor Gray
        }
    }
}
else {
    Write-Host "× Login failed!" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan