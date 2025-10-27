import * as crypto from 'crypto-js'
import bcrypt from 'bcryptjs'
import { apiKeysDB } from './database'

/**
 * API Key Authentication System
 * Handles generation, validation, and management of API keys for Synura APIs
 */

// Configuration
const API_KEY_PREFIX = 'syn'
const API_KEY_LENGTH = 32 // Length of the random part
const SALT_ROUNDS = 12 // bcrypt salt rounds for hashing

export interface GeneratedAPIKey {
  keyId: string
  key: string // The actual key to give to the user (only shown once)
  hashedKey: string // The hashed version to store in database
}

export interface APIKeyValidation {
  isValid: boolean
  keyId?: string
  keyData?: any
}

/**
 * Generate a new API key
 * Returns the key ID, plain key (for user), and hashed key (for storage)
 */
export function generateAPIKey(): GeneratedAPIKey {
  // Generate a unique key ID (shorter, for database indexing)
  const keyId = `${API_KEY_PREFIX}_${crypto.lib.WordArray.random(16).toString(crypto.enc.Hex)}`

  // Generate the actual API key (longer, for security)
  const randomBytes = crypto.lib.WordArray.random(API_KEY_LENGTH)
  const key = `${API_KEY_PREFIX}_${randomBytes.toString(crypto.enc.Hex)}`

  // Hash the key for secure storage
  const hashedKey = hashAPIKey(key)

  return {
    keyId,
    key,
    hashedKey
  }
}

/**
 * Hash an API key for secure storage
 */
export function hashAPIKey(key: string): string {
  return bcrypt.hashSync(key, SALT_ROUNDS)
}

/**
 * Verify an API key against a hash
 */
export function verifyAPIKey(key: string, hash: string): boolean {
  return bcrypt.compareSync(key, hash)
}

/**
 * Validate an API key from a request
 * Checks if the key exists, is active, and matches the stored hash
 */
export async function validateAPIKey(key: string): Promise<APIKeyValidation> {
  try {
    if (!key || !key.startsWith(API_KEY_PREFIX)) {
      return { isValid: false }
    }

    // Extract key ID from the key for database lookup
    // For our implementation, we'll search by validating against all active keys
    // In production, you might want a more efficient lookup mechanism

    const allKeys = await apiKeysDB.getAll()

    for (const keyRecord of allKeys) {
      if (keyRecord.is_active && verifyAPIKey(key, keyRecord.key_hash)) {
        // Update usage tracking
        await apiKeysDB.updateUsage(keyRecord.key_id)

        return {
          isValid: true,
          keyId: keyRecord.key_id,
          keyData: {
            id: keyRecord.id,
            name: keyRecord.name,
            description: keyRecord.description,
            usage_count: keyRecord.usage_count,
            last_used_at: keyRecord.last_used_at
          }
        }
      }
    }

    return { isValid: false }
  } catch (error) {
    console.error('API key validation error:', error)
    return { isValid: false }
  }
}

/**
 * Create a new API key in the database
 */
export async function createAPIKey(name: string, description?: string): Promise<{
  success: boolean
  key?: string
  keyId?: string
  error?: string
}> {
  try {
    const generated = generateAPIKey()

    const apiKey = await apiKeysDB.create({
      key_id: generated.keyId,
      name,
      description,
      key_hash: generated.hashedKey,
      is_active: true,
      last_used_at: undefined
    })

    return {
      success: true,
      key: generated.key, // Return the plain key (only time it's shown)
      keyId: generated.keyId
    }
  } catch (error) {
    console.error('Error creating API key:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create API key'
    }
  }
}

/**
 * Deactivate an API key
 */
export async function deactivateAPIKey(keyId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await apiKeysDB.deactivate(keyId)
    return { success: true }
  } catch (error) {
    console.error('Error deactivating API key:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deactivate API key'
    }
  }
}

/**
 * Delete an API key permanently
 */
export async function deleteAPIKey(keyId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await apiKeysDB.delete(keyId)
    return { success: true }
  } catch (error) {
    console.error('Error deleting API key:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete API key'
    }
  }
}

/**
 * List all API keys (without the actual keys)
 */
export async function listAPIKeys(): Promise<{
  success: boolean
  keys?: any[]
  error?: string
}> {
  try {
    const keys = await apiKeysDB.getAll()

    // Remove sensitive data from response
    const sanitizedKeys = keys.map(key => ({
      id: key.id,
      key_id: key.key_id,
      name: key.name,
      description: key.description,
      is_active: key.is_active,
      created_at: key.created_at,
      updated_at: key.updated_at,
      last_used_at: key.last_used_at,
      usage_count: key.usage_count
    }))

    return {
      success: true,
      keys: sanitizedKeys
    }
  } catch (error) {
    console.error('Error listing API keys:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list API keys'
    }
  }
}

/**
 * Extract API key from request headers
 * Supports both 'Authorization: Bearer <key>' and 'X-API-Key: <key>' formats
 */
export function extractAPIKeyFromHeaders(headers: Headers): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7) // Remove 'Bearer ' prefix
  }

  // Check X-API-Key header
  const apiKeyHeader = headers.get('x-api-key')
  if (apiKeyHeader) {
    return apiKeyHeader
  }

  return null
}

/**
 * Generate a secure random string for various purposes
 */
export function generateSecureString(length: number = 32): string {
  return crypto.lib.WordArray.random(length / 2).toString(crypto.enc.Hex)
}

/**
 * Hash sensitive data for storage
 */
export function hashSensitiveData(data: string): string {
  return crypto.SHA256(data).toString(crypto.enc.Hex)
}

/**
 * API Key statistics and usage analytics
 */
export async function getAPIKeyStats(): Promise<{
  total: number
  active: number
  inactive: number
  totalUsage: number
  topUsed: any[]
}> {
  try {
    const keys = await apiKeysDB.getAll()

    const stats = {
      total: keys.length,
      active: keys.filter(k => k.is_active).length,
      inactive: keys.filter(k => !k.is_active).length,
      totalUsage: keys.reduce((sum, k) => sum + k.usage_count, 0),
      topUsed: keys
        .sort((a, b) => b.usage_count - a.usage_count)
        .slice(0, 5)
        .map(k => ({
          name: k.name,
          usage_count: k.usage_count,
          last_used_at: k.last_used_at
        }))
    }

    return stats
  } catch (error) {
    console.error('Error getting API key stats:', error)
    return {
      total: 0,
      active: 0,
      inactive: 0,
      totalUsage: 0,
      topUsed: []
    }
  }
}

/**
 * Check if an API key is rate limited
 * Basic rate limiting implementation (can be enhanced with Redis)
 */
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(keyId: string, requestsPerMinute: number = 60): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const resetTime = Math.ceil(now / 60000) * 60000 // Next minute boundary

  const existing = rateLimitCache.get(keyId)

  if (!existing || existing.resetTime <= now) {
    // First request or reset period passed
    rateLimitCache.set(keyId, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: requestsPerMinute - 1,
      resetTime
    }
  }

  if (existing.count >= requestsPerMinute) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime
    }
  }

  // Increment counter
  existing.count++
  rateLimitCache.set(keyId, existing)

  return {
    allowed: true,
    remaining: requestsPerMinute - existing.count,
    resetTime: existing.resetTime
  }
}

// Clean up rate limit cache periodically
setInterval(() => {
  const now = Date.now()
  for (const [keyId, data] of rateLimitCache.entries()) {
    if (data.resetTime <= now) {
      rateLimitCache.delete(keyId)
    }
  }
}, 60000) // Clean every minute