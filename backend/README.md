# Job Application Tracker

A modern, responsive web application for tracking job applications throughout your job search process.

## Features

### 🎯 **Core Functionality**
- **Add New Applications**: Track company, role, status, and notes
- **Edit Applications**: Update any field of existing applications
- **Delete Applications**: Remove applications you no longer need
- **Status Tracking**: Monitor progress from application to offer
- **Search & Filter**: Find applications quickly by company, role, or status

### 📊 **Dashboard & Analytics**
- **Real-time Statistics**: Total applications, pending, interviews, and outcomes
- **Visual Status Badges**: Color-coded status indicators
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🎨 **Modern UI/UX**
- **Beautiful Design**: Gradient backgrounds, smooth animations, and modern cards
- **Responsive Layout**: Adapts to any screen size
- **Interactive Elements**: Hover effects, smooth transitions, and intuitive navigation
- **Modal Forms**: Clean, focused input forms for adding/editing applications

## Technology Stack

### Backend
- **Spring Boot 3.5.4** - Java-based REST API
- **Spring Data JPA** - Database operations
- **H2 Database** - In-memory database (can be configured for production)
- **Jakarta Validation** - Input validation and constraints
- **Maven** - Dependency management

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **HTML5 & CSS3** - Modern, semantic markup and styling
- **Font Awesome** - Professional icons
- **Responsive CSS Grid & Flexbox** - Modern layout techniques

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+ (or use the included Maven wrapper)

### Running the Application

1. **Start the Backend**:
   ```bash
   cd jobapptracker
   mvn spring-boot:run
   ```

2. **Access the Application**:
   - **Main App**: http://localhost:8080
   - **H2 Database Console**: http://localhost:8080/h2-console
   - **API Endpoints**: http://localhost:8080/api/jobs

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | Get all job applications |
| `GET` | `/api/jobs/{id}` | Get specific application |
| `POST` | `/api/jobs` | Create new application |
| `PUT` | `/api/jobs/{id}` | Update application |
| `DELETE` | `/api/jobs/{id}` | Delete application |

## Usage Guide

### Adding a New Application
1. Click the **"Add New Application"** button
2. Fill in the required fields:
   - **Company**: Company name
   - **Role**: Job title/position
   - **Status**: Current application status
   - **Notes**: Additional information, interview notes, follow-up tasks
3. Click **"Save Application"**

### Managing Applications
- **Edit**: Click the edit (pencil) icon on any application card
- **Delete**: Click the delete (trash) icon and confirm
- **Search**: Use the search bar to filter applications
- **Status Updates**: Change status as your application progresses

### Application Statuses
- **Applied** - Initial application submitted
- **Under Review** - Application being reviewed
- **Phone Screen** - Initial phone conversation
- **Interview** - First interview scheduled
- **Technical Interview** - Technical assessment
- **Final Interview** - Final round interview
- **Offer** - Job offer received
- **Accepted** - Offer accepted
- **Rejected** - Application rejected
- **Withdrawn** - Application withdrawn

## File Structure

```
src/main/resources/static/
├── index.html          # Main HTML page
├── styles.css          # CSS styling and responsive design
└── script.js           # JavaScript functionality and API integration
```

## Customization

### Adding New Status Types
1. Update the status options in `index.html` (select dropdown)
2. Add corresponding CSS classes in `styles.css`
3. Update the `getStatusClass()` function in `script.js`

### Modifying the Design
- **Colors**: Update CSS custom properties in `styles.css`
- **Layout**: Modify the CSS Grid and Flexbox properties
- **Animations**: Adjust CSS transitions and keyframes

### Adding New Fields
1. Update the `JobApplication` model in the backend
2. Add form fields in `index.html`
3. Update the JavaScript form handling in `script.js`
4. Modify the card rendering to display new fields

## Development Features

### Hot Reload
The application includes Spring Boot DevTools for automatic reloading during development.

### Sample Data
Uncomment the sample data section in `script.js` to populate the application with example job applications for testing.

### Database
- **Development**: H2 in-memory database (data resets on restart)
- **Production**: Configure `application.properties` for your preferred database

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is open source and available under the MIT License.

## Support
For issues or questions, please check the existing issues or create a new one in the repository.

---

**Happy Job Hunting! 🚀**
