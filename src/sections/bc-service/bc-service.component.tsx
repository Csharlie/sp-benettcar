import { Wrench, CheckCircle, Phone, MessageCircle } from 'lucide-react'
import type { BcServiceData } from './bc-service.schema'

export function BcService({
  title,
  subtitle,
  description,
  services,
  brands,
  contact,
}: BcServiceData) {
  return (
    <section
      id="car-service"
      data-ui-id="section-bc-service"
      data-ui-component="bc-service"
      data-ui-role="service-detail"
      className="py-24 bg-graphite-950"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16">
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
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Service List & Brands */}
          <div className="space-y-8">
            {/* Service List */}
            <div className="bg-graphite-900 border border-neon-blue/30 p-8 rounded-lg">
              <h3
                data-ui-id="service-list-heading"
                data-ui-role="item-title"
                className="text-xl font-semibold text-white mb-6 flex items-center"
              >
                <Wrench className="w-5 h-5 text-neon-blue mr-3" />
                Szolgáltatásaink
              </h3>
              <ul className="space-y-4">
                {services.map((service) => (
                  <li
                    key={service.label}
                    className="flex items-start text-gray-300 leading-relaxed"
                  >
                    <CheckCircle className="w-5 h-5 text-neon-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>{service.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supported Brands */}
            <div className="bg-graphite-900 border border-neon-blue/30 p-8 rounded-lg">
              <h3
                data-ui-id="service-brands-heading"
                data-ui-role="item-title"
                className="text-xl font-semibold text-white mb-4 flex items-center"
              >
                <Wrench className="w-5 h-5 text-neon-blue mr-3" />
                Támogatott márkák
              </h3>
              <div className="flex flex-wrap gap-3">
                {brands.map((brand) => (
                  <span
                    key={brand}
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
            <div className="space-y-8">
              <div className="bg-graphite-900 border border-neon-blue/30 p-10 rounded-lg">
                <h3
                  data-ui-id="service-contact-heading"
                  data-ui-role="item-title"
                  className="text-2xl font-semibold text-white mb-6"
                >
                  {contact.title}
                </h3>

                <p
                  data-ui-id="service-contact-description"
                  data-ui-role="item-description"
                  className="text-gray-400 mb-8 leading-relaxed"
                >
                  {contact.description}
                </p>

                {/* Contact Options */}
                <div className="space-y-4">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      data-ui-type="link"
                      data-ui-id="service-phone-cta"
                      data-ui-action="call"
                      data-ui-trigger="click"
                      className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-neon-blue text-graphite-950 font-semibold rounded-lg hover:bg-neon-blue-light transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Hívjon most
                    </a>
                  )}

                  {contact.messageCta && (
                    <a
                      href={contact.messageCta.href}
                      data-ui-type="link"
                      data-ui-id="service-message-cta"
                      data-ui-action="navigate"
                      data-ui-trigger="click"
                      className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-graphite-700 text-white font-semibold rounded-lg hover:bg-graphite-600 border border-graphite-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {contact.messageCta.text}
                    </a>
                  )}
                </div>

                {/* Online Booking Info */}
                {contact.bookingNote && (
                  <div className="mt-6 pt-6 border-t border-graphite-700/50">
                    <p
                      data-ui-id="service-booking-note"
                      data-ui-role="meta"
                      className="text-xs text-gray-500 leading-relaxed"
                    >
                      {contact.bookingNote}
                    </p>
                  </div>
                )}

                {/* Opening Hours */}
                {contact.hours && (
                  <div className="mt-8 pt-8 border-t border-graphite-700">
                    <p
                      data-ui-id="service-hours"
                      data-ui-role="meta"
                      className="text-sm font-medium text-gray-300 leading-relaxed"
                    >
                      Munkatársaink minden hétköznap{' '}
                      <span className="text-white font-semibold">{contact.hours}</span>{' '}
                      óra között állnak rendelkezésre.
                      {contact.weekendHours && (
                        <>
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
