param(
    [string]$HostName = "47.105.112.190",
    [string]$UserName = "root",
    [string]$Password = $env:GM_SSH_PASSWORD,
    [string]$BoundHost = "127.0.0.1",
    [int]$BoundPort = 3307,
    [string]$RemoteAddress = "127.0.0.1",
    [int]$RemotePort = 3306
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Password)) {
    throw "GM_SSH_PASSWORD is required."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$runDir = Join-Path (Split-Path -Parent $scriptDir) "run"
if (-not (Test-Path $runDir)) {
    New-Item -ItemType Directory -Path $runDir | Out-Null
}

$logPath = Join-Path $runDir "db-tunnel.log"
$statusPath = Join-Path $runDir "db-tunnel.status.txt"

function Write-Log {
    param([string]$Message)
    $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -Path $logPath -Value $line -Encoding UTF8
}

Import-Module Posh-SSH

$securePassword = ConvertTo-SecureString $Password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($UserName, $securePassword)

$session = $null

try {
    Write-Log "Start SSH session."
    $session = New-SSHSession -ComputerName $HostName -Credential $credential -AcceptKey -ConnectionTimeout 20
    New-SSHLocalPortForward -SessionId $session.SessionId -BoundHost $BoundHost -BoundPort $BoundPort -RemoteAddress $RemoteAddress -RemotePort $RemotePort | Out-Null

    "session_id=$($session.SessionId)" | Set-Content -Path $statusPath -Encoding UTF8
    Write-Log "SSH tunnel ready: $BoundHost`:$BoundPort -> $RemoteAddress`:$RemotePort"

    while ($true) {
        Start-Sleep -Seconds 5
    }
}
catch {
    Write-Log "SSH tunnel failed: $($_.Exception.Message)"
    throw
}
finally {
    if ($session) {
        try {
            Stop-SSHPortForward -SessionId $session.SessionId -BoundHost $BoundHost -BoundPort $BoundPort | Out-Null
        }
        catch {
            Write-Log "Stop port forward failed: $($_.Exception.Message)"
        }

        try {
            Remove-SSHSession -SessionId $session.SessionId | Out-Null
        }
        catch {
            Write-Log "Close SSH session failed: $($_.Exception.Message)"
        }
    }
}
