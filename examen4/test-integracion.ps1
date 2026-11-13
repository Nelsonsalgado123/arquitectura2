# Script de Pruebas de Integracion - Taller 4 Docker (ITM)
$ErrorActionPreference = "Stop"

Write-Host "=== 1. Probando API ExpressJS + MongoDB (http://localhost:3000/paises) ===" -ForegroundColor Cyan
$paises = Invoke-RestMethod -Uri "http://localhost:3000/paises" -Method Get
if ($paises.Count -lt 1) { throw "No se recibieron paises desde apiDivisionPolitica." }
Write-Host "OK: $($paises.Count) paises recibidos." -ForegroundColor Green

Write-Host "`n=== 2. Obteniendo Token JWT en API Spring Boot + PostgreSQL ===" -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "http://localhost:3001/api/usuarios/validar/frayosorio/123" -Method Get
if (-not $login.token) { throw "No se recibio token JWT en el login." }
Write-Host "OK: Usuario '$($login.usuario.usuario)' autenticado. Token recibido." -ForegroundColor Green

$headers = @{ Authorization = "Bearer $($login.token)" }

Write-Host "`n=== 3. Probando consulta en PostgreSQL (buscarporpais/Colombia) ===" -ForegroundColor Cyan
$moneda = Invoke-RestMethod -Uri "http://localhost:3001/api/monedas/buscarporpais/Colombia" -Method Get -Headers $headers
if ($moneda.sigla -ne "COP") { throw "Moneda inesperada para Colombia: $($moneda | ConvertTo-Json -Compress)" }
Write-Host "OK: Moneda = $($moneda.nombre) ($($moneda.sigla))." -ForegroundColor Green

Write-Host "`n=== 4. Probando comunicacion entre microservicios (apiMonedas -> apiDivisionPolitica -> MongoDB) ===" -ForegroundColor Cyan
$capital = Invoke-RestMethod -Uri "http://localhost:3001/api/paises/capital/Colombia" -Method Get -Headers $headers
if (-not $capital.ciudad) { throw "No se recibio capital desde apiDivisionPolitica." }
Write-Host "OK: Capital = $($capital.ciudad), Estado = $($capital.estado)." -ForegroundColor Green

Write-Host "`nTODAS LAS PRUEBAS DE INTEGRACION PASARON EXITOSAMENTE." -ForegroundColor Green
