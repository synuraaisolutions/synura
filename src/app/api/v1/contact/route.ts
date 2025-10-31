import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { kitIntegration } from '@/lib/kit-integration'
import { sendLeadNotification } from '@/lib/email'

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20, 'Phone number too long').optional(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+', '']).optional(),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
})

type ContactData = z.infer<typeof contactSchema>

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Generate contact ID for tracking
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    console.log('Processing contact form submission:', {
      contactId,
      email: validatedData.email,
      name: validatedData.name,
      phone: validatedData.phone,
      companySize: validatedData.companySize
    })

    // Process lead in Kit CRM
    const kitResult = await processContactInKit(validatedData, contactId)

    // Send email notification to sales team
    const emailResult = await sendContactNotification(validatedData, contactId)

    const response = NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      contactId,
      kitIntegration: kitResult,
      emailNotification: emailResult
    })

    return addCORSHeaders(response)

  } catch (error) {
    console.error('Contact form submission error:', error)

    let errorResponse
    if (error instanceof z.ZodError) {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Invalid form data',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    } else {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Failed to submit contact form',
      }, { status: 500 })
    }

    return addCORSHeaders(errorResponse)
  }
}

/**
 * Process contact form submission in Kit CRM
 */
async function processContactInKit(data: ContactData, contactId: string): Promise<boolean> {
  try {
    const kitLeadData = {
      email: data.email,
      name: data.name,
      companySize: data.companySize || undefined,
      message: data.message,
      leadSource: 'contact-form' as const
    }

    const result = await kitIntegration.processContactLead(kitLeadData)

    if (result) {
      console.log('Contact form lead added to Kit CRM successfully')
      return true
    } else {
      console.log('Failed to add contact form lead to Kit CRM (not critical)')
      return false
    }
  } catch (error) {
    console.error('Kit CRM integration error for contact form (not critical):', error)
    return false
  }
}

/**
 * Send email notification to sales team
 */
async function sendContactNotification(data: ContactData, contactId: string): Promise<boolean> {
  try {
    const leadData = {
      leadId: contactId,
      name: data.name,
      email: data.email,
      company: data.companySize ? `${data.companySize} employees` : undefined,
      phone: data.phone || undefined,
      message: data.message,
      intent: 'consultation' as const,
      utmSource: 'contact-form',
      source: 'contact-form',
      status: 'new' as const,
      timestamp: new Date().toISOString()
    }

    const result = await sendLeadNotification(leadData, 'form')

    if (result) {
      console.log('Contact form notification email sent successfully')
      return true
    } else {
      console.log('Failed to send contact form notification email')
      return false
    }
  } catch (error) {
    console.error('Failed to send contact form notification email:', error)
    return false
  }
}