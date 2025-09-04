# Job Application Tracker

A full-stack job application tracking system built with **Spring Boot + Java** backend and **React.js** frontend.

## 🚀 Features

- **Backend**: Spring Boot REST API with JPA/Hibernate
- **Frontend**: React.js with modern UI components
- **Database**: PostgreSQL with automatic schema generation
- **Authentication**: Supabase integration (frontend)
- **API**: RESTful endpoints for CRUD operations
- **Validation**: Input validation and error handling

## 🏗️ Architecture

```
├── Backend (Spring Boot + Java)
│   ├── Controllers (REST API endpoints)
│   ├── Services (Business logic)
│   ├── Repositories (Data access)
│   ├── Models (JPA entities)
│   └── Configuration (Database, CORS, etc.)
│
├── Frontend (React.js)
│   ├── Components (UI components)
│   ├── Services (API calls)
│   └── Styling (CSS)
│
└── Database (PostgreSQL)
    └── Automatic schema generation
```

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Hibernate**
- **PostgreSQL**
- **Maven**

### Frontend
- **React 18**
- **Supabase** (Authentication & Database)
- **Modern CSS**

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd job-application-tracker
```

### 2. Backend Setup (Spring Boot)

#### Start PostgreSQL
Make sure PostgreSQL is running on port 5432 with a database named `jobtracker`.

#### Configure Database
Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### Run Spring Boot Application
```bash
# Navigate to project root
cd .

# Run with Maven
mvn spring-boot:run

# Or build and run
mvn clean package
java -jar target/job-application-tracker-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup (React)

#### Install Dependencies
```bash
# Install React dependencies
npm install
```

#### Start React Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔌 API Endpoints

### Job Applications
- `GET /api/job-applications` - Get all applications
- `GET /api/job-applications/{id}` - Get application by ID
- `POST /api/job-applications` - Create new application
- `PUT /api/job-applications/{id}` - Update application
- `DELETE /api/job-applications/{id}` - Delete application

### Statistics
- `GET /api/job-applications/stats/total-count` - Get total count
- `GET /api/job-applications/stats/count-by-status/{status}` - Get count by status

### Filtering
- `GET /api/job-applications/status/{status}` - Get by status
- `GET /api/job-applications/company/{company}` - Get by company
- `GET /api/job-applications/with-projects` - Get applications with projects

### Health Check
- `GET /api/job-applications/health` - API health status

## 🗄️ Database Schema

The application automatically creates the following table:

```sql
CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE,
    notes TEXT,
    project_name VARCHAR(255),
    project_title VARCHAR(255),
    project_url VARCHAR(500),
    project_description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Configuration

### Backend Configuration
- **Port**: 8080 (configurable in `application.properties`)
- **Database**: PostgreSQL with automatic schema generation
- **CORS**: Enabled for React frontend (`http://localhost:3000`)

### Frontend Configuration
- **Port**: 3000
- **Backend API**: `http://localhost:8080/api`
- **Supabase**: Configured for authentication

## 🧪 Testing

### Backend Tests
```bash
mvn test
```

### API Testing
Use tools like Postman or curl to test the REST endpoints:

```bash
# Health check
curl http://localhost:8080/api/job-applications/health

# Get all applications
curl http://localhost:8080/api/job-applications

# Create application
curl -X POST http://localhost:8080/api/job-applications \
  -H "Content-Type: application/json" \
  -d '{"company":"Tech Corp","role":"Software Engineer","status":"Applied"}'
```

## 🚀 Deployment

### Backend Deployment
```bash
mvn clean package
java -jar target/job-application-tracker-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository.

---

**Happy Job Hunting! 🎯**




