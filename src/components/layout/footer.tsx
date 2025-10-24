import Link from 'next/link'
import Image from 'next/image'

const footerNavigation = {
  services: [
    { name: 'AI Workforce Solutions', href: '/services/ai-workforce' },
    { name: 'Automation & Integration', href: '/services/automation-integration' },
    { name: 'AI Consulting & Strategy', href: '/services/ai-consulting' },
    { name: 'Managed AI Operations', href: '/services/managed-operations' },
  ],
  resources: [
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'ROI Calculator', href: '/roi-calculator' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Pricing', href: '/pricing' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="synura-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/synura-logo-white.svg"
                alt="Synura AI Solutions"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold">Synura</span>
                <span className="text-xs text-secondary-300 -mt-1">AI Solutions</span>
              </div>
            </div>
            <p className="text-secondary-300 text-sm mb-4">
              Smarter systems. Stronger businesses.
            </p>
            <p className="text-secondary-400 text-sm">
              AI automation agency that helps businesses save time, reduce costs,
              and eliminate inefficiency through intelligent systems.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerNavigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-secondary-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <p className="text-secondary-300 text-sm">
                <a href="mailto:sales@synura.ai" className="hover:text-white transition-colors">
                  sales@synura.ai
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} Synura AI Solutions. All rights reserved.
          </p>

          {/* Social Links (if needed in the future) */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social media links can be added here when available */}
          </div>
        </div>
      </div>
    </footer>
  )
}