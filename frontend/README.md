# Job Application Tracker - React Frontend

A modern React frontend for the Job Application Tracker application.

## Features

- **Modern React 18** with functional components and hooks
- **Component-based architecture** for maintainable code
- **Responsive design** that works on all devices
- **Real-time search** and filtering
- **Statistics dashboard** with live updates
- **Modal forms** for adding/editing applications
- **Confirmation dialogs** for safe deletions
- **Toast notifications** for user feedback

## Project Structure

```
src/
├── components/           # React components
│   ├── Header.js        # Application header
│   ├── Actions.js       # Add button and search
│   ├── Stats.js         # Statistics dashboard
│   ├── ApplicationsList.js # List container
│   ├── JobCard.js       # Individual job card
│   ├── JobModal.js      # Add/Edit form modal
│   ├── ConfirmModal.js  # Delete confirmation
│   └── Notification.js  # Toast notifications
├── services/            # API services
│   └── api.js          # HTTP requests to backend
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend Spring Boot application running on port 8080

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser** and go to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Development

### Component Architecture

The application is built with a modular component structure:

- **App.js** - Main container with state management
- **Header** - Application title and description
- **Actions** - Add button and search functionality
- **Stats** - Real-time statistics display
- **ApplicationsList** - Container for job application cards
- **JobCard** - Individual job application display
- **JobModal** - Form for adding/editing applications
- **ConfirmModal** - Delete confirmation dialog
- **Notification** - Toast notification system

### State Management

State is managed using React hooks:
- `useState` for local component state
- `useEffect` for side effects and API calls
- Props for parent-child communication

### API Integration

The frontend communicates with the backend through the `api.js` service:
- `fetchApplications()` - Get all applications
- `createApplication()` - Create new application
- `updateApplication()` - Update existing application
- `deleteApplication()` - Delete application

### Styling

- **CSS Modules** approach with global styles
- **Responsive design** using CSS Grid and Flexbox
- **Modern animations** and transitions
- **Mobile-first** responsive approach

## Configuration

### Proxy Configuration

The frontend is configured to proxy API requests to the backend:

```json
{
  "proxy": "http://localhost:8080"
}
```

This means API calls to `/api/jobs` will be forwarded to `http://localhost:8080/api/jobs`.

### Environment Variables

Create a `.env` file in the frontend directory for environment-specific configuration:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_TITLE=Job Application Tracker
```

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **The build output** will be in the `build/` directory

3. **Deploy the contents** of the `build/` directory to your web server

## Customization

### Adding New Fields

1. **Update the backend model** (`JobApplication.java`)
2. **Add form fields** in `JobModal.js`
3. **Update the API calls** in `api.js`
4. **Modify the display** in `JobCard.js`

### Styling Changes

- **Colors**: Update CSS variables in `index.css`
- **Layout**: Modify CSS Grid and Flexbox properties
- **Components**: Update individual component styles

### Adding New Features

1. **Create new components** in the `components/` directory
2. **Add new API methods** in `services/api.js`
3. **Update the main App component** to include new features
4. **Add corresponding styles** in `index.css`

## Troubleshooting

### Common Issues

1. **Backend not running**: Ensure Spring Boot is running on port 8080
2. **CORS errors**: Check proxy configuration in `package.json`
3. **Build errors**: Clear `node_modules` and reinstall dependencies
4. **Port conflicts**: Change port in `package.json` scripts if needed

### Development Tips

- Use React Developer Tools for debugging
- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Test responsive design on different screen sizes

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain component separation of concerns
4. Add proper error handling
5. Test on multiple devices and browsers

## License

This project is open source and available under the MIT License.
