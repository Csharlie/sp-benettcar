import { Phone, Mail, MapPin } from 'lucide-react'
import type { LayoutShellProps } from '@spektra/layouts'
import type { BcServicesData } from '../sections/bc-services/bc-services.schema'
import type { BcContactData } from '../sections/bc-contact/bc-contact.schema'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function smoothScroll(href: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export function AppFooter({ siteData }: LayoutShellProps) {
  const sections = siteData.pages.flatMap((p) => p.sections)

  const serviceLinks =
    (sections.find((s) => s.type === 'bc-services')?.data as BcServicesData | undefined)
      ?.services ?? []

  const contactInfo =
    (sections.find((s) => s.type === 'bc-contact')?.data as BcContactData | undefined)
      ?.contactInfo

  const footerLinks = siteData.navigation.footer ?? []
  const infoLinks = footerLinks.filter((l) =>
    ['#about', '#gallery', '#contact'].includes(l.href)
  )
  const legalLinks = footerLinks.filter((l) =>
    ['#privacy', '#terms'].includes(l.href)
  )

  return (
    <footer
      data-ui-id="footer"
      data-ui-component="app-footer"
      data-ui-role="site-footer"
      className="bg-graphite-950 border-t border-graphite-800 text-gray-400"
    >
      {/* Main footer grid */}
      <div
        data-ui-id="footer-main"
        data-ui-role="footer-main"
        className="container mx-auto px-6 max-w-7xl py-16"
      >
        <div
          data-ui-id="footer-grid"
          data-ui-role="footer-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand column */}
          <div
            data-ui-id="footer-brand-col"
            data-ui-role="footer-brand"
            className="flex flex-col gap-4"
          >
            <p
              data-ui-id="footer-logo-text"
              data-ui-role="footer-logo"
              className="text-white font-semibold text-lg"
            >
              {siteData.site.name}
            </p>
            {siteData.site.description && (
              <p
                data-ui-id="footer-description"
                data-ui-role="footer-description"
                className="text-sm text-gray-500 leading-relaxed"
              >
                {siteData.site.description}
              </p>
            )}
            <a
              href="https://www.facebook.com/profile.php?id=61554864909316"
              target="_blank"
              rel="noopener noreferrer"
              data-ui-type="link"
              data-ui-id="footer-facebook-link"
              data-ui-action="external"
              data-ui-trigger="click"
              aria-label="Benett Car Facebook"
              className="flex items-center gap-2 text-sm text-neon-blue hover:text-neon-blue-light transition-colors w-fit mt-1"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </a>
          </div>

          {/* Szolgáltatások column */}
          <div
            data-ui-id="footer-services-col"
            data-ui-role="footer-section"
            data-ui-section="services"
          >
            <h3
              data-ui-id="footer-services-heading"
              data-ui-role="footer-section-title"
              className="text-white font-semibold text-sm uppercase tracking-wider mb-5"
            >
              Szolgáltatások
            </h3>
            <ul
              data-ui-id="footer-services-list"
              data-ui-role="footer-link-list"
              className="space-y-3"
            >
              {serviceLinks.map((service, i) => (
                <li key={service.title}>
                  <a
                    href="#services"
                    onClick={smoothScroll('#services')}
                    data-ui-type="link"
                    data-ui-id={`footer-service-link-${i}`}
                    data-ui-action="navigate"
                    data-ui-trigger="click"
                    className="text-sm hover:text-white transition-colors"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Információ column */}
          <div
            data-ui-id="footer-info-col"
            data-ui-role="footer-section"
            data-ui-section="info"
          >
            <h3
              data-ui-id="footer-info-heading"
              data-ui-role="footer-section-title"
              className="text-white font-semibold text-sm uppercase tracking-wider mb-5"
            >
              Információ
            </h3>
            <ul
              data-ui-id="footer-info-list"
              data-ui-role="footer-link-list"
              className="space-y-3"
            >
              {infoLinks.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={smoothScroll(link.href)}
                    data-ui-type="link"
                    data-ui-id={`footer-info-link-${i}`}
                    data-ui-action="navigate"
                    data-ui-trigger="click"
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kapcsolat column */}
          <div
            data-ui-id="footer-contact-col"
            data-ui-role="footer-section"
            data-ui-section="contact"
          >
            <h3
              data-ui-id="footer-contact-heading"
              data-ui-role="footer-section-title"
              className="text-white font-semibold text-sm uppercase tracking-wider mb-5"
            >
              Kapcsolat
            </h3>
            <ul
              data-ui-id="footer-contact-list"
              data-ui-role="footer-contact-list"
              className="space-y-4"
            >
              {contactInfo?.phone && (
                <li>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    data-ui-type="link"
                    data-ui-id="footer-contact-phone"
                    data-ui-action="call"
                    data-ui-trigger="click"
                    className="flex items-start gap-3 text-sm hover:text-white transition-colors group"
                  >
                    <Phone className="w-4 h-4 mt-0.5 text-neon-blue flex-shrink-0" strokeWidth={1.5} />
                    <span>{contactInfo.phone}</span>
                  </a>
                </li>
              )}
              {contactInfo?.email && (
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    data-ui-type="link"
                    data-ui-id="footer-contact-email"
                    data-ui-action="email"
                    data-ui-trigger="click"
                    className="flex items-start gap-3 text-sm hover:text-white transition-colors group"
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-neon-blue flex-shrink-0" strokeWidth={1.5} />
                    <span>{contactInfo.email}</span>
                  </a>
                </li>
              )}
              {contactInfo?.address && (
                <li className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 text-neon-blue flex-shrink-0" strokeWidth={1.5} />
                  <span>{contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        data-ui-id="footer-bottom"
        data-ui-role="footer-bottom"
        className="border-t border-graphite-800"
      >
        <div className="container mx-auto px-6 max-w-7xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            data-ui-id="footer-copyright"
            data-ui-role="footer-copyright"
            className="text-xs text-gray-600"
          >
            &copy; {new Date().getFullYear()} Benett Car Business Kft. Minden jog fenntartva.
          </p>

          <div
            data-ui-id="footer-bottom-right"
            data-ui-role="footer-bottom-right"
            className="flex items-center gap-4 text-xs text-gray-600"
          >
            {legalLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={smoothScroll(link.href)}
                data-ui-type="link"
                data-ui-id={`footer-legal-link-${i}`}
                data-ui-action="navigate"
                data-ui-trigger="click"
                className="hover:text-gray-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <span className="text-gray-700" aria-hidden="true">·</span>
            <span data-ui-id="footer-credit" data-ui-role="footer-credit">
              Created by{' '}
              <a
                href="#"
                data-ui-type="link"
                data-ui-id="footer-credit-link"
                data-ui-action="external"
                data-ui-trigger="click"
                className="text-neon-blue hover:text-neon-blue-light transition-colors"
              >
                PSPro
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
