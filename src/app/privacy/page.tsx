import Link from 'next/link'
import { Button } from '@/components/common/button'
import { PageLayout } from '@/components/layout/page-layout'

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-secondary-600 mb-4">
              How we collect, use, and protect your information
            </p>
            <p className="text-sm text-secondary-500">
              Last updated: October 24, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>1. Information We Collect</h2>

            <h3>Personal Information</h3>
            <p>
              We collect information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Fill out contact forms or request consultations</li>
              <li>Subscribe to our newsletter or communications</li>
              <li>Participate in surveys or provide feedback</li>
              <li>Communicate with us via email, phone, or chat</li>
            </ul>

            <p>This may include:</p>
            <ul>
              <li>Name and contact information (email, phone, company)</li>
              <li>Business information (company size, industry, role)</li>
              <li>Communication preferences</li>
              <li>Any other information you choose to share</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain information about your device and usage patterns:
            </p>
            <ul>
              <li>IP address and browser type</li>
              <li>Pages visited and time spent on site</li>
              <li>Referral sources and search terms used</li>
              <li>Device and screen information</li>
            </ul>

            <h2>2. How We Use Your Information</h2>

            <p>We use the information we collect to:</p>
            <ul>
              <li><strong>Provide Services:</strong> Respond to inquiries, schedule consultations, and deliver our AI automation services</li>
              <li><strong>Communication:</strong> Send you updates, newsletters, and relevant business information (with your consent)</li>
              <li><strong>Improve Our Services:</strong> Analyze website usage and user feedback to enhance our offerings</li>
              <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights and interests</li>
            </ul>

            <h2>3. Information Sharing</h2>

            <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:</p>

            <h3>Service Providers</h3>
            <p>
              We may share information with trusted third-party service providers who assist us in:
            </p>
            <ul>
              <li>Website hosting and maintenance</li>
              <li>Email communication and marketing automation</li>
              <li>Analytics and performance monitoring</li>
              <li>Customer relationship management (CRM)</li>
            </ul>

            <p>These providers are contractually obligated to keep your information confidential and secure.</p>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose your information when required by law or to:
            </p>
            <ul>
              <li>Comply with legal processes or government requests</li>
              <li>Protect our rights and property</li>
              <li>Ensure the safety and security of our users</li>
            </ul>

            <h2>4. Data Security</h2>

            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul>
              <li>SSL encryption for data transmission</li>
              <li>Secure hosting with reputable providers</li>
              <li>Regular security updates and monitoring</li>
              <li>Limited access on a need-to-know basis</li>
            </ul>

            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>

            <h2>5. Your Rights and Choices</h2>

            <p>You have the following rights regarding your personal information:</p>

            <h3>Access and Updates</h3>
            <ul>
              <li>Request access to the personal information we hold about you</li>
              <li>Update or correct inaccurate information</li>
              <li>Request deletion of your personal information (subject to legal obligations)</li>
            </ul>

            <h3>Communication Preferences</h3>
            <ul>
              <li>Opt-out of marketing communications at any time</li>
              <li>Update your communication preferences</li>
              <li>Unsubscribe from newsletters using the link provided in emails</li>
            </ul>

            <h3>Cookies and Tracking</h3>
            <p>
              You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
            </p>

            <h2>6. Cookies and Tracking Technologies</h2>

            <p>Our website uses cookies and similar tracking technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Improve website performance and user experience</li>
              <li>Provide relevant content and advertisements</li>
            </ul>

            <h3>Types of Cookies We Use:</h3>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness</li>
            </ul>

            <h2>7. Third-Party Services</h2>

            <p>Our website may integrate with third-party services that have their own privacy policies:</p>
            <ul>
              <li><strong>Analytics:</strong> Google Analytics, Plausible Analytics</li>
              <li><strong>Communication:</strong> Email service providers, chat widgets</li>
              <li><strong>Social Media:</strong> Social media plugins and widgets</li>
              <li><strong>Voice Services:</strong> Retell.ai for AI voice interactions</li>
            </ul>

            <p>We encourage you to review the privacy policies of these third-party services.</p>

            <h2>8. International Data Transfers</h2>

            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.
            </p>

            <h2>9. Data Retention</h2>

            <p>
              We retain your personal information only as long as necessary to:
            </p>
            <ul>
              <li>Provide the services you requested</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our services through legitimate business interests</li>
            </ul>

            <p>
              When personal information is no longer needed, we securely delete or anonymize it.
            </p>

            <h2>10. Children's Privacy</h2>

            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>

            <h2>11. Changes to This Privacy Policy</h2>

            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make changes, we will:
            </p>
            <ul>
              <li>Update the "Last updated" date at the top of this policy</li>
              <li>Notify you of significant changes via email or website notice</li>
              <li>Post the updated policy on our website</li>
            </ul>

            <h2>12. Contact Us</h2>

            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="bg-secondary-50 p-6 rounded-lg not-prose">
              <p className="mb-2"><strong>Synura AI Solutions</strong></p>
              <p className="mb-2">Email: <a href="mailto:privacy@synura.ai" className="text-primary-600 hover:text-primary-800">privacy@synura.ai</a></p>
              <p className="mb-2">General: <a href="mailto:sales@synura.ai" className="text-primary-600 hover:text-primary-800">sales@synura.ai</a></p>
              <p className="mb-4">For urgent privacy matters, please include "Privacy" in your email subject line.</p>

              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>

            <hr className="my-8" />

            <p className="text-sm text-secondary-600">
              This Privacy Policy is effective as of October 24, 2025, and governs the privacy of those who use our website and services. By using our website, you consent to the collection and use of information as outlined in this policy.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export const metadata = {
  title: 'Privacy Policy | Synura AI Solutions',
  description: 'Learn how Synura AI Solutions collects, uses, and protects your personal information. Our privacy policy outlines your rights and our data security practices.',
  keywords: ['privacy policy', 'data protection', 'personal information', 'data security', 'privacy rights'],
}