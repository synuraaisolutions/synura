import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withOptionalAuth, AuthContext, addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics } from '@/lib/analytics'

// Validation schema for meeting booking
const meetingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  preferredDate: z.string().optional(), // ISO date string
  preferredTime: z.string().optional(), // Time preference (morning, afternoon, evening)
  timezone: z.string().default('UTC'),
  meetingType: z.enum(['consultation', 'demo', 'strategy', 'technical']).default('consultation'),
  duration: z.enum(['30', '45', '60']).default('30'), // minutes
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  source: z.enum(['website', 'retell', 'form', 'referral']).default('website'),
  leadId: z.string().optional(), // Reference to existing lead
})

type MeetingData = z.infer<typeof meetingSchema>

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// Main POST handler with authentication and analytics
const postMeetingsHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = meetingSchema.parse(body)

    // Generate meeting ID using a consistent pattern
    const meetingId = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get additional metadata
    const metadata = {
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer'),
      timestamp: new Date().toISOString(),
      meetingId,
      apiKeyId: authContext.apiKeyId,
    }

    // Integrate with calendar system (Calendly, Acuity, etc.)
    const calendarResult = await scheduleCalendarMeeting(validatedData, meetingId)

    // Log meeting booking (could be expanded to dedicated meetings table in future)
    console.log('New meeting booking:', {
      meetingId,
      ...validatedData,
      metadata,
      calendarResult,
    })

    // Send confirmation email
    await sendConfirmationEmail(validatedData, meetingId)

    // Send to CRM
    await updateCRMWithMeeting(validatedData, meetingId)

    // Send team notification
    await notifyTeam(validatedData, meetingId)

    const responseData = {
      success: true,
      message: 'Meeting booked successfully',
      meetingId,
      data: {
        name: validatedData.name,
        email: validatedData.email,
        meetingType: validatedData.meetingType,
        duration: `${validatedData.duration} minutes`,
        status: 'pending_confirmation',
        nextSteps: 'You will receive a calendar invitation shortly.',
      },
    }

    const response = NextResponse.json(responseData, { status: 201 })

    // Log API request analytics
    await Analytics.logAPI(request, response, startTime, authContext)

    return addCORSHeaders(response)

  } catch (error) {
    console.error('Meeting booking error:', error)

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
        message: 'Failed to book meeting. Please try again or contact us directly.',
      }, { status: 500 })
    }

    // Log API request even for errors
    await Analytics.logAPI(request, errorResponse, startTime, authContext)

    return addCORSHeaders(errorResponse)
  }
}

// Export with optional authentication
export const POST = withOptionalAuth(postMeetingsHandler)

// Simulate calendar integration
async function scheduleCalendarMeeting(meetingData: MeetingData, meetingId: string) {
  // In production, this would integrate with:
  // - Calendly API
  // - Acuity Scheduling API
  // - Google Calendar API
  // - Microsoft Graph API (Outlook)

  const calendarEvent = {
    summary: `${meetingData.meetingType} - ${meetingData.name}`,
    description: `
      Meeting Type: ${meetingData.meetingType}
      Duration: ${meetingData.duration} minutes
      Company: ${meetingData.company || 'Not provided'}
      Phone: ${meetingData.phone || 'Not provided'}
      Description: ${meetingData.description || 'No additional details'}
      Meeting ID: ${meetingId}
    `,
    attendees: [
      { email: meetingData.email, name: meetingData.name },
      { email: 'sales@synura.ai', name: 'Synura Team' },
    ],
    preferredDate: meetingData.preferredDate,
    preferredTime: meetingData.preferredTime,
    timezone: meetingData.timezone,
    duration: parseInt(meetingData.duration),
  }

  // TODO: Replace with actual calendar API integration
  console.log('Calendar event prepared:', calendarEvent)

  return {
    status: 'scheduled',
    calendarUrl: `https://calendly.com/synura/consultation?meeting_id=${meetingId}`,
    eventId: `cal_${meetingId}`,
  }
}

// Simulate confirmation email
async function sendConfirmationEmail(meetingData: MeetingData, meetingId: string) {
  const emailContent = {
    to: meetingData.email,
    subject: 'Meeting Confirmation - Synura AI Solutions',
    template: 'meeting-confirmation',
    data: {
      name: meetingData.name,
      meetingType: meetingData.meetingType,
      duration: meetingData.duration,
      meetingId,
      nextSteps: [
        'You will receive a calendar invitation within 24 hours',
        'We will send a preparation guide to help you get the most from our consultation',
        'If you need to reschedule, please contact us at sales@synura.ai',
      ],
    },
  }

  // TODO: Replace with actual email service (SendGrid, Mailgun, etc.)
  console.log('Confirmation email prepared:', emailContent)
}

// Simulate CRM update
async function updateCRMWithMeeting(meetingData: MeetingData, meetingId: string) {
  const crmUpdate = {
    leadId: meetingData.leadId,
    activity: {
      type: 'meeting_scheduled',
      meetingId,
      meetingType: meetingData.meetingType,
      duration: meetingData.duration,
      urgency: meetingData.urgency,
      scheduledDate: meetingData.preferredDate,
      status: 'scheduled',
    },
    contact: {
      email: meetingData.email,
      lastInteraction: new Date().toISOString(),
      stage: 'consultation_scheduled',
    },
  }

  // TODO: Replace with actual CRM webhook
  console.log('CRM update prepared:', crmUpdate)
}

// Simulate team notification
async function notifyTeam(meetingData: MeetingData, meetingId: string) {
  const notification = {
    channel: 'sales',
    message: `New ${meetingData.meetingType} scheduled with ${meetingData.name} (${meetingData.company || 'No company'})`,
    details: {
      meetingId,
      email: meetingData.email,
      phone: meetingData.phone,
      duration: `${meetingData.duration} minutes`,
      urgency: meetingData.urgency,
      description: meetingData.description,
    },
    priority: meetingData.urgency === 'high' ? 'urgent' : 'normal',
  }

  // TODO: Replace with actual notification system (Slack, Teams, etc.)
  console.log('Team notification prepared:', notification)
}