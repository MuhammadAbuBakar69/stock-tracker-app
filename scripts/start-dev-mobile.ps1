<#
Helper script to start Next dev and expose it to your phone on the local network.
Usage:
  Open PowerShell as Administrator (if binding to ports requires it), then:
    .\scripts\start-dev-mobile.ps1

What it does:
- Prints local IPv4 addresses so you can pick one for your phone.
- Starts the dev server bound to 0.0.0.0 so other devices on your LAN can connect.
- Optionally, if you have ngrok installed, it can start ngrok and print the public URL.
#>

function Get-LocalIPv4Addresses {
    $ips = Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -ne '127.0.0.1' } | Select-Object -ExpandProperty IPAddress
    if (-not $ips) {
        $ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -ne '127.0.0.1' } | Select-Object -ExpandProperty IPAddress
    }
    return $ips
}

Write-Host "Detecting local IPv4 addresses..." -ForegroundColor Cyan
$ips = Get-LocalIPv4Addresses
if ($ips) {
    Write-Host "Local IPv4 addresses:" -ForegroundColor Green
    $i = 0
    foreach ($ip in $ips) {
        $i++
        Write-Host "[$i] $ip"
    }
} else {
    Write-Host "No IPv4 addresses found. Make sure you're connected to a network." -ForegroundColor Yellow
}

Write-Host "\nStarting Next.js dev server bound to 0.0.0.0 so phones on your local network can access it..." -ForegroundColor Cyan
Write-Host "If you'd prefer a public URL, install ngrok and the script can create one for you." -ForegroundColor Gray

# Start the dev server. Use start-process so the script can continue.
# We use -- -H 0.0.0.0 to pass the host flag to next dev when using npm scripts.
$npm = (Get-Command npm -ErrorAction SilentlyContinue)
if (-not $npm) {
    Write-Host "npm not found in PATH. Please install Node.js and ensure npm is available." -ForegroundColor Red
    exit 1
}

# Start in a new window so this script doesn't block. Use npm run dev.
Start-Process powershell -ArgumentList "-NoExit","-Command","npm run dev -- -H 0.0.0.0" -WindowStyle Normal

Write-Host "\nDev server started. Choose an IP above and open in your phone's browser:
  http://<YOUR_IP>:3000" -ForegroundColor Green

Write-Host "\nIf you want a public URL using ngrok (optional):" -ForegroundColor Cyan
Write-Host "1) Install ngrok from https://ngrok.com and sign in to get an auth token." -ForegroundColor Gray
Write-Host "2) Run: ngrok http 3000" -ForegroundColor Gray
Write-Host "3) Copy the https://... forwarding URL and open it on your phone." -ForegroundColor Gray
