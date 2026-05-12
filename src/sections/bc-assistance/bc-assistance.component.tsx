import { Phone } from 'lucide-react'
import type { BcAssistanceData } from './bc-assistance.schema'

export function BcAssistance({
  title,
  subtitle,
  description,
  requestLabel,
  requestHref,
  serviceArea,
}: BcAssistanceData) {
  return (
    <section
      id="roadside"
      data-ui-id="section-bc-assistance"
      data-ui-component="bc-assistance"
      data-ui-role="support-section"
      className="bg-graphite-950 py-16 scroll-mt-16"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          {subtitle && (
            <p
              data-ui-id="assistance-subtitle"
              data-ui-role="section-subtitle"
              className="text-sm font-medium text-neon-blue uppercase tracking-wider mb-3"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="assistance-title"
            data-ui-role="section-title"
            className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight"
          >
            {title}
          </h2>
          {description && (
            <p
              data-ui-id="assistance-description"
              data-ui-role="section-description"
              className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </p>
          )}
        </div>

        {/* CTA Card */}
        <div className="max-w-2xl mx-auto">
          <div
            data-ui-id="assistance-cta-card"
            data-ui-role="cta-card"
            className="bg-graphite-900 border border-graphite-700 p-10 rounded-lg text-center"
          >
            <a
              href={requestHref ?? '#contact'}
              data-ui-type="link"
              data-ui-id="assistance-request-button"
              data-ui-action="navigate"
              data-ui-trigger="click"
              data-ui-role="secondary-cta"
              className="inline-flex items-center bg-graphite-700 hover:bg-graphite-600 text-white font-semibold py-3 px-8 rounded-lg border border-graphite-600 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              {requestLabel ?? 'Útmenti segítség igénylése'}
            </a>

            {serviceArea && (
              <p
                data-ui-id="assistance-service-area"
                data-ui-role="meta"
                className="text-sm text-gray-500 mt-6"
              >
                Szolgáltatási terület: {serviceArea}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
