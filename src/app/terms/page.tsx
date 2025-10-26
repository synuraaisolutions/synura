import Link from 'next/link'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card'
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
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Acceptance of Terms */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">📋</span>
                  1. Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                  <p className="text-blue-900 font-medium mb-4">
                    By accessing and using the Synura AI Solutions website and services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
                  </p>
                  <p className="text-blue-800 text-sm">
                    These Terms constitute a legally binding agreement between you ("Client," "User," or "you") and Synura AI Solutions ("Synura," "we," "us," or "our").
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Description of Services */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">🚀</span>
                  2. Description of Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-secondary-700">Synura AI Solutions provides:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <span className="text-xl mr-2">🤖</span>AI Workforce Solutions
                    </h4>
                    <p className="text-sm text-green-800">Custom AI agents and digital employees for business automation</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <span className="text-xl mr-2">🔄</span>Automation & Integration
                    </h4>
                    <p className="text-sm text-green-800">Business process automation and system integration services</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <span className="text-xl mr-2">🎯</span>AI Consulting & Strategy
                    </h4>
                    <p className="text-sm text-green-800">Strategic consulting for AI implementation and digital transformation</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <span className="text-xl mr-2">⚙️</span>Managed AI Operations
                    </h4>
                    <p className="text-sm text-green-800">Ongoing management and optimization of AI systems</p>
                  </div>
                </div>

                <div className="bg-green-25 p-4 rounded-lg">
                  <p className="text-green-800 text-sm">
                    Our services are designed to help businesses improve efficiency, reduce costs, and automate routine tasks through intelligent AI-driven solutions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Agreement */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">🤝</span>
                  3. Service Agreement and Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">💬</span>Consultation Process
                    </h3>
                    <ul className="space-y-2 text-purple-800 text-sm">
                      <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span>Initial consultations are provided free of charge</li>
                      <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span>Detailed proposals and project scopes will be provided in writing</li>
                      <li className="flex items-center"><span className="text-purple-500 mr-2">✓</span>Services begin only after written agreement and payment terms are established</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">📝</span>Project Scope
                    </h3>
                    <ul className="space-y-2 text-indigo-800 text-sm">
                      <li className="flex items-center"><span className="text-indigo-500 mr-2">•</span>All services are subject to a detailed Statement of Work (SOW)</li>
                      <li className="flex items-center"><span className="text-indigo-500 mr-2">•</span>Changes to project scope must be agreed upon in writing</li>
                      <li className="flex items-center"><span className="text-indigo-500 mr-2">•</span>Additional work outside the original scope may incur additional charges</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Responsibilities */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">👥</span>
                  4. Client Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-secondary-700">To ensure successful service delivery, clients agree to:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">📊</span>Information Provision
                    </h3>
                    <ul className="space-y-2 text-orange-800 text-sm">
                      <li className="flex items-center"><span className="text-orange-500 mr-2">•</span>Provide accurate and complete information about business processes</li>
                      <li className="flex items-center"><span className="text-orange-500 mr-2">•</span>Grant necessary access to systems and data required for implementation</li>
                      <li className="flex items-center"><span className="text-orange-500 mr-2">•</span>Designate key personnel for project collaboration</li>
                      <li className="flex items-center"><span className="text-orange-500 mr-2">•</span>Respond to requests for information in a timely manner</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🔐</span>System Access & Security
                    </h3>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Maintain appropriate security measures for systems and data</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Ensure authorized personnel have necessary permissions</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Comply with all applicable laws and regulations</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Backup critical data before any system modifications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">💰</span>
                  5. Payment Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">💵</span>Pricing and Fees
                    </h3>
                    <ul className="space-y-2 text-emerald-800 text-sm">
                      <li className="flex items-center"><span className="text-emerald-500 mr-2">•</span>All fees are as specified in the relevant SOW or service agreement</li>
                      <li className="flex items-center"><span className="text-emerald-500 mr-2">•</span>Prices are subject to change with 30 days written notice</li>
                      <li className="flex items-center"><span className="text-emerald-500 mr-2">•</span>Payment terms are typically net 30 days unless otherwise specified</li>
                      <li className="flex items-center"><span className="text-emerald-500 mr-2">•</span>Late payments may incur interest charges of 1.5% per month</li>
                    </ul>
                  </div>

                  <div className="bg-cyan-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🔄</span>Refunds & Cancellations
                    </h3>
                    <ul className="space-y-2 text-cyan-800 text-sm">
                      <li className="flex items-center"><span className="text-cyan-500 mr-2">•</span>Refund policies are specific to each service type and outlined in the SOW</li>
                      <li className="flex items-center"><span className="text-cyan-500 mr-2">•</span>Cancellations must be provided in writing with appropriate notice period</li>
                      <li className="flex items-center"><span className="text-cyan-500 mr-2">•</span>Work completed prior to cancellation is non-refundable</li>
                      <li className="flex items-center"><span className="text-cyan-500 mr-2">•</span>Recurring services can be cancelled with 30 days written notice</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="border-violet-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">💡</span>
                  6. Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🏢</span>Our IP
                    </h3>
                    <ul className="space-y-2 text-violet-800 text-xs">
                      <li className="flex items-start"><span className="text-violet-500 mr-2 mt-1">•</span>All methodologies, frameworks, and proprietary tools remain our property</li>
                      <li className="flex items-start"><span className="text-violet-500 mr-2 mt-1">•</span>Generic AI solutions and templates remain our intellectual property</li>
                      <li className="flex items-start"><span className="text-violet-500 mr-2 mt-1">•</span>Our brand, trademarks, and copyrighted materials are protected</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">👤</span>Client IP
                    </h3>
                    <ul className="space-y-2 text-blue-800 text-xs">
                      <li className="flex items-start"><span className="text-blue-500 mr-2 mt-1">•</span>Clients retain ownership of their business data and proprietary information</li>
                      <li className="flex items-start"><span className="text-blue-500 mr-2 mt-1">•</span>Custom solutions developed specifically for clients become client property</li>
                      <li className="flex items-start"><span className="text-blue-500 mr-2 mt-1">•</span>We may retain rights to use general methodologies learned during projects</li>
                    </ul>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">📦</span>Work Product
                    </h3>
                    <ul className="space-y-2 text-teal-800 text-xs">
                      <li className="flex items-start"><span className="text-teal-500 mr-2 mt-1">•</span>Deliverables are provided "as-is" upon completion and payment</li>
                      <li className="flex items-start"><span className="text-teal-500 mr-2 mt-1">•</span>Source code and documentation become client property as specified in the SOW</li>
                      <li className="flex items-start"><span className="text-teal-500 mr-2 mt-1">•</span>We retain the right to use anonymized case studies and general learnings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confidentiality and Data Protection */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">🔒</span>
                  7. Confidentiality and Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🤐</span>Confidential Information
                    </h3>
                    <p className="text-red-800 text-sm mb-4">
                      We understand that clients may share sensitive business information. We commit to:
                    </p>
                    <ul className="space-y-2 text-red-800 text-sm">
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Maintain strict confidentiality of all client information</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Use client data only for the purposes of providing agreed services</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Implement appropriate security measures to protect client data</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Not disclose client information to third parties without consent</li>
                    </ul>
                  </div>

                  <div className="bg-pink-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center">
                      <span className="text-xl mr-2">🗂️</span>Data Handling
                    </h3>
                    <ul className="space-y-2 text-pink-800 text-sm">
                      <li className="flex items-center"><span className="text-pink-500 mr-2">•</span>Data processing complies with applicable privacy laws and regulations</li>
                      <li className="flex items-center"><span className="text-pink-500 mr-2">•</span>Client data is processed according to our Privacy Policy</li>
                      <li className="flex items-center"><span className="text-pink-500 mr-2">•</span>Data retention periods are specified in service agreements</li>
                      <li className="flex items-center"><span className="text-pink-500 mr-2">•</span>Secure data deletion procedures are followed upon project completion</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compact Cards for Remaining Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Service Level Agreements */}
              <Card className="border-yellow-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">⭐</span>
                    8. Service Level & Warranties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2 text-sm">Performance Standards</h4>
                    <ul className="space-y-1 text-yellow-800 text-xs">
                      <li className="flex items-center"><span className="text-yellow-500 mr-2">•</span>We strive to deliver services meeting or exceeding agreed specifications</li>
                      <li className="flex items-center"><span className="text-yellow-500 mr-2">•</span>Response times and performance metrics are specified in individual SOWs</li>
                      <li className="flex items-center"><span className="text-yellow-500 mr-2">•</span>Regular progress updates and milestone reviews are provided</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2 text-sm">Warranties & Disclaimers</h4>
                    <ul className="space-y-1 text-amber-800 text-xs">
                      <li className="flex items-center"><span className="text-amber-500 mr-2">•</span>Services are provided using industry-standard practices</li>
                      <li className="flex items-center"><span className="text-amber-500 mr-2">•</span>No guarantee is made regarding specific business outcomes or ROI</li>
                      <li className="flex items-center"><span className="text-amber-500 mr-2">•</span>AI systems may have limitations and are subject to ongoing improvement</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">⚖️</span>
                    9. Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 text-sm">To the maximum extent permitted by law:</p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">Damages Limitation</h4>
                    <ul className="space-y-1 text-slate-800 text-xs">
                      <li className="flex items-center"><span className="text-slate-500 mr-2">•</span>Our liability is limited to the total amount paid for the specific service</li>
                      <li className="flex items-center"><span className="text-slate-500 mr-2">•</span>We are not liable for indirect, consequential, or punitive damages</li>
                      <li className="flex items-center"><span className="text-slate-500 mr-2">•</span>Lost profits, revenue, or business opportunities are excluded from liability</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Force Majeure</h4>
                    <p className="text-gray-800 text-xs">
                      We are not liable for delays or failures due to circumstances beyond our reasonable control.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Termination */}
              <Card className="border-rose-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">🚪</span>
                    10. Termination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-rose-900 mb-2 text-sm">Termination Rights</h4>
                    <ul className="space-y-1 text-rose-800 text-xs">
                      <li className="flex items-center"><span className="text-rose-500 mr-2">•</span>Either party may terminate services with appropriate notice as specified in the SOW</li>
                      <li className="flex items-center"><span className="text-rose-500 mr-2">•</span>Immediate termination is permitted for material breach or non-payment</li>
                      <li className="flex items-center"><span className="text-rose-500 mr-2">•</span>Termination does not affect obligations incurred prior to termination</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2 text-sm">Effect of Termination</h4>
                    <ul className="space-y-1 text-red-800 text-xs">
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>All unpaid fees become immediately due and payable</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Confidentiality obligations survive termination</li>
                      <li className="flex items-center"><span className="text-red-500 mr-2">•</span>Client data will be returned or deleted as specified in the agreement</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Dispute Resolution */}
              <Card className="border-sky-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-secondary-900 flex items-center">
                    <span className="text-2xl mr-2">🤝</span>
                    11. Dispute Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-sky-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sky-900 mb-2 text-sm">Informal Resolution</h4>
                    <p className="text-sky-800 text-xs">
                      We encourage resolving disputes through direct communication. Please contact us first to discuss any concerns or issues.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Formal Dispute Resolution</h4>
                    <ul className="space-y-1 text-blue-800 text-xs">
                      <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>Disputes will be resolved through binding arbitration when possible</li>
                      <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>Arbitration will be conducted in accordance with applicable commercial arbitration rules</li>
                      <li className="flex items-center"><span className="text-blue-500 mr-2">•</span>Legal proceedings, if necessary, will be conducted in our local jurisdiction</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Governing Law, Changes, and General Provisions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <Card className="border-indigo-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-secondary-900 flex items-center">
                    <span className="text-xl mr-2">🏛️</span>
                    12. Governing Law
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-indigo-50 p-4 rounded">
                    <p className="text-indigo-800 text-xs">
                      These Terms are governed by the laws of the jurisdiction where Synura AI Solutions is incorporated, without regard to conflict of law principles.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-cyan-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-secondary-900 flex items-center">
                    <span className="text-xl mr-2">📝</span>
                    13. Changes to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-700 text-xs mb-3">We reserve the right to modify these Terms at any time. When changes are made:</p>
                  <ul className="space-y-1 text-cyan-800 text-xs">
                    <li className="flex items-center"><span className="text-cyan-500 mr-2">•</span>Updated terms will be posted on our website</li>
                    <li className="flex items-center"><span className="text-cyan-500 mr-2">•</span>The "Last updated" date will reflect the revision</li>
                    <li className="flex items-center"><span className="text-cyan-500 mr-2">•</span>Significant changes will be communicated via email when possible</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-teal-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-secondary-900 flex items-center">
                    <span className="text-xl mr-2">📋</span>
                    14. General Provisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-teal-50 p-3 rounded">
                    <h4 className="font-semibold text-teal-900 text-xs mb-1">Entire Agreement</h4>
                    <p className="text-teal-800 text-xs">These Terms, together with any applicable SOW, constitute the entire agreement between the parties.</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded">
                    <h4 className="font-semibold text-emerald-900 text-xs mb-1">Severability</h4>
                    <p className="text-emerald-800 text-xs">If any provision is found unenforceable, the remaining provisions continue in full force.</p>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Contact Section */}
            <Card className="border-primary-300 bg-gradient-to-br from-primary-50 to-primary-100">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary-900 flex items-center">
                  <span className="text-3xl mr-3">📞</span>
                  15. Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-700 mb-6">
                  For questions about these Terms of Service or our services, please contact us:
                </p>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold text-secondary-900 mb-4">Synura AI Solutions</p>
                      <div className="space-y-2">
                        <p className="text-sm text-secondary-700">
                          <strong>Legal Email:</strong>
                          <a href="mailto:legal@synura.ai" className="text-primary-600 hover:text-primary-800 ml-1">
                            legal@synura.ai
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
                        For legal or contract matters, please include "Legal" in your email subject line.
                      </p>
                      <div className="flex gap-4">
                        <Button variant="outline" asChild className="w-fit">
                          <Link href="/contact">Contact Us</Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-fit">
                          <Link href="/privacy">Privacy Policy</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <div className="border-t border-secondary-200 pt-6">
              <p className="text-sm text-secondary-600 text-center">
                These Terms of Service are effective as of October 24, 2025. By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
            </div>

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