import Link from 'next/link'
import { allFAQs } from '.contentlayer/generated'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
import { MDXContent } from '@/components/mdx-content'

export default function FAQsPage() {
  // Sort FAQs by order, then by title
  const sortedFAQs = allFAQs.sort((a, b) => {
    if (a.order !== b.order) {
      return (a.order || 0) - (b.order || 0)
    }
    return a.title.localeCompare(b.title)
  })

  // Group FAQs by category
  const faqsByCategory = sortedFAQs.reduce((acc, faq) => {
    const category = faq.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(faq)
    return acc
  }, {} as Record<string, typeof sortedFAQs>)

  const getCategoryTitle = (category: string) => {
    const titles = {
      'general': 'General Questions',
      'pricing-billing': 'Pricing & Billing',
      'technical': 'Technical Questions',
      'services': 'Services & Implementation'
    }
    return titles[category as keyof typeof titles] || category
  }

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

      {/* FAQ Categories */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto space-y-16">
            {Object.entries(faqsByCategory).map(([category, faqs]) => (
              <div key={category}>
                <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
                  {getCategoryTitle(category)}
                </h2>
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <Card key={faq.slug} className="border-secondary-200 hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-secondary-900">
                          {faq.title}
                        </CardTitle>
                        <CardDescription>
                          {faq.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-lg max-w-none">
                          <MDXContent code={faq.body.raw} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
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