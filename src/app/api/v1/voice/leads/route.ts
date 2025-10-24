import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Get additional metadata
    const metadata = {
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer'),
      timestamp: new Date().toISOString(),
    }

    // TODO: Save to database (for now, we'll log it)
    console.log('New lead captured:', {
      ...validatedData,
      metadata,
    })

    // TODO: Send to CRM via webhook (n8n/Make/Zapier)
    await sendToCRM(validatedData, metadata)

    // TODO: Send notification email to team
    await sendNotification(validatedData)

    // Generate lead ID (in production, this would come from database)
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully',
      leadId,
      data: {
        name: validatedData.name,
        email: validatedData.email,
        intent: validatedData.intent,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Lead capture error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 })
  }
}

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
async function sendNotification(leadData: LeadData) {
  // In production, this would send notification to your team
  // via email, Slack, or other notification system

  const notification = {
    subject: `New ${leadData.intent} request from ${leadData.name}`,
    message: `
      New lead captured:
      - Name: ${leadData.name}
      - Email: ${leadData.email}
      - Company: ${leadData.company || 'Not provided'}
      - Intent: ${leadData.intent}
      - Message: ${leadData.message || 'No message'}
    `,
    priority: leadData.intent === 'consultation' ? 'high' : 'normal',
  }

  // TODO: Replace with actual notification system
  console.log('Notification prepared:', notification)
}