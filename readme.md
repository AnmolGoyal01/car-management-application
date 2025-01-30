# Car Management Application

A robust backend for a **Car Management System** built with the **MERN stack and typescript**. This project supports CRUD operations on cars and users, along with user authentication. Get detailed Postman Api Documentation [here](https://anmol-car-management.azurewebsites.net/api/docs)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Cars](#cars)
  - [Health Check](#health-check)
- [Middlewares](#middlewares)
- [Error Handling and API Response](#error-handling-and-api-response)

## Features

- **User Authentication**: Register, login, logout, and password management.
- **Car Management**: Users can view available cars with filtering and pagination.
- **Health Check**: API health monitoring.
- **Proper Api Documentation**: You can find postman api documentation [here](https://anmol-car-management.azurewebsites.net/api/docs)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **File Upload**: Cloudinary
- **Hosting**: Azure
- **Authentication**: JSON Web Token (JWT)
- **Password Hashing**: bcrypt
- **Other Libraries**: mongoose-aggregate-paginate-v2

## Project Structure

```plaintext
src
├── controllers          # API controllers
├── middlewares          # Authentication middlewares
├── models               # Mongoose models for User, Car, etc.
├── routes               # Express routes for each resource
├── utils                # Utilities and helpers
├── config               # Database connection and setup configurations
├── app.js               # Express app setup and configuration
├── constants.js         # Application-wide constants configuration
└── index.js             # Entry point to start the server
```

## Setup & Installation

- Clone the repository:

```bash
  git clone https://github.com/anmolGoyal01/car-management-backend
  cd car-management-backend
```
    
- Install dependencies:

```bash
  npm install
```
- Configure environment variables: Create a `.env` file at the root level and add the following variables:

```bash
  PORT=4000
  CORS_ORIGIN=*
  MONGODB_URI=<Your MongoDB URI>
  ACCESS_TOKEN_SECRET=<Your JWT_SECRET key>
  ACCESS_TOKEN_EXPIRY=1d
  CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloudname>
  CLOUDINARY_API_KEY= <Your Cloudinary Api Key>
  CLOUDINARY_API_SECRET= <Your Cloudinary Api Secret>
```
    
- Run in Development:

```bash
  npm run dev
```
- Build and start server:

```bash
  npm run build
  npm run start
```

The server should now be running at `http://localhost:4000`

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

`PORT`
`CORS_ORIGIN`
`MONGODB_URI`
`ACCESS_TOKEN_SECRET`
`ACCESS_TOKEN_EXPIRY`
`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET`

## API Documentation
Get detailed Postman Api Documentation with details on
request parameters, authentication requirements, and response structure [here](https://anmol-car-management.azurewebsites.net/api/docs)

#### Authentication
- Register User: `POST api/user/register`
- Login User: `POST api/user/login`
- Logout User: `POST api/user/logout`
- Get Current User: `GET api/user/me`

#### Cars
- Get all cars: `GET api/car/`
- Get user cars: `GET api/car/my-cars`
- Get car by ID: `GET api/car/:id`
- Add a new car : `POST api/car/add`
- Update a car : `PATCH api/car/:id`
- Delete a car : `DELETE api/car/:id`

#### Health Check
- Server health check: `GET api/healthcheck/`

## Middlewares

#### Authentication Middleware:
- `verifyJwt`: Protects routes by verifying JWT tokens.
- `uploadImage`: Uploads Image through multer

## Error Handling and API Response

This application includes a robust error-handling system and custom response handling to ensure consistency and clarity in API responses.

- **Error Handling**: The `ApiError` utility class is used for creating custom errors with specific HTTP statuses and messages. Any API error that occurs will be thrown as an `ApiError` instance and caught by the error handler, which then sends a standardized JSON response with the error code and message.
- **Custom API Response**: All successful responses are wrapped in the `ApiResponse` class to maintain a consistent structure. Each response includes an HTTP status code, a data payload (if applicable), and a message, ensuring all client responses follow the same structure.

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://anmolgoyal.me/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anmol-goyal-358804235/)
[![github](https://img.shields.io/badge/github-010101?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AnmolGoyal01/)
