param(
    [ValidateSet("Add", "List", "Remove")]
    [string]$Action = "Add",
    [string]$Id,
    [string]$Role = "teacher"
)

# Static-site account utility. Passwords are entered privately and only hashes
# are written to data/teacher-users.json. Add, commit, push, and redeploy after changes.
$repoRoot = Split-Path -Parent $PSScriptRoot
$dataPath = Join-Path $repoRoot "data\teacher-users.json"
$dataDirectory = Split-Path -Parent $dataPath

function Read-UserData {
    if (-not (Test-Path -LiteralPath $dataPath)) {
        return @{ users = @() }
    }

    $raw = Get-Content -LiteralPath $dataPath -Raw
    if ([string]::IsNullOrWhiteSpace($raw)) {
        return @{ users = @() }
    }

    $parsed = $raw | ConvertFrom-Json
    if ($null -eq $parsed.users) {
        $parsed | Add-Member -MemberType NoteProperty -Name users -Value @()
    }
    return $parsed
}

function Save-UserData($data) {
    if (-not (Test-Path -LiteralPath $dataDirectory)) {
        New-Item -ItemType Directory -Path $dataDirectory | Out-Null
    }
    $data | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $dataPath -Encoding UTF8
}

function Get-PasswordHash([Security.SecureString]$securePassword) {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    try {
        $plainText = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
        $bytes = [Text.Encoding]::UTF8.GetBytes($plainText)
        $sha256 = [Security.Cryptography.SHA256]::Create()
        try {
            $hashBytes = $sha256.ComputeHash($bytes)
        }
        finally {
            $sha256.Dispose()
        }
        return ([BitConverter]::ToString($hashBytes) -replace "-", "").ToLowerInvariant()
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
}

$data = Read-UserData
$users = @($data.users)

switch ($Action) {
    "Add" {
        if ([string]::IsNullOrWhiteSpace($Id)) {
            $Id = Read-Host "New sign-in ID"
        }
        if ([string]::IsNullOrWhiteSpace($Id)) {
            throw "A sign-in ID is required."
        }
        if ($users | Where-Object { $_.id -eq $Id }) {
            throw "That sign-in ID already exists."
        }

        $securePassword = Read-Host "Password for $Id" -AsSecureString
        $newUser = [PSCustomObject]@{
            id = $Id
            role = $Role
            passwordHash = Get-PasswordHash $securePassword
            active = $true
        }
        $users += $newUser
        $data.users = $users
        Save-UserData $data
        Write-Host "Added $Id. The password was not displayed or saved in plaintext."
        Write-Host "Commit, push, and redeploy this site for the account to become available online."
    }
    "List" {
        if ($users.Count -eq 0) {
            Write-Host "No accounts found."
        }
        else {
            $users | Select-Object id, role, active | Format-Table -AutoSize
        }
    }
    "Remove" {
        if ([string]::IsNullOrWhiteSpace($Id)) {
            throw "Use -Id with -Action Remove."
        }
        $remaining = @($users | Where-Object { $_.id -ne $Id })
        if ($remaining.Count -eq $users.Count) {
            throw "That sign-in ID was not found."
        }
        $data.users = $remaining
        Save-UserData $data
        Write-Host "Removed $Id. Commit, push, and redeploy this site to publish the change."
    }
}
