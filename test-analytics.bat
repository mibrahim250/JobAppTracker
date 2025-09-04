@echo off
echo Testing Spring Boot Analytics API...
echo.

echo 1. Starting Spring Boot (if not running)...
echo    Run: mvn spring-boot:run
echo.

echo 2. Testing Analytics Endpoint...
echo    Testing POST /api/analytics/process
echo.

echo Sample test data:
echo {
echo   "applications": [
echo     {
echo       "company": "Test Company",
echo       "status": "applied",
echo       "applied_at": "2025-01-15"
echo     }
echo   ],
echo   "userId": "test-user"
echo }

echo.
echo 3. Test with curl (when Spring Boot is running):
echo    curl -X POST http://localhost:8080/api/analytics/process ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"applications\":[{\"company\":\"Test\",\"status\":\"applied\",\"applied_at\":\"2025-01-15\"}],\"userId\":\"test\"}"
echo.

echo 4. Health Check:
echo    curl http://localhost:8080/api/analytics/health
echo.

pause


