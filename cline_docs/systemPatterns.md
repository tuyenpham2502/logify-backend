# System Patterns

## Architecture Overview
```
+------------------+
|    API Layer     |
|  (Controllers)   |
+--------+---------+
         |
+--------+---------+    +-------------+
| Business Layer   |<-->|   Guards    |
|   (Services)    |    |             |
+--------+---------+    +-------------+
         |
+--------+---------+    +-------------+
|  Data Layer     |<-->|    Email    |
| (Prisma/Redis)  |    |   Service   |
+------------------+    +-------------+
         |                    |
         v                    v
+--------+---------+    +-------------+
|  OAuth Services  |    |  Template   |
|    & Storage    |    |   Engine    |
+------------------+    +-------------+
```

## Core Patterns

### 1. Request/Response Flow
- Global Prefix: /v1/*
- Response Interceptor transforms all responses
- Exception Filter handles all errors
- Standardized response format for consistency

### 2. Authentication Pattern
- Multi-provider OAuth support
- Session-based authentication
- Redis store for session data
- AuthGuard for route protection
- Session middleware in main application
- Email notifications for auth events

### 3. Data Management
- Prisma for PostgreSQL operations
- Redis for session storage
- Repository pattern via Prisma service
- OAuth profile data storage

### 4. Error Handling
- Centralized exception filter
- Standardized error responses
- HTTP status code mapping
- Detailed error information in development

### 5. Email Communication
- Templated email system
- Dynamic variable injection
- Privacy-safe user data handling
- Responsive HTML templates
- OAuth-specific notifications
- Transactional email support
- Auth flow integration

## Technical Patterns

### 1. Response Format
All API responses follow the pattern:
```typescript
// Success Case
{
  success: true,
  statusCode: number,
  message: string,
  data?: any,
  timestamp: string,
  path: string
}

// Error Case
{
  success: false,
  statusCode: number,
  message: string,
  error: {
    code: string,
    details?: Record<string, unknown>
  },
  timestamp: string,
  path: string
}
```

### 2. Validation Pattern
- DTO-based input validation
- class-validator decorators
- Whitelist validation
- Transform enabled

### 3. Authentication Flow
1. User initiates OAuth login
2. OAuth provider authentication
3. Profile data processing
4. Session created and stored in Redis
5. Welcome email sent with provider context
6. Session ID sent via secure cookie
7. Subsequent requests validated via AuthGuard

### 4. Email Pattern
1. Template selection based on event
2. Dynamic variable processing
3. Privacy-safe data preparation
4. Responsive template rendering
5. HTML and text version generation
6. Queued delivery handling
7. Delivery status tracking

## Operational Patterns

### 1. Logging
- HTTP request logging
- Error logging with stack traces
- Session operations logging
- Email delivery logging
- OAuth flow tracking

### 2. Security
- HTTP-only cookies
- Session security measures
- CORS configuration
- Input validation
- Error sanitization
- Email content sanitization
- OAuth state validation
- Privacy-safe location handling

### 3. Performance
- Redis session store for fast access
- Database indexing
- Response caching (planned)
- Email queue management
- OAuth token caching
- Template precompilation