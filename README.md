# Logify

A lightweight and efficient logging system designed to simplify tracking and debugging. Logify provides real-time log management, customizable output formats, and seamless integration into any application. Keep your logs organized, accessible, and actionable with minimal overhead.

## Features

- 🔐 **Authentication**
  - Local authentication with email/password
  - OAuth2 integration with GitHub
  - OAuth2 integration with Google
  - Session-based authentication using Redis
  - Email verification system

- 📝 **User Management**
  - User registration with email verification
  - Profile management
  - Session management

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Session Store**: [Redis](https://redis.io/)
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Authentication**: Passport.js with multiple strategies
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis
- SMTP Server (for email verification)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/logify"

# Redis
REDIS_URL="redis://localhost:6379"

# Session
SESSION_SECRET="your-session-secret"

# OAuth GitHub
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:3000/auth/github/callback"

# OAuth Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

# Frontend
FRONTEND_URL="http://localhost:3000"

# Email (SMTP)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@example.com"
```

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Set up the database:
```bash
# Generate Prisma client
yarn prisma generate

# Run migrations
yarn prisma migrate deploy
```

3. Start the development server:
```bash
yarn start:dev
```

## Available Scripts

- `yarn start:dev` - Start the application in development mode
- `yarn start:debug` - Start the application in debug mode
- `yarn start:prod` - Start the application in production mode
- `yarn build` - Build the application
- `yarn test` - Run tests
- `yarn test:e2e` - Run end-to-end tests
- `yarn test:cov` - Generate test coverage report
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier

## API Endpoints

### Authentication

- **POST** `/auth/login` - Login with email and password
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/logout` - Logout current user
- **GET** `/auth/check-session` - Check if user is authenticated
- **GET** `/auth/github` - Initiate GitHub OAuth flow
- **GET** `/auth/github/callback` - GitHub OAuth callback
- **GET** `/auth/google` - Initiate Google OAuth flow
- **GET** `/auth/google/callback` - Google OAuth callback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is [UNLICENSED](LICENSE.md).
