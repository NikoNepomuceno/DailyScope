/**
 * Environment variable validation utility
 * This file helps ensure required environment variables are present
 */

export const env = {
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GNEWS_API_KEY: process.env.GNEWS_API_KEY,
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // External Services
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  
  // Email Service
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  
  // Cloud Storage
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  
  // Other Services
  MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
  
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

/**
 * Validate required environment variables
 * Call this function early in your app to ensure all required env vars are present
 */
export function validateEnv() {
  const requiredVars: (keyof typeof env)[] = [
    // Add your required environment variables here
    // 'OPENAI_API_KEY',
    // 'DATABASE_URL',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

/**
 * Get environment variable with type safety
 */
export function getEnvVar(key: keyof typeof env): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
