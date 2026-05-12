import { Check, MessageCircle } from 'lucide-react'
import type { BcServiceData } from './bc-service.schema'

export function BcService({
  title,
  subtitle,
  description,
  services,
  brands,
  serviceListTitle,
  brandsTitle,
  contact,
}: BcServiceData) {
  return (
    <section
      id="car-service"
      data-ui-id="section-bc-service"
      data-ui-component="bc-service"
      data-ui-role="service-detail"
      className="py-24 bg-graphite-950 scroll-mt-16"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div
          data-ui-id="service-header"
          data-ui-role="section-header"
          className="mb-16"
        >
          {subtitle && (
            <p
              data-ui-id="service-subtitle"
              data-ui-role="section-subtitle"
              className="text-sm font-medium text-neon-blue uppercase tracking-wider mb-3"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="service-title"
            data-ui-role="section-title"
            className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight"
          >
            {title}
          </h2>
          <p
            data-ui-id="service-description"
            data-ui-role="section-description"
            className="text-lg text-gray-400 max-w-2xl leading-relaxed"
          >
            {description}
          </p>
        </div>

        {/* Content Grid */}
        <div
          data-ui-id="service-content-grid"
          data-ui-role="content-grid"
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left: Service List & Brands */}
          <div
            data-ui-id="service-col-left"
            data-ui-role="content-column"
            className="space-y-8"
          >
            {/* Service List */}
            <div
              data-ui-id="service-list-card"
              data-ui-role="feature-card"
              className="bg-graphite-900 border border-neon-blue/30 p-8 rounded-lg"
            >
              <h3
                data-ui-id="service-list-heading"
                data-ui-role="item-title"
                className="text-2xl font-semibold text-white mb-6"
              >
                {serviceListTitle ?? 'Miért a Benett Car?'}
              </h3>
              <ul
                data-ui-id="service-list"
                data-ui-role="service-list"
                className="space-y-4"
              >
                {services.map((service, index) => (
                  <li
                    key={service.label}
                    data-ui-id={`service-item-${index}`}
                    data-ui-role="service-item"
                    className="flex items-start text-gray-300 leading-relaxed"
                  >
                    <Check className="w-6 h-6 text-neon-blue mr-3 flex-shrink-0" strokeWidth={1.5} />
                    <span>{service.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supported Brands */}
            <div
              data-ui-id="service-brands-card"
              data-ui-role="feature-card"
              className="bg-graphite-900 border border-neon-blue/30 p-8 rounded-lg"
            >
              <h3
                data-ui-id="service-brands-heading"
                data-ui-role="item-title"
                className="text-2xl font-semibold text-white mb-4 flex items-center"
              >
                {brandsTitle ?? 'Támogatott márkák'}
              </h3>
              <div
                data-ui-id="service-brands-list"
                data-ui-role="brand-list"
                className="flex flex-wrap gap-3"
              >
                {brands.map((brand) => (
                  <span
                    key={brand}
                    data-ui-id={`service-brand-${brand.toLowerCase()}`}
                    data-ui-role="brand-item"
                    className="px-4 py-2 bg-graphite-900 border border-graphite-700 text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact CTA */}
          {contact && (
            <div
              data-ui-id="service-col-right"
              data-ui-role="content-column"
            >
              <div
                data-ui-id="service-contact-card"
                data-ui-role="contact-card"
                className="bg-graphite-900 border border-neon-blue/30 p-10 rounded-lg"
              >
                <h3
                  data-ui-id="service-contact-heading"
                  data-ui-role="item-title"
                  className="text-2xl font-semibold text-white mb-6"
                >
                  {contact.title}
                </h3>

                {/* Online Booking Info */}
                {contact.bookingNote && (
                  <div className="mb-4 pb-4">
                    <p
                      data-ui-id="service-booking-note"
                      data-ui-role="meta"
                      className="text-gray-400 leading-relaxed"
                    >
                      {contact.bookingNote}
                    </p>
                  </div>
                )}

                <p
                  data-ui-id="service-contact-description"
                  data-ui-role="item-description"
                  className="text-gray-400 mb-8 leading-relaxed"
                >
                  {contact.description}
                </p>

                {/* Contact Options */}
                <div
                  data-ui-id="service-cta-group"
                  data-ui-role="cta-group"
                  className="space-y-4"
                >
                  {contact.messageCta && (
                    <a
                      href={contact.messageCta.href}
                      data-ui-type="link"
                      data-ui-id="service-message-cta"
                      data-ui-action="navigate"
                      data-ui-trigger="click"
                      className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-neon-blue text-graphite-950 font-semibold rounded-lg hover:bg-neon-blue-light transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {contact.messageCta.text}
                    </a>
                  )}
                </div>

                {/* Opening Hours */}
                {contact.hours && (
                  <div className="mt-8 pt-8 border-t border-graphite-700">
                    <p
                      data-ui-id="service-hours"
                      data-ui-role="meta"
                      className="text-sm font-medium text-gray-300 leading-relaxed"
                    >
                      {contact.hoursNote
                        ? contact.hoursNote.replace('{hours}', contact.hours)
                        : (
                          <>
                            Munkatársaink minden hétköznap{' '}
                            <span className="text-white font-semibold">{contact.hours}</span>{' '}
                            óra között állnak rendelkezésre.
                          </>
                        )
                      }
                      {contact.weekendHours && (
                        <>
                          <br />
                          <br />
                          Hétvégén:{' '}
                          <span className="text-white font-semibold">{contact.weekendHours}</span>.
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
