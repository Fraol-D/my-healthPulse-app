# HealthPulse - Frontend Application

The HealthPulse frontend is a modern, responsive React application that provides a user-friendly interface for the HealthPulse Predictive Health Monitoring System.

## Features

- **Dashboard**: View health status at a glance with key metrics and risk assessments
- **Health Data Management**: Input and track personal health metrics
- **Predictive Analytics**: View health risk assessments for diabetes and heart disease
- **Reports**: Generate and view detailed health reports
- **User Management**: Profile management and settings
- **Admin Dashboard**: Administrative controls for system management (admin users only)
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Switch between themes for comfortable viewing

## Tech Stack

- **React.js** - Frontend framework
- **Material-UI** - Component library for modern UI design
- **React Router** - For client-side navigation
- **Axios** - For API communication
- **Chart.js** - For data visualization
- **Context API** - For state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/healthpulse.git
   cd healthpulse/client
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   ```
   Edit `.env` to update any necessary variables

4. Start the development server
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

5. Build for production
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

## Project Structure

```
client/
├── public/           # Public assets
├── src/              # Source files
│   ├── assets/       # Static assets (images, fonts)
│   ├── components/   # Reusable components
│   ├── context/      # Context API providers
│   ├── pages/        # Page components
│   ├── utils/        # Utility functions
│   ├── App.js        # Main App component
│   ├── index.js      # Entry point
│   └── theme.js      # Theme configuration
├── package.json      # Project dependencies
└── README.md         # This file
```

## Key Pages

- **Login/Register**: User authentication
- **Dashboard**: Overview of health status
- **Health Data**: Input and view health metrics
- **Predictions**: View health risk assessments
- **Reports**: Generate and view health reports
- **Profile**: Manage user profile
- **Admin Dashboard**: System administration (admin users only)

## Development Guidelines

### Coding Standards

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks
- Prefer named exports over default exports
- Keep components small and focused on a single responsibility

### Adding New Features

1. Create component files in the appropriate directory
2. Update routes in `App.js` if creating new pages
3. Use the existing theme and styling system
4. Update API utilities in `utils/api.js` if adding new endpoints

## Authentication

Authentication is handled through JWT tokens. The `AuthContext` provides the following functions:

- `login(credentials)`: Log in a user
- `register(userData)`: Register a new user
- `logout()`: Log out the current user
- `updateProfile(userData)`: Update user profile
- `changePassword(passwordData)`: Change user password

## API Communication

All API calls are centralized in the `utils/api.js` file, which provides the following modules:

- `authAPI`: Authentication endpoints
- `healthDataAPI`: Health data endpoints
- `predictionsAPI`: Prediction endpoints
- `reportsAPI`: Report endpoints
- `adminAPI`: Admin endpoints

## Theming

The application supports both light and dark themes through the `ThemeContext` provider. The theme can be toggled using the `toggleTheme()` function.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 