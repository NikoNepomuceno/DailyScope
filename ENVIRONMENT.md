# Environment Setup

This document explains how to set up environment variables for the Daily Scope project.

## Quick Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual API keys and configuration values.

## Environment Variables

### Required Variables

Currently, no environment variables are required by default. Add any required variables to the `validateEnv()` function in `src/lib/env.ts`.

### Optional Variables

#### API Keys

- `OPENAI_API_KEY` - OpenAI API key for AI features
- `GNEWS_API_KEY` - GNews API key for news articles
- `MAPBOX_API_KEY` - Mapbox API key for mapping features

#### Database

- `DATABASE_URL` - Database connection string

#### Authentication

- `NEXTAUTH_SECRET` - Secret key for NextAuth.js
- `NEXTAUTH_URL` - Base URL for NextAuth.js (defaults to http://localhost:3000)

#### Payment Processing

- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

#### Email Service

- `SENDGRID_API_KEY` - SendGrid API key for email functionality

#### Cloud Storage

- `AWS_ACCESS_KEY_ID` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (defaults to us-east-1)

## Usage in Code

Import the environment utility:

```typescript
import { env, getEnvVar, validateEnv } from "@/lib/env";

// Access environment variables
const apiKey = env.OPENAI_API_KEY;

// Get with validation (throws error if not set)
const requiredApiKey = getEnvVar("OPENAI_API_KEY");

// Validate all required variables (call this early in your app)
validateEnv();
```

## Security Notes

- Never commit `.env.local` to version control
- The `.env.example` file is safe to commit as it contains no real values
- Use different API keys for development and production
- Consider using a secrets management service for production deployments

## Next.js Environment Variables

Next.js automatically loads environment variables from `.env.local` for local development. For production, set environment variables in your hosting platform (Vercel, Netlify, etc.).

### Environment Variable Precedence

1. `.env.local` (always loaded, ignored by git)
2. `.env.development` (when NODE_ENV=development)
3. `.env.production` (when NODE_ENV=production)
4. `.env` (always loaded)

## Troubleshooting

- If you get "Environment variable X is not set" errors, make sure the variable is defined in `.env.local`
- Restart your development server after changing environment variables
- Check that the variable name matches exactly (case-sensitive)
