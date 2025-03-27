# Technical Context

## Core Technologies
- NestJS (v11) - Backend framework
- PostgreSQL - Primary database
- Redis - Session storage
- Express-session - Session management
- Prisma - ORM for database access
- class-validator - Input validation
- Swagger/OpenAPI - API documentation
- Nodemailer - Email service

## Email Service
- Template-based email system with dynamic variables
- Responsive HTML email templates
- OAuth-specific welcome emails
- Transactional email support
- Integration with auth flows
- Queue management for email delivery

## Email Template Variables
Standard variables available in templates:
- {{provider}} - OAuth provider name
- {{loginTime}} - Formatted login timestamp
- {{device}} - User device information
- {{location}} - General location info
- {{logoUrl}} - Company logo URL
- {{securityUrl}} - Security settings URL
- {{currentYear}} - Dynamic copyright year
- {{companyAddress}} - Company contact info

## Authentication Flow
- Session-based authentication using Redis store
- OAuth provider integration (Google, GitHub)
- Secure cookie configuration for session management
- Protected routes using AuthGuard
- Welcome email for new user registration
- Session invalidation on logout

## Response Format Standards
1. Success Response Structure:
```typescript
{
  success: true;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}
```

2. Error Response Structure:
```typescript
{
  success: false;
  statusCode: number;
  message: string;
  error: {
    code: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  path: string;
}
```

## Technical Constraints
- Session timeout: 24 hours
- Cookie security settings vary by environment
- Input validation required for all endpoints
- Standardized response format for all API responses
- Email templates must be HTML/text compatible
- Rate limiting for email sending
- Privacy-safe location tracking

## Development Environment
- Node.js v20+
- TypeScript
- ESLint + Prettier for code formatting
- Jest for testing
- Local SMTP server for email testing

## Configuration Requirements
- Redis connection settings
- SMTP server configuration
- Session secret
- Cookie settings
- Email sender details
- OAuth provider credentials
- Company branding assets