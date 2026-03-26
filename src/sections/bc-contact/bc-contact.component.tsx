import { cn } from '@spektra/components'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { BcContactData } from './bc-contact.schema'

export function BcContact({
  title,
  subtitle,
  description,
  contactInfo,
  colorScheme,
}: BcContactData) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section
      id="contact"
      data-ui-id="section-bc-contact"
      data-ui-component="bc-contact"
      data-ui-role="contact"
      data-color-scheme={colorScheme}
      className="bg-background text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {subtitle && (
            <p
              data-ui-id="contact-subtitle"
              data-ui-role="section-subtitle"
              className="text-muted-foreground font-semibold text-lg mb-2"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="contact-title"
            data-ui-role="section-title"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {title}
          </h2>
          {description && (
            <p
              data-ui-id="contact-description"
              data-ui-role="section-description"
              className="text-lg text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                data-ui-type="link"
                data-ui-id="contact-phone"
                data-ui-action="call"
                data-ui-trigger="click"
                className="flex items-center gap-4 text-foreground hover:text-accent transition-colors"
              >
                <Phone className="w-6 h-6 text-accent" />
                <span className="text-lg">{contactInfo.phone}</span>
              </a>
            )}
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                data-ui-type="link"
                data-ui-id="contact-email"
                data-ui-action="email"
                data-ui-trigger="click"
                className="flex items-center gap-4 text-foreground hover:text-accent transition-colors"
              >
                <Mail className="w-6 h-6 text-accent" />
                <span className="text-lg">{contactInfo.email}</span>
              </a>
            )}
            {contactInfo.address && (
              <div className="flex items-center gap-4 text-foreground">
                <MapPin className="w-6 h-6 text-accent" />
                <span className="text-lg">{contactInfo.address}</span>
              </div>
            )}
          </div>

          {/* Contact form */}
          {!submitted ? (
            <form
              data-ui-id="bc-contact-form"
              data-ui-type="form"
              data-ui-action="submit-form"
              data-ui-trigger="submit"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                required
                placeholder="Kovács János"
                aria-label="Név"
                data-ui-type="input"
                data-ui-id="contact-name"
                data-ui-required="true"
                data-ui-format="text"
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-muted border border-border text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-accent',
                )}
              />
              <input
                type="tel"
                name="phone"
                required
                placeholder="+36 30 123 4567"
                aria-label="Telefon"
                data-ui-type="input"
                data-ui-id="contact-phone-input"
                data-ui-required="true"
                data-ui-format="tel"
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-muted border border-border text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-accent',
                )}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="kovacs.janos@email.com"
                aria-label="Email"
                data-ui-type="input"
                data-ui-id="contact-email-input"
                data-ui-required="true"
                data-ui-format="email"
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-muted border border-border text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-accent',
                )}
              />
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Írja le kérését..."
                aria-label="Üzenet"
                data-ui-type="textarea"
                data-ui-id="contact-message"
                data-ui-required="true"
                data-ui-format="text"
                className={cn(
                  'w-full px-4 py-3 rounded-lg resize-none',
                  'bg-muted border border-border text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-accent',
                )}
              />
              <button
                type="submit"
                data-ui-type="button"
                data-ui-id="contact-submit"
                data-ui-action="submit-form"
                data-ui-trigger="click"
                className={cn(
                  'w-full px-6 py-3 rounded-xl font-medium',
                  'bg-accent text-accent-foreground hover:bg-accent/90',
                  'transition-all',
                )}
              >
                Üzenet küldése
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-border bg-muted/50">
              <p
                data-ui-id="contact-success-title"
                data-ui-role="feedback-title"
                className="text-2xl font-bold mb-2"
              >
                Köszönjük az üzenetet!
              </p>
              <p
                data-ui-id="contact-success-message"
                data-ui-role="feedback-description"
                className="text-muted-foreground mb-6"
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
                className="text-accent hover:underline font-medium"
              >
                Új üzenet küldése
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
