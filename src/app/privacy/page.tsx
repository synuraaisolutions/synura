import Link from 'next/link'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card'
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
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Information Collection */}
            <Card className="border-primary-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">📋</span>
                  1. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Personal Information</h3>
                  <p className="text-secondary-700 mb-4">
                    We collect information that you voluntarily provide to us when you:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-secondary-600">
                    <li className="flex items-center"><span className="text-accent-500 mr-2">✓</span>Fill out contact forms or request consultations</li>
                    <li className="flex items-center"><span className="text-accent-500 mr-2">✓</span>Subscribe to our newsletter or communications</li>
                    <li className="flex items-center"><span className="text-accent-500 mr-2">✓</span>Participate in surveys or provide feedback</li>
                    <li className="flex items-center"><span className="text-accent-500 mr-2">✓</span>Communicate with us via email, phone, or chat</li>
                  </ul>

                  <div className="mt-6 pt-4 border-t border-primary-200">
                    <h4 className="font-semibold text-secondary-900 mb-3">This may include:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-secondary-600">
                      <li className="flex items-center"><span className="text-primary-500 mr-2">→</span>Name and contact information (email, phone, company)</li>
                      <li className="flex items-center"><span className="text-primary-500 mr-2">→</span>Business information (company size, industry, role)</li>
                      <li className="flex items-center"><span className="text-primary-500 mr-2">→</span>Communication preferences</li>
                      <li className="flex items-center"><span className="text-primary-500 mr-2">→</span>Any other information you choose to share</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-secondary-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Automatically Collected Information</h3>
                  <p className="text-secondary-700 mb-4">
                    When you visit our website, we may automatically collect certain information about your device and usage patterns:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-secondary-600">
                    <li className="flex items-center"><span className="text-accent-500 mr-2">⚙️</span>IP address and browser type</li>
                    <li className="flex items-center"><span className="text-accent-500 mr-2">⚙️</span>Pages visited and time spent on site</li>
                    <li className="flex items-center"><span className="text-accent-500 mr-2">⚙️</span>Referral sources and search terms used</li>
                    <li className="flex items-center"><span className="text-accent-500 mr-2">⚙️</span>Device and screen information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="border-accent-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  2. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 mb-6">We use the information we collect to:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-accent-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-accent-800 mb-2">🛠️ Provide Services</h4>
                    <p className="text-sm text-accent-700">Respond to inquiries, schedule consultations, and deliver our AI automation services</p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-800 mb-2">📢 Communication</h4>
                    <p className="text-sm text-primary-700">Send you updates, newsletters, and relevant business information (with your consent)</p>
                  </div>
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-secondary-800 mb-2">📈 Improve Our Services</h4>
                    <p className="text-sm text-secondary-700">Analyze website usage and user feedback to enhance our offerings</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">⚖️ Legal Compliance</h4>
                    <p className="text-sm text-orange-700">Meet legal obligations and protect our rights and interests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">🔒</span>
                  3. Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <p className="text-orange-800 font-medium">
                    We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🤝</span>Service Providers
                    </h3>
                    <p className="text-secondary-700 mb-4">
                      We may share information with trusted third-party service providers who assist us in:
                    </p>
                    <ul className="space-y-2 text-secondary-600">
                      <li className="flex items-center"><span className="text-accent-500 mr-2">•</span>Website hosting and maintenance</li>
                      <li className="flex items-center"><span className="text-accent-500 mr-2">•</span>Email communication and marketing automation</li>
                      <li className="flex items-center"><span className="text-accent-500 mr-2">•</span>Analytics and performance monitoring</li>
                      <li className="flex items-center"><span className="text-accent-500 mr-2">•</span>Customer relationship management (CRM)</li>
                    </ul>
                    <p className="text-sm text-secondary-600 mt-4 italic">
                      These providers are contractually obligated to keep your information confidential and secure.
                    </p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">⚖️</span>Legal Requirements
                    </h3>
                    <p className="text-secondary-700 mb-4">
                      We may disclose your information when required by law or to:
                    </p>
                    <ul className="space-y-2 text-secondary-600">
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Comply with legal processes or government requests</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Protect our rights and property</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Ensure the safety and security of our users</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">🛡️</span>
                  4. Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-secondary-700">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg flex items-center">
                    <span className="text-2xl mr-3">🔐</span>
                    <span className="text-green-800">SSL encryption for data transmission</span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg flex items-center">
                    <span className="text-2xl mr-3">🏢</span>
                    <span className="text-green-800">Secure hosting with reputable providers</span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg flex items-center">
                    <span className="text-2xl mr-3">🔄</span>
                    <span className="text-green-800">Regular security updates and monitoring</span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    <span className="text-green-800">Limited access on a need-to-know basis</span>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-yellow-800 text-sm">
                    <strong>Please note:</strong> No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights and Choices */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">⚡</span>
                  5. Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-secondary-700">You have the following rights regarding your personal information:</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🔍</span>Access & Updates
                    </h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li className="flex items-start"><span className="text-blue-500 mr-2 mt-1">•</span>Request access to your personal information</li>
                      <li className="flex items-start"><span className="text-blue-500 mr-2 mt-1">•</span>Update or correct inaccurate information</li>
                      <li className="flex items-start"><span className="text-blue-500 mr-2 mt-1">•</span>Request deletion (subject to legal obligations)</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">📧</span>Communication
                    </h3>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li className="flex items-start"><span className="text-purple-500 mr-2 mt-1">•</span>Opt-out of marketing communications</li>
                      <li className="flex items-start"><span className="text-purple-500 mr-2 mt-1">•</span>Update your preferences</li>
                      <li className="flex items-start"><span className="text-purple-500 mr-2 mt-1">•</span>Unsubscribe from newsletters</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🍪</span>Cookies & Tracking
                    </h3>
                    <p className="text-indigo-800 text-sm">
                      You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Sections in Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Cookies Section */}
              <Card className="border-purple-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">🍪</span>
                    6. Cookies & Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-secondary-700 text-sm">Our website uses cookies and similar tracking technologies to:</p>
                  <ul className="space-y-1 text-secondary-600 text-sm">
                    <li className="flex items-center"><span className="text-purple-500 mr-2">•</span>Remember your preferences and settings</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">•</span>Analyze website traffic and user behavior</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">•</span>Improve website performance</li>
                    <li className="flex items-center"><span className="text-purple-500 mr-2">•</span>Provide relevant content</li>
                  </ul>

                  <div className="bg-purple-50 p-3 rounded">
                    <h4 className="font-semibold text-purple-900 text-sm mb-2">Types of Cookies:</h4>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li><strong>Essential:</strong> Required for basic functionality</li>
                      <li><strong>Analytics:</strong> Help us understand site usage</li>
                      <li><strong>Marketing:</strong> For relevant advertisements</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Third-Party Services */}
              <Card className="border-cyan-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">🔗</span>
                    7. Third-Party Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-secondary-700 text-sm">Our website may integrate with third-party services:</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-cyan-50 p-3 rounded">
                      <div className="flex items-center mb-1">
                        <span className="text-sm mr-2">📊</span>
                        <strong className="text-cyan-900 text-sm">Analytics:</strong>
                      </div>
                      <p className="text-cyan-800 text-xs">Google Analytics, Plausible Analytics</p>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded">
                      <div className="flex items-center mb-1">
                        <span className="text-sm mr-2">📱</span>
                        <strong className="text-cyan-900 text-sm">Communication:</strong>
                      </div>
                      <p className="text-cyan-800 text-xs">Email service providers, chat widgets</p>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded">
                      <div className="flex items-center mb-1">
                        <span className="text-sm mr-2">🎤</span>
                        <strong className="text-cyan-900 text-sm">Voice Services:</strong>
                      </div>
                      <p className="text-cyan-800 text-xs">Retell.ai for AI voice interactions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Retention */}
              <Card className="border-teal-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">⏰</span>
                    9. Data Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-700 text-sm mb-3">We retain your personal information only as long as necessary to:</p>
                  <ul className="space-y-1 text-secondary-600 text-sm">
                    <li className="flex items-center"><span className="text-teal-500 mr-2">•</span>Provide the services you requested</li>
                    <li className="flex items-center"><span className="text-teal-500 mr-2">•</span>Comply with legal obligations</li>
                    <li className="flex items-center"><span className="text-teal-500 mr-2">•</span>Resolve disputes and enforce agreements</li>
                    <li className="flex items-center"><span className="text-teal-500 mr-2">•</span>Improve our services</li>
                  </ul>
                  <div className="bg-teal-50 p-3 rounded mt-3">
                    <p className="text-teal-800 text-xs">
                      When personal information is no longer needed, we securely delete or anonymize it.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* International Data Transfers */}
              <Card className="border-indigo-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">🌍</span>
                    8. International Transfers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-indigo-50 p-4 rounded">
                    <p className="text-indigo-800 text-sm">
                      Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Bottom Important Sections */}
            <div className="grid grid-cols-1 gap-6">

              {/* Children's Privacy */}
              <Card className="border-pink-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">👶</span>
                    10. Children's Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-pink-50 p-4 rounded">
                    <p className="text-pink-800 text-sm">
                      Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Policy Changes */}
              <Card className="border-yellow-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">🔄</span>
                    11. Changes to This Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-700 text-sm mb-4">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make changes, we will:
                  </p>
                  <ul className="space-y-2 text-secondary-600 text-sm">
                    <li className="flex items-center"><span className="text-yellow-500 mr-2">•</span>Update the "Last updated" date at the top of this policy</li>
                    <li className="flex items-center"><span className="text-yellow-500 mr-2">•</span>Notify you of significant changes via email or website notice</li>
                    <li className="flex items-center"><span className="text-yellow-500 mr-2">•</span>Post the updated policy on our website</li>
                  </ul>
                </CardContent>
              </Card>

            </div>

            {/* Contact Section */}
            <Card className="border-primary-300 bg-gradient-to-br from-primary-50 to-primary-100">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">📞</span>
                  12. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 mb-6">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-secondary-900 mb-4">Synura AI Solutions</p>
                      <div className="space-y-2">
                        <p className="text-sm text-secondary-700">
                          <strong>Privacy Email:</strong>
                          <a href="mailto:privacy@synura.ai" className="text-primary-600 hover:text-primary-800 ml-1">
                            privacy@synura.ai
                          </a>
                        </p>
                        <p className="text-sm text-secondary-700">
                          <strong>General:</strong>
                          <a href="mailto:sales@synura.ai" className="text-primary-600 hover:text-primary-800 ml-1">
                            sales@synura.ai
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm text-secondary-600 mb-4">
                        For urgent privacy matters, please include "Privacy" in your email subject line.
                      </p>
                      <Button variant="outline" asChild className="w-fit">
                        <Link href="/contact">Contact Us</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="border-t border-secondary-200 pt-6">
              <p className="text-sm text-secondary-600 text-center">
                This Privacy Policy is effective as of October 24, 2025, and governs the privacy of those who use our website and services. By using our website, you consent to the collection and use of information as outlined in this policy.
              </p>
            </div>

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