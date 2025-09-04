@echo off
echo Starting Spring Boot Backend...
echo.
echo Make sure you have:
echo 1. Java 17+ installed
echo 2. Maven installed
echo 3. PostgreSQL running on port 5432
echo 4. Database 'jobtracker' created
echo.
echo Press any key to continue...
pause >nul

echo.
echo Building and starting Spring Boot application...
mvn spring-boot:run

echo.
echo Backend stopped. Press any key to exit...
pause >nul


