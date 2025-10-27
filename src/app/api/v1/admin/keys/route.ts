import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth, AuthContext, addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics } from '@/lib/analytics'
import { createAPIKey, listAPIKeys, deactivateAPIKey, deleteAPIKey } from '@/lib/auth'

// Validation schemas
const createKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

const deleteKeySchema = z.object({
  keyId: z.string().min(1, 'Key ID is required'),
})

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// GET handler - List all API keys
const getKeysHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    const result = await listAPIKeys()

    if (!result.success) {
      const errorResponse = NextResponse.json({
        success: false,
        message: result.error || 'Failed to retrieve API keys',
      }, { status: 500 })

      await Analytics.logAPI(request, errorResponse, startTime, authContext)
      return addCORSHeaders(errorResponse)
    }

    const responseData = {
      success: true,
      data: result.keys,
      metadata: {
        total: result.keys?.length || 0,
        timestamp: new Date().toISOString(),
      },
    }

    const response = NextResponse.json(responseData)
    await Analytics.logAPI(request, response, startTime, authContext)
    return addCORSHeaders(response)

  } catch (error) {
    console.error('Error listing API keys:', error)

    const errorResponse = NextResponse.json({
      success: false,
      message: 'Failed to retrieve API keys',
    }, { status: 500 })

    await Analytics.logAPI(request, errorResponse, startTime, authContext)
    return addCORSHeaders(errorResponse)
  }
}

// POST handler - Create new API key
const postKeysHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const validatedData = createKeySchema.parse(body)

    const result = await createAPIKey(validatedData.name, validatedData.description)

    if (!result.success) {
      const errorResponse = NextResponse.json({
        success: false,
        message: result.error || 'Failed to create API key',
      }, { status: 500 })

      await Analytics.logAPI(request, errorResponse, startTime, authContext)
      return addCORSHeaders(errorResponse)
    }

    const responseData = {
      success: true,
      message: 'API key created successfully',
      data: {
        keyId: result.keyId,
        key: result.key, // This is the only time the key is shown
        name: validatedData.name,
        description: validatedData.description,
        created: new Date().toISOString(),
      },
      warning: 'This API key will only be shown once. Please save it securely.',
    }

    const response = NextResponse.json(responseData, { status: 201 })
    await Analytics.logAPI(request, response, startTime, authContext)
    return addCORSHeaders(response)

  } catch (error) {
    console.error('Error creating API key:', error)

    let errorResponse
    if (error instanceof z.ZodError) {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    } else {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Failed to create API key',
      }, { status: 500 })
    }

    await Analytics.logAPI(request, errorResponse, startTime, authContext)
    return addCORSHeaders(errorResponse)
  }
}

// DELETE handler - Deactivate or delete API key
const deleteKeysHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const validatedData = deleteKeySchema.parse(body)
    const { searchParams } = new URL(request.url)
    const permanent = searchParams.get('permanent') === 'true'

    let result
    if (permanent) {
      result = await deleteAPIKey(validatedData.keyId)
    } else {
      result = await deactivateAPIKey(validatedData.keyId)
    }

    if (!result.success) {
      const errorResponse = NextResponse.json({
        success: false,
        message: result.error || `Failed to ${permanent ? 'delete' : 'deactivate'} API key`,
      }, { status: 500 })

      await Analytics.logAPI(request, errorResponse, startTime, authContext)
      return addCORSHeaders(errorResponse)
    }

    const responseData = {
      success: true,
      message: `API key ${permanent ? 'deleted' : 'deactivated'} successfully`,
      data: {
        keyId: validatedData.keyId,
        action: permanent ? 'deleted' : 'deactivated',
        timestamp: new Date().toISOString(),
      },
    }

    const response = NextResponse.json(responseData)
    await Analytics.logAPI(request, response, startTime, authContext)
    return addCORSHeaders(response)

  } catch (error) {
    console.error('Error deleting/deactivating API key:', error)

    let errorResponse
    if (error instanceof z.ZodError) {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    } else {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Failed to process request',
      }, { status: 500 })
    }

    await Analytics.logAPI(request, errorResponse, startTime, authContext)
    return addCORSHeaders(errorResponse)
  }
}

// Export handlers with admin authentication
export const GET = withAdminAuth(getKeysHandler)
export const POST = withAdminAuth(postKeysHandler)
export const DELETE = withAdminAuth(deleteKeysHandler)