import Link from 'next/link'
import { Button } from '@/components/common/button'
import { PageLayout } from '@/components/layout/page-layout'
import { FAQAccordionSimple } from '@/components/common/faq-accordion'
import { VoiceAgentButton } from '@/components/common/voice-agent-button'

export default function FAQsPage() {
  // FAQ data organized by category for better UX
  const generalFAQs = [
    {
      question: "What does Synura AI Solutions do?",
      answer: "We specialize in intelligent business automation that delivers measurable results. We help companies eliminate repetitive tasks, connect disconnected systems, and deploy AI employees that work 24/7 to handle customer service, scheduling, lead follow-up, and reporting."
    },
    {
      question: "How do you ensure automation solutions fit our business?",
      answer: "We start with a free consultation to analyze your specific processes and identify automation opportunities with clear ROI projections. Every solution is custom-designed for your business needs, integrating with your existing systems and workflows."
    },
    {
      question: "What industries do you work with?",
      answer: "We work across industries including Professional Services, Healthcare, E-commerce, Manufacturing, and Financial Services, with expertise in compliance and industry-specific requirements like HIPAA for healthcare."
    },
    {
      question: "How long does implementation typically take?",
      answer: "Implementation timelines vary by project scope. Simple automations can be deployed in 1-2 weeks, while comprehensive AI workforce solutions typically take 4-8 weeks. We provide detailed timelines during your consultation."
    },
    {
      question: "Do you provide training for our team?",
      answer: "Yes! We include comprehensive team training, documentation, and initial support with every implementation. We ensure your team is confident using and managing the new automation systems."
    }
  ]

  const pricingFAQs = [
    {
      question: "How much does automation implementation cost?",
      answer: "Investment varies by project scope, but our clients typically see 2-3x ROI within the first months. We provide detailed cost projections and ROI analysis during your free consultation."
    },
    {
      question: "What are your payment terms?",
      answer: "Project payments are typically 50% upfront, 50% on completion. Monthly programs are billed monthly in advance. Enterprise agreements have custom terms based on scope and requirements."
    },
    {
      question: "Is there ongoing cost after implementation?",
      answer: "While basic automation runs independently, many clients choose our Managed Operations service for ongoing optimization, monitoring, and scaling. This ensures maximum ROI and continuous improvement."
    },
    {
      question: "Do you offer different pricing packages?",
      answer: "Yes, we offer project-based pricing, monthly programs, and enterprise agreements. Each option includes strategy, development, implementation, training, and initial support tailored to your needs."
    },
    {
      question: "What's included in the initial investment?",
      answer: "All pricing includes strategy and planning, development and implementation, testing and quality assurance, team training and documentation, and initial support and optimization."
    }
  ]

  const technicalFAQs = [
    {
      question: "What systems can you integrate with?",
      answer: "We integrate with most business systems including CRMs (HubSpot, Salesforce, Pipedrive), communication platforms (Slack, Teams), databases, APIs, and custom applications. We handle both standard and custom integrations."
    },
    {
      question: "How secure are the automation solutions?",
      answer: "Security is paramount. We implement enterprise-grade security measures, data encryption, secure API connections, and compliance with industry standards like GDPR and HIPAA where required."
    },
    {
      question: "What happens if something breaks?",
      answer: "We provide monitoring, quick issue resolution, and backup systems. Our Managed Operations clients get 24/7 monitoring with 15-minute response times for critical issues."
    },
    {
      question: "Can automations be modified after implementation?",
      answer: "Absolutely! We design flexible systems that can be updated and expanded. Changes can be made to accommodate new processes, integrations, or business requirements."
    }
  ]

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Get quick answers to common questions about our AI automation solutions,
              pricing, and implementation process.
            </p>
            <p className="text-lg text-secondary-700">
              Can't find what you're looking for?
              <Link href="/contact" className="text-primary-600 hover:text-primary-800 ml-1 underline">
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordions - Much more space-efficient and user-friendly */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto space-y-16">

            {/* General Questions */}
            <FAQAccordionSimple
              title="General Questions"
              faqs={generalFAQs}
            />

            {/* Pricing & Billing */}
            <FAQAccordionSimple
              title="Pricing & Billing"
              faqs={pricingFAQs}
            />

            {/* Technical Questions */}
            <FAQAccordionSimple
              title="Technical Questions"
              faqs={technicalFAQs}
            />

          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-secondary-50">
        <div className="synura-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-secondary-600 mb-8">
              Our team is here to help you understand how AI automation can transform your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="cta" asChild>
                <Link href="/contact">Schedule Free Consultation</Link>
              </Button>
              <VoiceAgentButton size="lg" variant="outline">
                Ask Verus Directly
              </VoiceAgentButton>
              <Button size="lg" variant="outline" asChild>
                <Link href="/roi-calculator">Calculate Your ROI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have transformed their operations with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/services">Explore Services</Link>
            </Button>
            <VoiceAgentButton size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
              Talk to Verus
            </VoiceAgentButton>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export const metadata = {
  title: 'Frequently Asked Questions | Synura AI Solutions',
  description: 'Get quick answers to common questions about AI automation solutions, pricing, implementation process, and how our intelligent systems can transform your business operations.',
  keywords: ['FAQ', 'AI automation questions', 'pricing questions', 'implementation', 'business automation', 'AI consulting'],
}