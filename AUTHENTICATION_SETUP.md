# Authentication & Analytics System Setup Guide

This guide explains how to set up and use the authentication and analytics system for the Synura website API.

## ✅ System Overview

The system provides:
- **API Key Authentication** - Secure access control for external integrations
- **Analytics Logging** - Comprehensive tracking of API usage, leads, and ROI calculations
- **Admin Dashboard** - Web interface for managing API keys and viewing analytics
- **Rate Limiting** - Protection against API abuse
- **PostgreSQL Database** - Persistent storage for all data

## 🚀 Quick Start

### 1. Database Setup

First, set up your PostgreSQL database:

```bash
# Create the database tables
psql -d your_database_name -f database/schema.sql
```

### 2. Environment Variables

Add these to your `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synura_db"

# Optional: Retell AI integration
RETELL_API_KEY="your_retell_api_key"
NEXT_PUBLIC_RETELL_AGENT_ID="your_agent_id"
```

### 3. Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install @vercel/postgres crypto-js bcryptjs
```

### 4. Start Development Server

```bash
npm run dev
```

## 🔑 API Key Management

### Creating Your First Admin API Key

Since this is a new system, you'll need to create an admin API key manually through the database:

```sql
-- Connect to your database and run:
INSERT INTO api_keys (key_id, name, description, key_hash, is_active)
VALUES (
  'syn_admin_' || generate_random_uuid()::text,
  'Admin Key',
  'Initial admin key for dashboard access',
  '$2a$12$your_bcrypt_hash_here',
  true
);
```

Or use the auth utilities:

```typescript
import { createAPIKey } from './src/lib/auth'

const result = await createAPIKey('Admin API Key', 'Main admin access')
console.log('Admin Key:', result.key) // Save this securely!
```

### Using the Admin Dashboard

1. Visit `http://localhost:3000/admin`
2. The dashboard will show demo data by default
3. Update the API key in the fetch calls to use your real admin key
4. Create API keys for external integrations

## 📊 API Endpoints

### Public APIs (No Authentication)
- `GET /api/v1/services` - Get services and pricing data
- `GET /api/v1/faqs` - Get FAQ content

### Business APIs (Optional Authentication)
- `POST /api/v1/voice/leads` - Capture leads
- `POST /api/v1/voice/meetings` - Book meetings
- `POST /api/v1/voice/feedback` - Submit feedback
- `POST /api/v1/roi/estimate` - Calculate ROI

### Admin APIs (Admin Authentication Required)
- `GET /api/v1/admin/dashboard` - Dashboard summary
- `GET /api/v1/admin/analytics` - Analytics data
- `GET /api/v1/admin/keys` - List API keys
- `POST /api/v1/admin/keys` - Create API key
- `DELETE /api/v1/admin/keys` - Deactivate/delete API key

## 🧪 Testing the System

### Run the Test Suite

```bash
# Install ts-node if not installed
npm install -g ts-node

# Run the comprehensive test suite
npx ts-node tests/admin-system-test.ts
```

### Run the API Demo

```bash
# Run the curl-based API demo
bash tests/api-demo.sh
```

## 🔐 Authentication Methods

### Method 1: Authorization Header
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     "http://localhost:3000/api/v1/services"
```

### Method 2: X-API-Key Header
```bash
curl -H "X-API-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     "http://localhost:3000/api/v1/services"
```

## 📈 Analytics Features

### What Gets Tracked

1. **API Requests**
   - Endpoint usage
   - Response times
   - Error rates
   - IP addresses and user agents

2. **Lead Capture**
   - Contact information
   - Intent and source
   - UTM parameters
   - Conversion tracking

3. **ROI Calculations**
   - Input parameters
   - Generated estimates
   - Industry and company size
   - Confidence levels

### Viewing Analytics

1. **Admin Dashboard**: `http://localhost:3000/admin`
2. **Analytics Page**: `http://localhost:3000/admin/analytics`
3. **API Keys Page**: `http://localhost:3000/admin/keys`

## 🛡️ Security Features

### Rate Limiting
- **Public APIs**: 100 requests/minute per IP
- **Authenticated APIs**: 60 requests/minute per API key
- **Admin APIs**: 300 requests/minute per admin key

### API Key Security
- Keys are hashed with bcrypt (12 rounds)
- Keys are only shown once during creation
- Deactivation preserves data for analytics
- Usage tracking and last-used timestamps

### CORS Protection
- Configurable origins
- Proper preflight handling
- Security headers included

## 📋 Integration Examples

### Lead Capture Integration
```javascript
const response = await fetch('/api/v1/voice/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your_api_key'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    intent: 'consultation',
    source: 'website'
  })
});
```

### ROI Calculator Integration
```javascript
const response = await fetch('/api/v1/roi/estimate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    companySize: '11-50',
    industry: 'technology',
    employeeCount: 25,
    manualTaskHours: 20,
    automationAreas: ['customer-service', 'lead-management']
  })
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL in environment variables
   - Ensure PostgreSQL is running
   - Verify database exists and schema is applied

2. **Authentication Failures**
   - Verify API key format (starts with 'syn_')
   - Check if key is active in database
   - Ensure proper header format

3. **Rate Limit Exceeded**
   - Check X-RateLimit headers in response
   - Wait for rate limit window to reset
   - Consider upgrading to authenticated requests

### Debug Mode

Enable detailed logging by setting:
```bash
NODE_ENV=development
```

### Database Queries

Check analytics data directly:
```sql
-- View recent API requests
SELECT * FROM api_analytics ORDER BY created_at DESC LIMIT 10;

-- View recent leads
SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;

-- View API key usage
SELECT name, usage_count, last_used_at FROM api_keys WHERE is_active = true;
```

## 📚 Next Steps

1. **Production Setup**
   - Configure production database
   - Set up proper environment variables
   - Deploy to Vercel or your hosting platform

2. **Monitoring**
   - Set up alerts for high error rates
   - Monitor API key usage patterns
   - Review analytics regularly

3. **Integration**
   - Provide API keys to external platforms
   - Set up webhooks for lead processing
   - Configure CRM integrations

4. **Scaling**
   - Consider Redis for rate limiting at scale
   - Implement database connection pooling
   - Add caching for frequently accessed data

## 🎯 Support

For questions or issues:
1. Check the test files for examples
2. Review the API route implementations
3. Check database logs for errors
4. Use the admin dashboard for monitoring

The system is now ready for production use with comprehensive authentication, analytics, and management capabilities!