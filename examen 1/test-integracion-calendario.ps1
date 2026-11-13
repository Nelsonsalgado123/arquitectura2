# Script de Pruebas de Integracion - Calendario Laboral + Festivos (Onion + Docker Compose)
$ErrorActionPreference = "Stop"

Write-Host "=== 1. Probando API Festivos + MongoDB (http://localhost:3030/api/festivos/obtener/2026) ===" -ForegroundColor Cyan
$festivos = Invoke-RestMethod -Uri "http://localhost:3030/api/festivos/obtener/2026" -Method Get
if ($festivos.Count -lt 15) { throw "Se esperaban los festivos de Colombia desde MongoDB." }
Write-Host "OK: $($festivos.Count) festivos calculados para 2026." -ForegroundColor Green

Write-Host "`n=== 2. Probando verificacion puntual de festivo (2026-07-20) ===" -ForegroundColor Cyan
$verif = Invoke-RestMethod -Uri "http://localhost:3030/api/festivos/verificar/2026/7/20" -Method Get
if ($verif -ne "Es Festivo") { throw "Respuesta inesperada para 2026-07-20: $verif" }
Write-Host "OK: 2026-07-20 -> $verif" -ForegroundColor Green

Write-Host "`n=== 3. Verificando seguridad JWT (403 sin token en /api/calendario/listar/2026) ===" -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/calendario/listar/2026" -Method Get | Out-Null
    throw "Se esperaba 403 Forbidden sin token, pero respondio 200."
} catch {
    if ($_.Exception.Response -and ([int]$_.Exception.Response.StatusCode -eq 403)) {
        Write-Host "OK: Bloqueado con 403 Forbidden sin token." -ForegroundColor Green
    } else {
        throw "Error inesperado al validar seguridad sin token: $_"
    }
}

Write-Host "`n=== 4. Obteniendo Token JWT en API Calendario + PostgreSQL ===" -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "http://localhost:8080/api/usuarios/validar/admin/admin123" -Method Get
if (-not $login.token) { throw "No se recibio token JWT." }
Write-Host "OK: Usuario '$($login.usuario.usuario)' autenticado." -ForegroundColor Green
$headers = @{ Authorization = "Bearer $($login.token)" }

Write-Host "`n=== 5. Probando CRUD de Tipo con JWT (http://localhost:8080/api/tipos/) ===" -ForegroundColor Cyan
$tipos = Invoke-RestMethod -Uri "http://localhost:8080/api/tipos/" -Method Get -Headers $headers
if ($tipos.Count -lt 3) { throw "Faltan tipos base en PostgreSQL." }
Write-Host "OK: $($tipos.Count) tipos registrados: $(($tipos | ForEach-Object { $_.tipo }) -join ', ')" -ForegroundColor Green

Write-Host "`n=== 6. Generando calendario 2026 con JWT (Spring Boot -> API Festivos -> PostgreSQL) ===" -ForegroundColor Cyan
$gen = Invoke-RestMethod -Uri "http://localhost:8080/api/calendario/generar/2026" -Method Get -Headers $headers
if ($gen -ne $true) { throw "Fallo la generacion del calendario 2026." }
Write-Host "OK: Calendario 2026 generado = $gen" -ForegroundColor Green

Write-Host "`n=== 7. Listando calendario 2026 generado con JWT ===" -ForegroundColor Cyan
$cal = Invoke-RestMethod -Uri "http://localhost:8080/api/calendario/listar/2026" -Method Get -Headers $headers
if ($cal.Count -ne 365) { throw "Se esperaban 365 dias para 2026 y llegaron $($cal.Count)." }
Write-Host "OK: $($cal.Count) dias listados para 2026." -ForegroundColor Green

Write-Host "`nTODAS LAS PRUEBAS DE ONION + DOCKER COMPOSE PASARON EXITOSAMENTE." -ForegroundColor Green
