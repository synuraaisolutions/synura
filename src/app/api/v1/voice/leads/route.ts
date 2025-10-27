import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withOptionalAuth, AuthContext, addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics } from '@/lib/analytics'

// Validation schema for lead capture
const leadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  intent: z.enum(['consultation', 'demo', 'info', 'pricing', 'partnership']).default('consultation'),
  message: z.string().optional(),
  source: z.enum(['website', 'retell', 'form', 'referral']).default('website'),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
})

type LeadData = z.infer<typeof leadSchema>

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// Main POST handler with authentication and analytics
const postLeadsHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Generate lead ID using analytics system
    const leadId = Analytics.generateLeadId()

    // Log lead capture to database and analytics
    await Analytics.logLead({
      leadId,
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company,
      phone: validatedData.phone,
      intent: validatedData.intent,
      message: validatedData.message,
      source: validatedData.source,
      utmSource: validatedData.utm_source,
      utmCampaign: validatedData.utm_campaign,
      utmMedium: validatedData.utm_medium,
      utmContent: undefined,
      utmTerm: undefined,
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || undefined,
      apiKeyId: authContext.apiKeyId,
      status: 'new'
    }, request, authContext)

    // Get additional metadata for CRM
    const metadata = {
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer'),
      timestamp: new Date().toISOString(),
      leadId,
    }

    // Send to CRM via webhook (n8n/Make/Zapier)
    await sendToCRM(validatedData, metadata)

    // Send notification email to team
    await sendNotification(validatedData, leadId)

    const responseData = {
      success: true,
      message: 'Lead captured successfully',
      leadId,
      data: {
        name: validatedData.name,
        email: validatedData.email,
        intent: validatedData.intent,
      },
    }

    const response = NextResponse.json(responseData, { status: 201 })

    // Log API request analytics
    await Analytics.logAPI(request, response, startTime, authContext)

    return addCORSHeaders(response)

  } catch (error) {
    console.error('Lead capture error:', error)

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
        message: 'Internal server error',
      }, { status: 500 })
    }

    // Log API request even for errors
    await Analytics.logAPI(request, errorResponse, startTime, authContext)

    return addCORSHeaders(errorResponse)
  }
}

// Export with optional authentication
export const POST = withOptionalAuth(postLeadsHandler)

// Simulate CRM integration
async function sendToCRM(leadData: LeadData, metadata: any) {
  // In production, this would send data to your CRM via webhook
  // Example: n8n workflow, Make.com scenario, or direct API call

  const crmPayload = {
    contact: {
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      phone: leadData.phone,
      source: leadData.source,
      intent: leadData.intent,
      message: leadData.message,
      utm_source: leadData.utm_source,
      utm_campaign: leadData.utm_campaign,
      utm_medium: leadData.utm_medium,
    },
    metadata,
  }

  // TODO: Replace with actual CRM webhook URL
  // const webhookUrl = process.env.CRM_WEBHOOK_URL
  // if (webhookUrl) {
  //   await fetch(webhookUrl, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(crmPayload),
  //   })
  // }

  console.log('CRM payload prepared:', crmPayload)
}

// Simulate notification system
async function sendNotification(leadData: LeadData, leadId: string) {
  // In production, this would send notification to your team
  // via email, Slack, or other notification system

  const notification = {
    subject: `New ${leadData.intent} request from ${leadData.name}`,
    message: `
      New lead captured (ID: ${leadId}):
      - Name: ${leadData.name}
      - Email: ${leadData.email}
      - Company: ${leadData.company || 'Not provided'}
      - Intent: ${leadData.intent}
      - Message: ${leadData.message || 'No message'}
      - Source: ${leadData.source}
    `,
    priority: leadData.intent === 'consultation' ? 'high' : 'normal',
  }

  // TODO: Replace with actual notification system
  console.log('Notification prepared:', notification)
}