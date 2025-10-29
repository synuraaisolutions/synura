import nodemailer from 'nodemailer'
import { ROICalculationLog, LeadCaptureLog } from './analytics'

/**
 * Email Service for Synura AI Solutions
 * Handles automated email notifications and customer communications
 */

// Email configuration interface
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Email template types
interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

// Create email transporter
function createTransporter(): nodemailer.Transporter {
  const config: EmailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_FROM || 'sales@synura.ai',
      pass: process.env.EMAIL_APP_PASSWORD || ''
    }
  }

  return nodemailer.createTransport(config)
}

/**
 * Send ROI calculation results to visitor
 */
export async function sendROIResults(
  calculationData: ROICalculationLog,
  estimates: any
): Promise<boolean> {
  if (!calculationData.email) {
    console.log('No email provided for ROI results')
    return false
  }

  try {
    const transporter = createTransporter()

    const emailTemplate = generateROIResultsEmail(calculationData, estimates)

    const mailOptions = {
      from: `"Synura AI Solutions" <${process.env.EMAIL_FROM || 'sales@synura.ai'}>`,
      to: calculationData.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('ROI results email sent successfully:', result.messageId)
    return true

  } catch (error) {
    console.error('Failed to send ROI results email:', error)
    return false
  }
}

/**
 * Send lead notification to team
 */
export async function sendLeadNotification(
  leadData: LeadCaptureLog,
  source: 'form' | 'roi_calculator' | 'voice_agent' = 'form'
): Promise<boolean> {
  try {
    const transporter = createTransporter()

    const emailTemplate = generateLeadNotificationEmail(leadData, source)

    const mailOptions = {
      from: `"Synura Notifications" <${process.env.EMAIL_FROM || 'sales@synura.ai'}>`,
      to: process.env.EMAIL_TO_TEAM || 'sales@synura.ai',
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Lead notification sent successfully:', result.messageId)
    return true

  } catch (error) {
    console.error('Failed to send lead notification:', error)
    return false
  }
}

/**
 * Send contact form confirmation to visitor
 */
export async function sendContactConfirmation(
  leadData: LeadCaptureLog
): Promise<boolean> {
  if (!leadData.email) {
    console.log('No email provided for contact confirmation')
    return false
  }

  try {
    const transporter = createTransporter()

    const emailTemplate = generateContactConfirmationEmail(leadData)

    const mailOptions = {
      from: `"Synura AI Solutions" <${process.env.EMAIL_FROM || 'sales@synura.ai'}>`,
      to: leadData.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Contact confirmation sent successfully:', result.messageId)
    return true

  } catch (error) {
    console.error('Failed to send contact confirmation:', error)
    return false
  }
}

/**
 * Generate ROI results email template
 */
function generateROIResultsEmail(
  calculationData: ROICalculationLog,
  estimates: any
): EmailTemplate {
  const savings = estimates.costSavings?.annual || 0
  const roi = estimates.roi?.percentage || 0
  const payback = estimates.roi?.paybackPeriod || 'N/A'

  const subject = `Your AI Automation ROI: $${savings.toLocaleString()} Annual Savings Potential`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .results { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .metric { display: inline-block; margin: 10px 20px 10px 0; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #059669; }
            .metric-label { font-size: 12px; color: #6b7280; }
            .cta { background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0;">Your AI Automation ROI Results</h1>
                <p style="margin: 10px 0 0 0;">Synura AI Solutions</p>
            </div>

            <div class="content">
                <p>Hi ${calculationData.name || 'there'},</p>

                <p>Thank you for using our ROI calculator! Based on your ${calculationData.companySize} company in ${calculationData.industry}, here are your personalized automation savings:</p>

                <div class="results">
                    <div class="metric">
                        <div class="metric-value">$${savings.toLocaleString()}</div>
                        <div class="metric-label">Annual Savings</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${roi}%</div>
                        <div class="metric-label">First Year ROI</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${payback}</div>
                        <div class="metric-label">Payback Period</div>
                    </div>
                </div>

                <p><strong>What this means for your business:</strong></p>
                <ul>
                    <li>Potential to save <strong>${estimates.timeSavings?.hoursPerWeek || 0} hours per week</strong></li>
                    <li>Reduce manual errors and improve accuracy</li>
                    <li>Free up your team for strategic work</li>
                    <li>Scale operations without proportional staff increases</li>
                </ul>

                <p>These are conservative estimates based on industry averages. Many of our clients see even higher returns.</p>

                <p style="text-align: center;">
                    <a href="https://calendly.com/synuraaisolutions/30min" class="cta">Schedule Free Consultation</a>
                </p>

                <p>During your free consultation, we'll:</p>
                <ul>
                    <li>Analyze your specific processes in detail</li>
                    <li>Provide a customized automation roadmap</li>
                    <li>Show you exactly how other similar companies achieved these results</li>
                </ul>

                <p>Best regards,<br>
                The Synura AI Team<br>
                <a href="mailto:sales@synura.ai">sales@synura.ai</a><br>
                <a href="https://synura.ai">synura.ai</a></p>
            </div>

            <div class="footer">
                <p>Synura AI Solutions • Smarter systems. Stronger businesses.</p>
                <p>You received this email because you calculated ROI on our website.</p>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
Your AI Automation ROI Results

Hi ${calculationData.name || 'there'},

Based on your ${calculationData.companySize} company in ${calculationData.industry}, here are your personalized automation savings:

- Annual Savings: $${savings.toLocaleString()}
- First Year ROI: ${roi}%
- Payback Period: ${payback}

These results show you could save ${estimates.timeSavings?.hoursPerWeek || 0} hours per week while reducing errors and improving efficiency.

Schedule your free consultation: https://calendly.com/synuraaisolutions/30min

Best regards,
The Synura AI Team
sales@synura.ai
synura.ai
  `

  return { to: calculationData.email!, subject, html, text }
}

/**
 * Generate lead notification email for team
 */
function generateLeadNotificationEmail(
  leadData: LeadCaptureLog,
  source: 'form' | 'roi_calculator' | 'voice_agent'
): EmailTemplate {
  const sourceLabels = {
    form: 'Contact Form',
    roi_calculator: 'ROI Calculator',
    voice_agent: 'Voice Agent'
  }

  const subject = `🚨 New ${leadData.intent} Lead from ${sourceLabels[source]}: ${leadData.name}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
            .details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .detail-row { margin: 8px 0; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #6b7280; }
            .high-priority { color: #dc2626; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="alert">
                <h2 style="margin: 0 0 10px 0;">🚨 New Lead Alert</h2>
                <p style="margin: 0;">A new ${leadData.intent} request has been submitted via ${sourceLabels[source]}</p>
            </div>

            <div class="details">
                <h3>Lead Details</h3>
                <div class="detail-row">
                    <span class="label">Name:</span>
                    <span class="value">${leadData.name}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">${leadData.email}</span>
                </div>
                ${leadData.company ? `
                <div class="detail-row">
                    <span class="label">Company:</span>
                    <span class="value">${leadData.company}</span>
                </div>
                ` : ''}
                ${leadData.phone ? `
                <div class="detail-row">
                    <span class="label">Phone:</span>
                    <span class="value">${leadData.phone}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Intent:</span>
                    <span class="value ${leadData.intent === 'consultation' ? 'high-priority' : ''}">${leadData.intent}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Source:</span>
                    <span class="value">${sourceLabels[source]}</span>
                </div>
                ${leadData.message ? `
                <div class="detail-row">
                    <span class="label">Message:</span><br>
                    <span class="value">"${leadData.message}"</span>
                </div>
                ` : ''}
            </div>

            <div class="details">
                <h3>Tracking Info</h3>
                <div class="detail-row">
                    <span class="label">Lead ID:</span>
                    <span class="value">${leadData.leadId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Timestamp:</span>
                    <span class="value">${new Date().toLocaleString()}</span>
                </div>
                ${leadData.utmSource ? `
                <div class="detail-row">
                    <span class="label">UTM Source:</span>
                    <span class="value">${leadData.utmSource}</span>
                </div>
                ` : ''}
            </div>

            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review lead details in CRM</li>
                <li>Respond within 2 hours for best conversion</li>
                <li>Prepare consultation materials if needed</li>
            </ul>
        </div>
    </body>
    </html>
  `

  const text = `
New ${leadData.intent} Lead from ${sourceLabels[source]}

Name: ${leadData.name}
Email: ${leadData.email}
Company: ${leadData.company || 'Not provided'}
Phone: ${leadData.phone || 'Not provided'}
Intent: ${leadData.intent}
Message: ${leadData.message || 'No message'}

Lead ID: ${leadData.leadId}
Timestamp: ${new Date().toLocaleString()}

Respond within 2 hours for best conversion rates.
  `

  return { to: '', subject, html, text }
}

/**
 * Generate contact confirmation email
 */
function generateContactConfirmationEmail(leadData: LeadCaptureLog): EmailTemplate {
  const subject = 'Thank you for contacting Synura AI Solutions'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .cta { background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0;">Thank You for Reaching Out</h1>
                <p style="margin: 10px 0 0 0;">Synura AI Solutions</p>
            </div>

            <div class="content">
                <p>Hi ${leadData.name},</p>

                <p>Thank you for your interest in AI automation! We've received your ${leadData.intent} request and will respond within 2 hours during business hours.</p>

                <p><strong>What happens next:</strong></p>
                <ul>
                    <li>Our team will review your inquiry</li>
                    <li>We'll respond with relevant information and next steps</li>
                    <li>If you requested a consultation, we'll send you a calendar link</li>
                </ul>

                <p>In the meantime, feel free to explore:</p>
                <ul>
                    <li><a href="https://synura.ai/case-studies">Client Success Stories</a></li>
                    <li><a href="https://synura.ai/roi-calculator">ROI Calculator</a></li>
                    <li><a href="https://synura.ai/faqs">Frequently Asked Questions</a></li>
                </ul>

                <p style="text-align: center;">
                    <a href="https://calendly.com/synuraaisolutions/30min" class="cta">Schedule Immediate Consultation</a>
                </p>

                <p>Questions? Reply to this email or call us at (778) 723-5969.</p>

                <p>Best regards,<br>
                The Synura AI Team<br>
                <a href="mailto:sales@synura.ai">sales@synura.ai</a><br>
                <a href="https://synura.ai">synura.ai</a></p>
            </div>

            <div class="footer">
                <p>Synura AI Solutions • Smarter systems. Stronger businesses.</p>
                <p>Our business hours: Monday-Friday 9:00 AM - 6:00 PM EST</p>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
Thank you for contacting Synura AI Solutions

Hi ${leadData.name},

Thank you for your interest in AI automation! We've received your ${leadData.intent} request and will respond within 2 hours during business hours.

What happens next:
- Our team will review your inquiry
- We'll respond with relevant information and next steps
- If you requested a consultation, we'll send you a calendar link

Schedule immediate consultation: https://calendly.com/synuraaisolutions/30min

Questions? Reply to this email or call us at (778) 723-5969.

Best regards,
The Synura AI Team
sales@synura.ai
synura.ai

Business hours: Monday-Friday 9:00 AM - 6:00 PM EST
  `

  return { to: leadData.email!, subject, html, text }
}

/**
 * Test email connection
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email connection verified successfully')
    return true
  } catch (error) {
    console.error('Email connection failed:', error)
    return false
  }
}

export { EmailTemplate, EmailConfig }