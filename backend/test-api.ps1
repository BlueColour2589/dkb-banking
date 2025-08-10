# PowerShell commands for testing the Das Kann Kredit API

# 1. Register a user
$registerBody = @{
    email = "john@example.com"
    password = "SecurePass123!"
    firstName = "John"
    lastName = "Doe"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerBody

Write-Host "Registration Response:" -ForegroundColor Green
$registerResponse | ConvertTo-Json

# 2. Login (this will return a token)
$loginBody = @{
    email = "john@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "`nLogin Response:" -ForegroundColor Green
$loginResponse | ConvertTo-Json

# Save the token for future requests
$token = $loginResponse.access_token
Write-Host "`nYour JWT Token:" -ForegroundColor Yellow
Write-Host $token

# 3. Create a joint account
$accountBody = @{
    name = "Family Savings"
    currency = "EUR"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$accountResponse = Invoke-RestMethod -Uri "http://localhost:3000/accounts" `
    -Method POST `
    -Headers $headers `
    -Body $accountBody

Write-Host "`nAccount Creation Response:" -ForegroundColor Green
$accountResponse | ConvertTo-Json

# 4. Get your accounts
$accountsListResponse = Invoke-RestMethod -Uri "http://localhost:3000/accounts" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }

Write-Host "`nYour Accounts:" -ForegroundColor Green
$accountsListResponse | ConvertTo-Json -Depth 5

# 5. Create a transaction (deposit)
if ($accountResponse.data.id) {
    $accountId = $accountResponse.data.id
    
    $transactionBody = @{
        type = "DEPOSIT"
        amount = 1000
        description = "Initial deposit"
    } | ConvertTo-Json
    
    $transactionResponse = Invoke-RestMethod `
        -Uri "http://localhost:3000/accounts/$accountId/transactions" `
        -Method POST `
        -Headers $headers `
        -Body $transactionBody
    
    Write-Host "`nTransaction Response:" -ForegroundColor Green
    $transactionResponse | ConvertTo-Json
}

# 6. Get transactions for the account
if ($accountId) {
    $transactionsResponse = Invoke-RestMethod `
        -Uri "http://localhost:3001/accounts/$accountId/transactions" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    
    Write-Host "`nAccount Transactions:" -ForegroundColor Green
    $transactionsResponse | ConvertTo-Json -Depth 3
}