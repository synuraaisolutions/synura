import { NextRequest, NextResponse } from 'next/server'
import { validateAPIKey, extractAPIKeyFromHeaders, checkRateLimit } from '../auth'

/**
 * Authentication Middleware for API Routes
 * Validates API keys, handles rate limiting, and provides request authentication
 */

export interface AuthContext {
  isAuthenticated: boolean
  apiKeyId?: string
  keyData?: any
  rateLimitRemaining?: number
  rateLimitResetTime?: number
}

export interface AuthMiddlewareOptions {
  required?: boolean // Whether authentication is required
  rateLimit?: number // Requests per minute (default: 60)
  skipPaths?: string[] // Paths to skip authentication
}

/**
 * Create authentication middleware for API routes
 */
export function createAuthMiddleware(options: AuthMiddlewareOptions = {}) {
  const {
    required = true,
    rateLimit = 60,
    skipPaths = []
  } = options

  return async function authMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, authContext: AuthContext) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      const pathname = new URL(request.url).pathname

      // Check if path should skip authentication
      if (skipPaths.some(path => pathname.includes(path))) {
        return handler(request, { isAuthenticated: false })
      }

      // Extract API key from headers
      const apiKey = extractAPIKeyFromHeaders(request.headers)

      if (!apiKey) {
        if (required) {
          return NextResponse.json({
            success: false,
            error: 'API key required',
            message: 'Please provide a valid API key in the Authorization header or X-API-Key header'
          }, { status: 401 })
        }

        return handler(request, { isAuthenticated: false })
      }

      // Validate API key
      const validation = await validateAPIKey(apiKey)

      if (!validation.isValid) {
        return NextResponse.json({
          success: false,
          error: 'Invalid API key',
          message: 'The provided API key is invalid or has been deactivated'
        }, { status: 401 })
      }

      // Check rate limiting
      const rateLimitResult = checkRateLimit(validation.keyId!, rateLimit)

      if (!rateLimitResult.allowed) {
        return NextResponse.json({
          success: false,
          error: 'Rate limit exceeded',
          message: `Rate limit of ${rateLimit} requests per minute exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`
        }, {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        })
      }

      // Create auth context
      const authContext: AuthContext = {
        isAuthenticated: true,
        apiKeyId: validation.keyId,
        keyData: validation.keyData,
        rateLimitRemaining: rateLimitResult.remaining,
        rateLimitResetTime: rateLimitResult.resetTime
      }

      // Call the handler with auth context
      const response = await handler(request, authContext)

      // Add rate limit headers to response
      response.headers.set('X-RateLimit-Limit', rateLimit.toString())
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())

      return response

    } catch (error) {
      console.error('Auth middleware error:', error)

      return NextResponse.json({
        success: false,
        error: 'Authentication error',
        message: 'An error occurred during authentication'
      }, { status: 500 })
    }
  }
}

/**
 * Simple authentication decorator for API routes
 * Use this to wrap your API route handlers
 */
export function withAuth(
  handler: (request: NextRequest, authContext: AuthContext) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  const middleware = createAuthMiddleware(options)

  return async function(request: NextRequest): Promise<NextResponse> {
    return middleware(request, handler)
  }
}

/**
 * Optional authentication decorator
 * API key is validated if present, but not required
 */
export function withOptionalAuth(
  handler: (request: NextRequest, authContext: AuthContext) => Promise<NextResponse>
) {
  return withAuth(handler, { required: false })
}

/**
 * High rate limit authentication for internal/admin endpoints
 */
export function withAdminAuth(
  handler: (request: NextRequest, authContext: AuthContext) => Promise<NextResponse>
) {
  return withAuth(handler, { required: true, rateLimit: 300 }) // 300 requests per minute for admin
}

/**
 * Public endpoints with rate limiting but no auth required
 */
export function withPublicRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  rateLimit: number = 100
) {
  return async function(request: NextRequest): Promise<NextResponse> {
    try {
      // Use IP address for rate limiting on public endpoints
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      const rateLimitResult = checkRateLimit(ip, rateLimit)

      if (!rateLimitResult.allowed) {
        return NextResponse.json({
          success: false,
          error: 'Rate limit exceeded',
          message: `Rate limit of ${rateLimit} requests per minute exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`
        }, {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        })
      }

      const response = await handler(request)

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', rateLimit.toString())
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())

      return response

    } catch (error) {
      console.error('Public rate limit middleware error:', error)

      return NextResponse.json({
        success: false,
        error: 'Rate limiting error',
        message: 'An error occurred during rate limiting'
      }, { status: 500 })
    }
  }
}

/**
 * Extract request metadata for logging
 */
export function getRequestMetadata(request: NextRequest, authContext?: AuthContext) {
  return {
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || null,
    apiKeyId: authContext?.apiKeyId || null,
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString()
  }
}

/**
 * CORS headers for API responses
 */
export function addCORSHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
  response.headers.set('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset')
  return response
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function handleCORS(): NextResponse {
  const response = new NextResponse(null, { status: 200 })
  return addCORSHeaders(response)
}