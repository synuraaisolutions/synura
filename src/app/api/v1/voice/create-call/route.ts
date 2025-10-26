import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    return NextResponse.json({
      access_token: data.access_token,
      call_id: data.call_id,
    })

  } catch (error) {
    console.error('Create call error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}