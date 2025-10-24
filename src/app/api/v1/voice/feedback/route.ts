import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for feedback
const feedbackSchema = z.object({
  name: z.string().max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  type: z.enum(['bug', 'feature', 'general', 'complaint', 'praise', 'suggestion']).default('general'),
  category: z.enum(['website', 'service', 'pricing', 'support', 'retell_agent', 'consultation']).default('website'),
  rating: z.number().min(1).max(5).optional(), // 1-5 star rating
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
  sessionId: z.string().optional(), // For Retell session tracking
  page: z.string().optional(), // Page where feedback was submitted
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  contactBack: z.boolean().default(true), // Whether user wants to be contacted
})

type FeedbackData = z.infer<typeof feedbackSchema>

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    // Get additional metadata
    const metadata = {
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer'),
      timestamp: new Date().toISOString(),
      page: validatedData.page || request.headers.get('referer') || 'unknown',
    }

    // Generate feedback ID
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // TODO: Save to database
    console.log('New feedback received:', {
      feedbackId,
      ...validatedData,
      metadata,
    })

    // Process feedback based on type and priority
    await processFeedback(validatedData, feedbackId, metadata)

    // Send acknowledgment email if contact info provided
    if (validatedData.email && validatedData.contactBack) {
      await sendAcknowledgmentEmail(validatedData, feedbackId)
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully',
      feedbackId,
      data: {
        type: validatedData.type,
        category: validatedData.category,
        priority: validatedData.priority,
        status: 'received',
        expectedResponse: getExpectedResponseTime(validatedData.priority),
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Feedback processing error:', error)

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
      message: 'Failed to process feedback. Please try again.',
    }, { status: 500 })
  }
}

// Process feedback based on type and priority
async function processFeedback(feedbackData: FeedbackData, feedbackId: string, metadata: any) {
  // Route feedback to appropriate team based on category
  const routingRules = {
    website: 'development',
    service: 'customer-success',
    pricing: 'sales',
    support: 'support',
    retell_agent: 'ai-team',
    consultation: 'sales',
  }

  const assignedTeam = routingRules[feedbackData.category] || 'general'

  // Determine priority escalation
  let escalationLevel = 'standard'
  if (feedbackData.priority === 'urgent' || feedbackData.type === 'complaint') {
    escalationLevel = 'immediate'
  } else if (feedbackData.priority === 'high' || feedbackData.rating && feedbackData.rating <= 2) {
    escalationLevel = 'priority'
  }

  const processedFeedback = {
    feedbackId,
    ...feedbackData,
    metadata,
    routing: {
      assignedTeam,
      escalationLevel,
      dueDate: calculateDueDate(feedbackData.priority),
    },
  }

  // Send to appropriate notification channel
  await notifyTeam(processedFeedback)

  // For urgent issues, create immediate alerts
  if (escalationLevel === 'immediate') {
    await createUrgentAlert(processedFeedback)
  }

  // For bugs, create development ticket
  if (feedbackData.type === 'bug') {
    await createBugTicket(processedFeedback)
  }

  // For feature requests, add to product roadmap consideration
  if (feedbackData.type === 'feature') {
    await addToRoadmapConsideration(processedFeedback)
  }

  console.log('Feedback processed:', processedFeedback)
}

// Send acknowledgment email
async function sendAcknowledgmentEmail(feedbackData: FeedbackData, feedbackId: string) {
  const emailContent = {
    to: feedbackData.email,
    subject: `Feedback Received - ${feedbackId}`,
    template: 'feedback-acknowledgment',
    data: {
      name: feedbackData.name || 'Valued User',
      feedbackId,
      type: feedbackData.type,
      category: feedbackData.category,
      expectedResponse: getExpectedResponseTime(feedbackData.priority),
      message: getFeedbackTypeMessage(feedbackData.type),
    },
  }

  // TODO: Replace with actual email service
  console.log('Acknowledgment email prepared:', emailContent)
}

