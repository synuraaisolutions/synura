import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allServices } from '.contentlayer/generated'
import { Button } from '@/components/common/button'
import { PageLayout } from '@/components/layout/page-layout'
import { MDXContent } from '@/components/mdx-content'

interface ServicePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allServices.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: ServicePageProps) {
  const service = allServices.find((service) => service.slug === params.slug)

  if (!service) {
    return {}
  }

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      type: 'article',
    },
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = allServices.find((service) => service.slug === params.slug)

  if (!service) {
    notFound()
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="synura-container">
          <div className="max-w-4xl">
            <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-6">
              <Link href="/services" className="hover:text-primary-600 transition-colors">
                Services
              </Link>
              <span>→</span>
              <span className="text-secondary-900">{service.title}</span>
            </nav>

            <div className="flex items-center space-x-4 mb-6">
              {service.icon && <span className="text-4xl">{service.icon}</span>}
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">
                {service.title}
              </h1>
            </div>

            <p className="text-xl text-secondary-600 mb-8 max-w-3xl">
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="cta" asChild>
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits & Outcomes */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {service.benefits && (
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Key Benefits</h2>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-accent-500 mt-1">✓</span>
                      <span className="text-secondary-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.outcomes && (
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Expected Outcomes</h2>
                <ul className="space-y-4">
                  {service.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-primary-500 mt-1">→</span>
                      <span className="text-secondary-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 bg-secondary-50">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <MDXContent code={service.body.code} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Related Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allServices
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((relatedService) => (
                <div
                  key={relatedService.slug}
                  className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {relatedService.title}
                  </h3>
                  <p className="text-secondary-600 text-sm mb-4">
                    {relatedService.description}
                  </p>
                  <Button variant="ghost" asChild className="p-0 h-auto text-primary-600">
                    <Link href={relatedService.url}>
                      Learn More →
                    </Link>
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started with {service.title}?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation to discuss how this service can transform your business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}