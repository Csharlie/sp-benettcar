import { useState } from 'react'
import type { BcContactData } from './bc-contact.schema'

export function BcContact({
  title,
  subtitle,
  description,
  contactInfo,
}: BcContactData) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section
      id="contact"
      data-ui-id="section-bc-contact"
      data-ui-component="bc-contact"
      data-ui-role="contact-section"
      className="bg-graphite-900 py-24 scroll-mt-16"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          {subtitle && (
            <p
              data-ui-id="contact-subtitle"
              data-ui-role="section-subtitle"
              className="text-sm font-medium text-neon-blue uppercase tracking-wider mb-3"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="contact-title"
            data-ui-role="section-title"
            className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight"
          >
            {title}
          </h2>
          {description && (
            <p
              data-ui-id="contact-description"
              data-ui-role="section-description"
              className="text-lg text-gray-400"
            >
              {description}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div
          data-ui-id="contact-form-container"
          data-ui-role="form-container"
          className="bg-graphite-900 border border-graphite-800 p-4 md:p-10 rounded-lg"
        >
          {!submitted ? (
            <form
              data-ui-id="contact-form"
              data-ui-type="form"
              data-ui-action="submit-form"
              data-ui-trigger="submit"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div data-ui-id="contact-name-field" data-ui-role="form-field">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Név *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Kovács János"
                    data-ui-type="input"
                    data-ui-id="contact-name-input"
                    data-ui-required="true"
                    data-ui-format="text"
                    className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition"
                  />
                </div>
                <div data-ui-id="contact-phone-field" data-ui-role="form-field">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefonszám *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+36 30 123 4567"
                    data-ui-type="input"
                    data-ui-id="contact-phone-input"
                    data-ui-required="true"
                    data-ui-format="tel"
                    className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition"
                  />
                </div>
              </div>
              <div data-ui-id="contact-email-field" data-ui-role="form-field">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="kovacs.janos@email.com"
                  data-ui-type="input"
                  data-ui-id="contact-email-input"
                  data-ui-required="true"
                  data-ui-format="email"
                  className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition"
                />
              </div>
              <div data-ui-id="contact-message-field" data-ui-role="form-field">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Üzenet *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Írja le kérését..."
                  data-ui-type="textarea"
                  data-ui-id="contact-message-textarea"
                  data-ui-required="true"
                  data-ui-format="text"
                  className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition resize-none"
                />
              </div>
              <button
                type="submit"
                data-ui-type="button"
                data-ui-id="contact-submit-button"
                data-ui-action="submit-form"
                data-ui-trigger="click"
                data-ui-role="submit-button"
                className="w-full font-semibold py-3 px-6 rounded bg-neon-blue text-graphite-950 transition-colors hover:bg-neon-blue-light"
              >
                Üzenet küldése
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <p
                data-ui-id="contact-success-title"
                data-ui-role="feedback-title"
                className="text-2xl font-bold text-white mb-2"
              >
                Köszönjük az üzenetet!
              </p>
              <p
                data-ui-id="contact-success-message"
                data-ui-role="feedback-description"
                className="text-gray-400 mb-6"
              >
                Hamarosan felvesszük Önnel a kapcsolatot.
              </p>
              <button
                type="button"
                data-ui-type="button"
                data-ui-id="contact-reset"
                data-ui-action="reset"
                data-ui-trigger="click"
                onClick={() => setSubmitted(false)}
                className="text-neon-blue hover:underline font-medium"
              >
                Új üzenet küldése
              </button>
            </div>
          )}

          {/* Contact Info */}
          <div
            data-ui-id="contact-info-grid"
            data-ui-role="contact-info"
            className="mt-10 pt-10 border-t border-graphite-800"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {contactInfo.phone && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Telefon</p>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    data-ui-type="link"
                    data-ui-id="contact-phone"
                    data-ui-action="call"
                    data-ui-trigger="click"
                    className="text-white font-medium hover:text-neon-blue transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              )}
              {contactInfo.email && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    data-ui-type="link"
                    data-ui-id="contact-email"
                    data-ui-action="email"
                    data-ui-trigger="click"
                    className="text-white font-medium hover:text-neon-blue transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.address && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Helyszín</p>
                  <p className="text-white font-medium">{contactInfo.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
