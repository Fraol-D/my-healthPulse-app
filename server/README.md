# HealthPulse API

Node.js/Express.js backend for the HealthPulse Predictive Health Monitoring System.

## Overview

This RESTful API provides the backend functionality for the HealthPulse application, including user authentication, health data management, and predictive health analytics for chronic diseases such as diabetes and heart disease.

## Features

- **User Authentication**: Secure login, registration, and profile management
- **Health Data Management**: Store and retrieve health metrics and vitals
- **Predictive Analytics**: Generate health risk predictions based on user data
- **Report Generation**: Create detailed health reports with personalized recommendations
- **Admin Controls**: User management and system settings

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing for security

## Setup Instructions

1. **Prerequisites**:
   - Node.js (v16 or newer)
   - MongoDB (local instance or MongoDB Atlas)
   - npm or yarn

2. **Installation**:
   ```bash
   # Clone the repository (if not already done)
   git clone https://github.com/yourusername/HealthPulse.git
   cd HealthPulse/server
   
   # Install dependencies
   npm install
   ```

3. **Environment Configuration**:
   - Create a `.env` file in the server root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/healthpulse
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start the Server**:
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user and get token
- `GET /api/auth/me`: Get current user profile
- `PUT /api/auth/change-password`: Change user password
- `POST /api/auth/logout`: Logout user

### User Endpoints

- `GET /api/users`: Get all users (admin only)
- `GET /api/users/profile/:uuid`: Get user profile by UUID
- `PUT /api/users/profile/:uuid`: Update user profile
- `POST /api/users/profile/:uuid/upload-image`: Upload profile image
- `DELETE /api/users/:uuid`: Delete user (admin only)

### Health Data Endpoints

- `GET /api/health`: Get all health data for logged-in user
- `GET /api/health/:id`: Get specific health data entry
- `POST /api/health`: Add new health data
- `PUT /api/health/:id`: Update health data
- `DELETE /api/health/:id`: Delete health data

### Prediction Endpoints

- `POST /api/predictions/diabetes`: Generate diabetes prediction
- `POST /api/predictions/heart-disease`: Generate heart disease prediction
- `GET /api/predictions/reports`: Get all reports for logged-in user
- `GET /api/predictions/reports/:id`: Get specific report by ID

## Default Admin Access

A default admin user is created during the first run with the following credentials:
- Email: admin@healthpulse.com
- Password: Admin@123

It is recommended to change these credentials immediately after the first login.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 