// Notify appropriate team
async function notifyTeam(processedFeedback: any) {
  const notification = {
    channel: processedFeedback.routing.assignedTeam,
    title: `New ${processedFeedback.type} feedback: ${processedFeedback.subject}`,
    message: processedFeedback.message,
    metadata: {
      feedbackId: processedFeedback.feedbackId,
      category: processedFeedback.category,
      priority: processedFeedback.priority,
      rating: processedFeedback.rating,
      escalationLevel: processedFeedback.routing.escalationLevel,
      dueDate: processedFeedback.routing.dueDate,
      contactInfo: {
        name: processedFeedback.name,
        email: processedFeedback.email,
        contactBack: processedFeedback.contactBack,
      },
    },
  }

  // TODO: Replace with actual notification system (Slack, Teams, etc.)
  console.log('Team notification prepared:', notification)
}

// Create urgent alert for high-priority issues
async function createUrgentAlert(processedFeedback: any) {
  const alert = {
    type: 'urgent_feedback',
    title: `URGENT: ${processedFeedback.type} - ${processedFeedback.subject}`,
    description: processedFeedback.message,
    feedbackId: processedFeedback.feedbackId,
    contactInfo: {
      name: processedFeedback.name,
      email: processedFeedback.email,
    },
    escalationPath: [
      'Team Lead',
      'Department Manager',
      'Operations Director',
    ],
  }

  // TODO: Replace with actual alerting system
  console.log('Urgent alert created:', alert)
}

// Create bug ticket for development team
async function createBugTicket(processedFeedback: any) {
  const bugTicket = {
    title: `Bug Report: ${processedFeedback.subject}`,
    description: processedFeedback.message,
    priority: processedFeedback.priority,
    reporter: {
      name: processedFeedback.name,
      email: processedFeedback.email,
    },
    environment: {
      page: processedFeedback.page,
      userAgent: processedFeedback.metadata.userAgent,
      sessionId: processedFeedback.sessionId,
    },
    feedbackId: processedFeedback.feedbackId,
  }

  // TODO: Replace with actual issue tracking system (Jira, GitHub Issues, etc.)
  console.log('Bug ticket created:', bugTicket)
}

// Add feature request to roadmap consideration
async function addToRoadmapConsideration(processedFeedback: any) {
  const featureRequest = {
    title: processedFeedback.subject,
    description: processedFeedback.message,
    requestedBy: {
      name: processedFeedback.name,
      email: processedFeedback.email,
    },
    category: processedFeedback.category,
    feedbackId: processedFeedback.feedbackId,
    status: 'under_consideration',
  }

  // TODO: Replace with actual product management system
  console.log('Feature request added to roadmap consideration:', featureRequest)
}

// Helper functions
function getExpectedResponseTime(priority: string): string {
  switch (priority) {
    case 'urgent': return 'Within 2 hours'
    case 'high': return 'Within 24 hours'
    case 'medium': return 'Within 3 business days'
    case 'low': return 'Within 1 week'
    default: return 'Within 3 business days'
  }
}

function calculateDueDate(priority: string): string {
  const now = new Date()
  switch (priority) {
    case 'urgent':
      now.setHours(now.getHours() + 2)
      break
    case 'high':
      now.setDate(now.getDate() + 1)
      break
    case 'medium':
      now.setDate(now.getDate() + 3)
      break
    case 'low':
      now.setDate(now.getDate() + 7)
      break
  }
  return now.toISOString()
}

function getFeedbackTypeMessage(type: string): string {
  switch (type) {
    case 'bug': return 'Thank you for reporting this bug. Our development team will investigate and fix this issue.'
    case 'feature': return 'Thank you for your feature suggestion. We\'ll consider it for our product roadmap.'
    case 'complaint': return 'We apologize for any inconvenience. Our team will review your concerns and work to resolve them.'
    case 'praise': return 'Thank you for your kind words! We\'ll share your feedback with our team.'
    case 'suggestion': return 'Thank you for your suggestion. We value your input and will consider it for improvements.'
    default: return 'Thank you for your feedback. We appreciate you taking the time to share your thoughts.'
  }
}