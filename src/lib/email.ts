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
 * Send enhanced ROI calculator lead notification to sales team
 */
export async function sendROILeadNotification(
  calculationData: ROICalculationLog,
  estimates: any
): Promise<boolean> {
  try {
    const transporter = createTransporter()

    const emailTemplate = generateSalesTeamTemplate(calculationData, estimates)
    emailTemplate.to = process.env.EMAIL_TO_TEAM || 'sales@synura.ai'

    const mailOptions = {
      from: `"Synura Sales Intelligence" <${process.env.EMAIL_FROM || 'sales@synura.ai'}>`,
      to: emailTemplate.to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Enhanced ROI lead notification sent successfully:', result.messageId)
    return true

  } catch (error) {
    console.error('Failed to send enhanced ROI lead notification:', error)
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
 * Generate ROI results email template (main router function)
 */
function generateROIResultsEmail(
  calculationData: ROICalculationLog,
  estimates: any
): EmailTemplate {
  // Use the professional client template for visitor emails
  return generateClientROITemplate(calculationData, estimates)
}

/**
 * Generate professional client ROI email template with brand styling
 */
function generateClientROITemplate(
  calculationData: ROICalculationLog,
  estimates: any
): EmailTemplate {
  const savings = estimates.costSavings?.annual || 0
  const roi = estimates.roi?.sixMonthROI || estimates.roi?.percentage || 0
  const payback = estimates.roi?.paybackPeriod || 'N/A'
  const timeFrame = roi === estimates.roi?.sixMonthROI ? '6-month' : 'annual'
  const costRange = estimates.investment?.range || 'Contact for pricing'

  const subject = `🚀 ${savings ? `$${savings.toLocaleString()} Savings Potential` : 'Your Custom ROI Analysis'} - Synura AI`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0A2342; line-height: 1.6; background: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #0A2342, #18A4E0); color: white; padding: 40px 30px; text-align: center; }
            .logo { width: 120px; height: auto; margin-bottom: 15px; }
            .content { padding: 40px 30px; }
            .roi-card { background: linear-gradient(135deg, #A3FF12, #18A4E0); color: #0A2342; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
            .roi-value { font-size: 48px; font-weight: bold; margin-bottom: 5px; }
            .roi-label { font-size: 16px; font-weight: 600; opacity: 0.8; }
            .metrics { display: flex; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
            .metric { flex: 1; min-width: 150px; text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; }
            .metric-value { font-size: 28px; font-weight: bold; color: #18A4E0; margin-bottom: 5px; }
            .metric-label { font-size: 14px; color: #5A5A5A; }
            .opportunity { background: #f0f9ff; border-left: 4px solid #18A4E0; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
            .cta { background: #A3FF12; color: #0A2342; padding: 18px 35px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 25px 0; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
            .cta:hover { transform: translateY(-2px); }
            .benefits { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; }
            .footer { background: #0A2342; color: white; padding: 30px; text-align: center; }
            .footer a { color: #A3FF12; text-decoration: none; }
            .disclaimer { font-size: 12px; color: #5A5A5A; margin-top: 20px; }
            @media (max-width: 600px) {
                .metrics { flex-direction: column; }
                .metric { min-width: auto; }
                .roi-value { font-size: 36px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://synura.ai/images/synura-logo.svg" alt="Synura AI Solutions" class="logo">
                <h1 style="margin: 0; font-size: 28px;">Your Custom ROI Analysis</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Smarter systems. Stronger businesses.</p>
            </div>

            <div class="content">
                <p style="font-size: 18px; margin-bottom: 20px;">Hi ${calculationData.name || 'there'},</p>

                <p>Thank you for exploring automation with Synura! Based on your <strong>${calculationData.companySize}</strong> company in <strong>${calculationData.industry}</strong>, here's your personalized ROI analysis:</p>

                <div class="roi-card">
                    <div class="roi-value">${roi > 0 ? '+' : ''}${Math.round(roi)}%</div>
                    <div class="roi-label">${timeFrame === '6-month' ? '6-Month' : 'Annual'} ROI</div>
                </div>

                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">$${savings.toLocaleString()}</div>
                        <div class="metric-label">Annual Savings</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${estimates.timeSavings?.hoursPerWeek || 0}h</div>
                        <div class="metric-label">Hours Saved/Week</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">${payback}</div>
                        <div class="metric-label">Payback Period</div>
                    </div>
                </div>

                <div class="opportunity">
                    <h3 style="color: #18A4E0; margin-bottom: 10px;">💡 Beyond Direct Savings</h3>
                    <p>${estimates.possibleAdditionalValue?.description || 'Your team can focus on core business activities and growth initiatives'}</p>
                    ${estimates.possibleAdditionalValue?.opportunityValue ? `
                    <p style="margin-top: 10px;"><strong>Possible Additional Value:</strong> $${estimates.possibleAdditionalValue.opportunityValue.toLocaleString()}/year (${estimates.possibleAdditionalValue.percentageOfSavings} of direct savings)</p>
                    <p style="font-size: 14px; color: #6b7280; font-style: italic;">${estimates.possibleAdditionalValue.caveat}</p>
                    ` : `
                    <p style="margin-top: 10px;"><strong>Additional Value:</strong> Productivity gains, reduced errors, and scalability for future growth.</p>
                    `}
                </div>

                <div class="benefits">
                    <h3 style="margin-bottom: 15px;">🎯 What This Means for Your Business</h3>
                    <ul style="margin-left: 20px;">
                        <li>Save <strong>${estimates.timeSavings?.hoursPerWeek || 0} hours per week</strong> on manual tasks</li>
                        <li>Reduce errors by <strong>${estimates.qualityImprovements?.errorReduction || '40%'}</strong></li>
                        <li>Enable team focus on strategic, revenue-generating work</li>
                        <li>Build scalable operations for sustainable growth</li>
                    </ul>
                </div>

                <p><strong>Investment Range:</strong> ${costRange}</p>
                <p style="margin-top: 15px;">These are conservative estimates based on industry data and our client results. Many companies see returns of 2-4× within 6 months.</p>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="https://calendly.com/synuraaisolutions/30min" class="cta">🗓️ Schedule Free Strategy Session</a>
                </div>

                <p><strong>In your free 30-minute session, we'll:</strong></p>
                <ul style="margin: 15px 0 15px 20px;">
                    <li>Dive deeper into your specific automation opportunities</li>
                    <li>Show you case studies from similar companies</li>
                    <li>Provide a detailed implementation roadmap</li>
                    <li>Answer all your questions about costs and timeline</li>
                </ul>

                <div class="disclaimer">
                    <p><em>*Results shown are estimates based on industry benchmarks and typical automation implementations. Actual results may vary based on specific business processes and implementation scope. No guarantee of specific outcomes is implied.</em></p>
                </div>
            </div>

            <div class="footer">
                <p style="font-size: 18px; margin-bottom: 10px;">Ready to transform your business?</p>
                <p>The Synura AI Team</p>
                <p style="margin: 15px 0;">
                    <a href="mailto:sales@synura.ai">sales@synura.ai</a> •
                    <a href="https://synura.ai">synura.ai</a>
                </p>
                <p style="font-size: 12px; opacity: 0.8;">You received this because you calculated ROI on our website.</p>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
🚀 Your Custom ROI Analysis - Synura AI

Hi ${calculationData.name || 'there'},

Based on your ${calculationData.companySize} company in ${calculationData.industry}:

ROI: ${roi > 0 ? '+' : ''}${Math.round(roi)}% (${timeFrame === '6-month' ? '6-month' : 'annual'})
Annual Savings: $${savings.toLocaleString()}
Hours Saved: ${estimates.timeSavings?.hoursPerWeek || 0} hours/week
Payback: ${payback}

Investment Range: ${costRange}

Beyond direct savings${estimates.possibleAdditionalValue?.opportunityValue ? `, there's possible additional value of $${estimates.possibleAdditionalValue.opportunityValue.toLocaleString()}/year (${estimates.possibleAdditionalValue.percentageOfSavings} of direct savings) when your team uses freed time for higher-value work` : ', your team can focus on strategic work while automation handles routine tasks'}.

Schedule your free strategy session: https://calendly.com/synuraaisolutions/30min

Best regards,
The Synura AI Team
sales@synura.ai | synura.ai
  `

  return { to: calculationData.email!, subject, html, text }
}

/**
 * Generate detailed sales team notification with internal metrics
 */
function generateSalesTeamTemplate(
  calculationData: ROICalculationLog,
  estimates: any
): EmailTemplate {
  const roi = estimates.roi?.sixMonthROI || estimates.roi?.percentage || 0
  const tier = estimates.internal?.tier || 'unknown'
  const totalValue = estimates.valueBreakdown?.totalAnnualValue || 0
  const setupCost = estimates.investment?.setup || 0

  const priority = roi > 200 ? '🔥 HIGH' : roi > 100 ? '🟡 MEDIUM' : '🟢 LOW'

  const subject = `${priority} PRIORITY ROI Lead: ${calculationData.companySize} ${calculationData.industry} - ${Math.round(roi)}% ROI`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .priority-${priority.includes('HIGH') ? 'high' : priority.includes('MEDIUM') ? 'medium' : 'low'} {
                background: ${priority.includes('HIGH') ? '#fee2e2' : priority.includes('MEDIUM') ? '#fef3c7' : '#f0f9ff'};
                border: 2px solid ${priority.includes('HIGH') ? '#dc2626' : priority.includes('MEDIUM') ? '#f59e0b' : '#3b82f6'};
                padding: 20px; border-radius: 8px; margin-bottom: 20px;
            }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .metric-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #0A2342; }
            .metric-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
            .details { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .internal { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; }
            .value-breakdown { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .next-steps { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="priority-${priority.includes('HIGH') ? 'high' : priority.includes('MEDIUM') ? 'medium' : 'low'}">
                <h1 style="margin: 0; color: #0A2342;">${priority} PRIORITY ROI Calculator Lead</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;"><strong>${calculationData.name || 'Anonymous'}</strong> from ${calculationData.companySize} ${calculationData.industry} company</p>
            </div>

            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${Math.round(roi)}%</div>
                    <div class="metric-label">6-Month ROI</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">$${totalValue.toLocaleString()}</div>
                    <div class="metric-label">Total Annual Value</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">$${setupCost.toLocaleString()}</div>
                    <div class="metric-label">Setup Investment</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${estimates.internal?.profitMargin || 60}%</div>
                    <div class="metric-label">Profit Margin</div>
                </div>
            </div>

            <div class="details">
                <h3>👤 Contact Information</h3>
                <p><strong>Name:</strong> ${calculationData.name || 'Not provided'}</p>
                <p><strong>Email:</strong> ${calculationData.email}</p>
                <p><strong>Company:</strong> ${calculationData.companySize} employees in ${calculationData.industry}</p>
                <p><strong>Calculation ID:</strong> ${calculationData.calculationId}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div class="value-breakdown">
                <h3>💰 Value Breakdown</h3>
                <p><strong>Direct Savings:</strong> $${estimates.valueBreakdown?.directSavings?.toLocaleString() || 0}/year</p>
                <p><strong>Error Reduction:</strong> $${estimates.valueBreakdown?.errorReduction?.toLocaleString() || 0}/year</p>
                ${estimates.possibleAdditionalValue?.opportunityValue ? `
                <p><strong>Possible Additional Value:</strong> $${estimates.possibleAdditionalValue.opportunityValue.toLocaleString()}/year (${estimates.possibleAdditionalValue.percentageOfSavings} of direct savings)</p>
                <p style="font-size: 12px; color: #6b7280; font-style: italic;">Note: ${estimates.possibleAdditionalValue.caveat}</p>
                ` : ''}
                <p><strong>Total Annual Value:</strong> $${estimates.valueBreakdown?.totalAnnualValue?.toLocaleString() || 0}/year</p>
            </div>

            <div class="internal">
                <h3>🎯 Internal Metrics (Sales Use Only)</h3>
                <p><strong>Complexity Tier:</strong> ${tier.toUpperCase()} (Score: ${estimates.internal?.complexityScore || 'N/A'})</p>
                <p><strong>Workflow Count:</strong> ${estimates.internal?.workflowCount || 0} automation areas</p>
                <p><strong>Automation Areas:</strong> ${calculationData.automationAreas?.join(', ') || 'Not specified'}</p>
                <p><strong>Primary Goal:</strong> ${calculationData.primaryGoal || 'Not specified'}</p>
                <p><strong>Suggested Pricing Range:</strong> ${estimates.investment?.range || 'Custom quote needed'}</p>
            </div>

            <div class="next-steps">
                <h3>⚡ Recommended Next Steps</h3>
                <ul>
                    <li><strong>Response Time:</strong> Contact within 2 hours for best conversion</li>
                    <li><strong>Talking Points:</strong> Focus on ${roi > 200 ? 'exceptional ROI and quick wins' : roi > 100 ? 'solid returns and process optimization' : 'efficiency gains and cost control'}</li>
                    <li><strong>Discovery Questions:</strong> Current pain points, team size affected, decision timeline</li>
                    <li><strong>Proposal Prep:</strong> Prepare ${tier} complexity examples and case studies</li>
                    ${roi > 200 ? '<li><strong>Urgency:</strong> High-value lead - prioritize immediate follow-up</li>' : ''}
                </ul>
            </div>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>CRM Action Required:</strong> Add lead with ${priority.includes('HIGH') ? 'high' : priority.includes('MEDIUM') ? 'medium' : 'standard'} priority tag</p>
                <p><strong>Follow-up Template:</strong> Use "${tier}-complexity-roi-${roi > 200 ? 'high' : roi > 100 ? 'medium' : 'standard'}" email sequence</p>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
${priority} PRIORITY ROI Calculator Lead

Contact: ${calculationData.name || 'Anonymous'} (${calculationData.email})
Company: ${calculationData.companySize} ${calculationData.industry}

Key Metrics:
- ROI: ${Math.round(roi)}% (6-month)
- Total Value: $${totalValue.toLocaleString()}/year
- Setup Cost: $${setupCost.toLocaleString()}
- Profit Margin: ${estimates.internal?.profitMargin || 60}%
- Complexity: ${tier.toUpperCase()}

Value Breakdown:
- Direct Savings: $${estimates.valueBreakdown?.directSavings?.toLocaleString() || 0}
- Error Reduction: $${estimates.valueBreakdown?.errorReduction?.toLocaleString() || 0}
${estimates.possibleAdditionalValue?.opportunityValue ? `- Possible Additional Value: $${estimates.possibleAdditionalValue.opportunityValue.toLocaleString()} (${estimates.possibleAdditionalValue.percentageOfSavings} of direct savings)` : ''}
- Total Annual Value: $${estimates.valueBreakdown?.totalAnnualValue?.toLocaleString() || 0}

Next Steps:
- Contact within 2 hours
- Focus on ${roi > 200 ? 'exceptional ROI' : roi > 100 ? 'solid returns' : 'efficiency gains'}
- Prepare ${tier} complexity examples
- Add to CRM with ${priority.includes('HIGH') ? 'high' : 'standard'} priority

Calculation ID: ${calculationData.calculationId}
Timestamp: ${new Date().toLocaleString()}
  `

  return { to: '', subject, html, text }
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

export type { EmailTemplate, EmailConfig }