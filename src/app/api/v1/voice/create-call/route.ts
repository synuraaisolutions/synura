import { NextRequest, NextResponse } from 'next/server'
import { withOptionalAuth, AuthContext, addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics } from '@/lib/analytics'

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// Main POST handler with authentication and analytics
const postCreateCallHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()
  try {
    const { agentId } = await request.json()

    // Use agent ID from request or default to our configured one
    const retellAgentId = agentId || process.env.NEXT_PUBLIC_RETELL_AGENT_ID

    if (!retellAgentId) {
      return NextResponse.json(
        { error: 'No agent ID configured' },
        { status: 400 }
      )
    }

    if (!process.env.RETELL_API_KEY) {
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      )
    }

    // Call Retell API to create a web call
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: retellAgentId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Retell API error:', response.status, errorText)

      return NextResponse.json(
        { error: 'Failed to create call', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    const responseData = {
      access_token: data.access_token,
      call_id: data.call_id,
    }

    const apiResponse = NextResponse.json(responseData)

    // Log API request analytics
    await Analytics.logAPI(request, apiResponse, startTime, authContext)

    return addCORSHeaders(apiResponse)

  } catch (error) {
    console.error('Create call error:', error)

    const errorResponse = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )

    // Log API request even for errors
    await Analytics.logAPI(request, errorResponse, startTime, authContext)

    return addCORSHeaders(errorResponse)
  }
}

// Export with optional authentication
export const POST = withOptionalAuth(postCreateCallHandler)