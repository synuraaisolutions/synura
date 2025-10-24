import Link from 'next/link'
import { Button } from '@/components/common/button'
import { PageLayout } from '@/components/layout/page-layout'

export default function TermsOfServicePage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-secondary-600 mb-4">
              Our terms and conditions for using our services
            </p>
            <p className="text-sm text-secondary-500">
              Last updated: October 24, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>1. Acceptance of Terms</h2>

            <p>
              By accessing and using the Synura AI Solutions website and services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>

            <p>
              These Terms constitute a legally binding agreement between you ("Client," "User," or "you") and Synura AI Solutions ("Synura," "we," "us," or "our").
            </p>

            <h2>2. Description of Services</h2>

            <p>Synura AI Solutions provides:</p>
            <ul>
              <li><strong>AI Workforce Solutions:</strong> Custom AI agents and digital employees for business automation</li>
              <li><strong>Automation & Integration:</strong> Business process automation and system integration services</li>
              <li><strong>AI Consulting & Strategy:</strong> Strategic consulting for AI implementation and digital transformation</li>
              <li><strong>Managed AI Operations:</strong> Ongoing management and optimization of AI systems</li>
            </ul>

            <p>
              Our services are designed to help businesses improve efficiency, reduce costs, and automate routine tasks through intelligent AI-driven solutions.
            </p>

            <h2>3. Service Agreement and Engagement</h2>

            <h3>Consultation Process</h3>
            <ul>
              <li>Initial consultations are provided free of charge</li>
              <li>Detailed proposals and project scopes will be provided in writing</li>
              <li>Services begin only after written agreement and payment terms are established</li>
            </ul>

            <h3>Project Scope</h3>
            <ul>
              <li>All services are subject to a detailed Statement of Work (SOW)</li>
              <li>Changes to project scope must be agreed upon in writing</li>
              <li>Additional work outside the original scope may incur additional charges</li>
            </ul>

            <h2>4. Client Responsibilities</h2>

            <p>To ensure successful service delivery, clients agree to:</p>

            <h3>Information Provision</h3>
            <ul>
              <li>Provide accurate and complete information about business processes</li>
              <li>Grant necessary access to systems and data required for implementation</li>
              <li>Designate key personnel for project collaboration</li>
              <li>Respond to requests for information in a timely manner</li>
            </ul>

            <h3>System Access and Security</h3>
            <ul>
              <li>Maintain appropriate security measures for systems and data</li>
              <li>Ensure authorized personnel have necessary permissions</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Backup critical data before any system modifications</li>
            </ul>

            <h2>5. Payment Terms</h2>

            <h3>Pricing and Fees</h3>
            <ul>
              <li>All fees are as specified in the relevant SOW or service agreement</li>
              <li>Prices are subject to change with 30 days written notice</li>
              <li>Payment terms are typically net 30 days unless otherwise specified</li>
              <li>Late payments may incur interest charges of 1.5% per month</li>
            </ul>

            <h3>Refunds and Cancellations</h3>
            <ul>
              <li>Refund policies are specific to each service type and outlined in the SOW</li>
              <li>Cancellations must be provided in writing with appropriate notice period</li>
              <li>Work completed prior to cancellation is non-refundable</li>
              <li>Recurring services can be cancelled with 30 days written notice</li>
            </ul>

            <h2>6. Intellectual Property</h2>

            <h3>Our Intellectual Property</h3>
            <ul>
              <li>All methodologies, frameworks, and proprietary tools remain our property</li>
              <li>Generic AI solutions and templates remain our intellectual property</li>
              <li>Our brand, trademarks, and copyrighted materials are protected</li>
            </ul>

            <h3>Client Intellectual Property</h3>
            <ul>
              <li>Clients retain ownership of their business data and proprietary information</li>
              <li>Custom solutions developed specifically for clients become client property</li>
              <li>We may retain rights to use general methodologies learned during projects</li>
            </ul>

            <h3>Work Product</h3>
            <ul>
              <li>Deliverables are provided "as-is" upon completion and payment</li>
              <li>Source code and documentation become client property as specified in the SOW</li>
              <li>We retain the right to use anonymized case studies and general learnings</li>
            </ul>

            <h2>7. Confidentiality and Data Protection</h2>

            <h3>Confidential Information</h3>
            <p>
              We understand that clients may share sensitive business information. We commit to:
            </p>
            <ul>
              <li>Maintain strict confidentiality of all client information</li>
              <li>Use client data only for the purposes of providing agreed services</li>
              <li>Implement appropriate security measures to protect client data</li>
              <li>Not disclose client information to third parties without consent</li>
            </ul>

            <h3>Data Handling</h3>
            <ul>
              <li>Data processing complies with applicable privacy laws and regulations</li>
              <li>Client data is processed according to our Privacy Policy</li>
              <li>Data retention periods are specified in service agreements</li>
              <li>Secure data deletion procedures are followed upon project completion</li>
            </ul>

            <h2>8. Service Level Agreements and Warranties</h2>

            <h3>Performance Standards</h3>
            <ul>
              <li>We strive to deliver services meeting or exceeding agreed specifications</li>
              <li>Response times and performance metrics are specified in individual SOWs</li>
              <li>Regular progress updates and milestone reviews are provided</li>
            </ul>

            <h3>Warranties and Disclaimers</h3>
            <ul>
              <li>Services are provided using industry-standard practices and reasonable care</li>
              <li>No guarantee is made regarding specific business outcomes or ROI</li>
              <li>AI systems may have limitations and are subject to ongoing improvement</li>
              <li>We disclaim warranties beyond those explicitly stated in service agreements</li>
            </ul>

            <h2>9. Limitation of Liability</h2>

            <p>
              To the maximum extent permitted by law:
            </p>

            <h3>Damages Limitation</h3>
            <ul>
              <li>Our liability is limited to the total amount paid for the specific service</li>
              <li>We are not liable for indirect, consequential, or punitive damages</li>
              <li>Lost profits, revenue, or business opportunities are excluded from liability</li>
              <li>Liability limitations apply regardless of the theory of liability</li>
            </ul>

            <h3>Force Majeure</h3>
            <p>
              We are not liable for delays or failures due to circumstances beyond our reasonable control, including but not limited to natural disasters, government actions, internet outages, or third-party service failures.
            </p>

            <h2>10. Termination</h2>

            <h3>Termination Rights</h3>
            <ul>
              <li>Either party may terminate services with appropriate notice as specified in the SOW</li>
              <li>Immediate termination is permitted for material breach or non-payment</li>
              <li>Termination does not affect obligations incurred prior to termination</li>
            </ul>

            <h3>Effect of Termination</h3>
            <ul>
              <li>All unpaid fees become immediately due and payable</li>
              <li>Confidentiality obligations survive termination</li>
              <li>Client data will be returned or deleted as specified in the agreement</li>
              <li>Access to proprietary tools and systems will be revoked</li>
            </ul>

            <h2>11. Dispute Resolution</h2>

            <h3>Informal Resolution</h3>
            <p>
              We encourage resolving disputes through direct communication. Please contact us first to discuss any concerns or issues.
            </p>

            <h3>Formal Dispute Resolution</h3>
            <ul>
              <li>Disputes will be resolved through binding arbitration when possible</li>
              <li>Arbitration will be conducted in accordance with applicable commercial arbitration rules</li>
              <li>Legal proceedings, if necessary, will be conducted in our local jurisdiction</li>
            </ul>

            <h2>12. Governing Law</h2>

            <p>
              These Terms are governed by the laws of the jurisdiction where Synura AI Solutions is incorporated, without regard to conflict of law principles.
            </p>

            <h2>13. Changes to Terms</h2>

            <p>
              We reserve the right to modify these Terms at any time. When changes are made:
            </p>
            <ul>
              <li>Updated terms will be posted on our website</li>
              <li>The "Last updated" date will reflect the revision</li>
              <li>Significant changes will be communicated via email when possible</li>
              <li>Continued use of services constitutes acceptance of modified terms</li>
            </ul>

            <h2>14. General Provisions</h2>

            <h3>Entire Agreement</h3>
            <p>
              These Terms, together with any applicable SOW, constitute the entire agreement between the parties regarding the use of our services.
            </p>

            <h3>Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
            </p>

            <h3>Assignment</h3>
            <p>
              These Terms may not be assigned by the client without our written consent. We may assign our rights and obligations with reasonable notice.
            </p>

            <h2>15. Contact Information</h2>

            <p>
              For questions about these Terms of Service or our services, please contact us:
            </p>

            <div className="bg-secondary-50 p-6 rounded-lg not-prose">
              <p className="mb-2"><strong>Synura AI Solutions</strong></p>
              <p className="mb-2">Email: <a href="mailto:legal@synura.ai" className="text-primary-600 hover:text-primary-800">legal@synura.ai</a></p>
              <p className="mb-2">General: <a href="mailto:sales@synura.ai" className="text-primary-600 hover:text-primary-800">sales@synura.ai</a></p>
              <p className="mb-4">For legal or contract matters, please include "Legal" in your email subject line.</p>

              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/privacy">Privacy Policy</Link>
                </Button>
              </div>
            </div>

            <hr className="my-8" />

            <p className="text-sm text-secondary-600">
              These Terms of Service are effective as of October 24, 2025. By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export const metadata = {
  title: 'Terms of Service | Synura AI Solutions',
  description: 'Read the terms and conditions for using Synura AI Solutions services, including our AI automation, consulting, and managed operations offerings.',
  keywords: ['terms of service', 'service agreement', 'AI automation terms', 'legal terms', 'service conditions'],
}