import { useState, type FormEvent } from 'react'
import { useFormHandler } from '@spektra/runtime'
import type { BcContactData } from './bc-contact.schema'

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ok' }
  | { kind: 'error'; message: string; field?: string }
  | { kind: 'rate_limited' }

const RATE_LIMITED_MESSAGE =
  'Túl sok kérés vagy lehetséges spam-jelzés. Kérjük próbálja meg pár perc múlva újra, vagy hívjon minket telefonon.'

const VALIDATION_FALLBACK = 'Kérjük, ellenőrizze a mezőket és próbálja újra.'

export function BcContact({
  title,
  subtitle,
  description,
}: BcContactData) {
  const handler = useFormHandler()
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })

  // The form field names below match the Contact Form 7 form template
  // (see sp-docs/knowledge/implementation/p14-6-contact-form-formhandler.md
  // Fázis 3B). The CF7 driver returns `field` values using these exact
  // names so we can highlight the right input on validation errors.
  const fieldErrorFor = (name: string): string | undefined =>
    state.kind === 'error' && state.field === name ? state.message : undefined

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state.kind === 'loading') return

    const formEl = e.currentTarget
    const formData = new FormData(formEl)

    // Convert to plain object for the FormHandler contract.
    const fields: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      // Skip Blob/File values — we don't accept file uploads in this form.
      if (typeof value === 'string') {
        fields[key] = value
      }
    }

    setState({ kind: 'loading' })
    try {
      const result = await handler.submit('contact', fields)
      switch (result.status) {
        case 'ok':
          setState({ kind: 'ok' })
          formEl.reset()
          break
        case 'error':
          setState({
            kind: 'error',
            message: result.message || VALIDATION_FALLBACK,
            field: result.field,
          })
          break
        case 'rate_limited':
          setState({ kind: 'rate_limited' })
          break
      }
    } catch (err) {
      // FormHandler drivers are designed not to throw for expected errors —
      // this catches the truly unexpected (e.g. driver misconfiguration).
      const message =
        err instanceof Error ? err.message : 'Ismeretlen hiba történt'
      setState({ kind: 'error', message })
    }
  }

  function resetForm() {
    setState({ kind: 'idle' })
  }

  const formDisabled = state.kind === 'loading'
  const generalError =
    state.kind === 'error' && !state.field ? state.message : undefined

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
          {state.kind === 'ok' ? (
            <div
              data-ui-id="contact-success"
              data-ui-role="feedback-container"
              data-ui-state="success"
              className="flex flex-col items-center justify-center text-center p-8"
            >
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
                onClick={resetForm}
                className="text-neon-blue hover:underline font-medium"
              >
                Új üzenet küldése
              </button>
            </div>
          ) : state.kind === 'rate_limited' ? (
            <div
              data-ui-id="contact-rate-limited"
              data-ui-role="feedback-container"
              data-ui-state="rate-limited"
              className="flex flex-col items-center justify-center text-center p-8"
            >
              <p
                data-ui-id="contact-rate-limited-title"
                data-ui-role="feedback-title"
                className="text-2xl font-bold text-white mb-2"
              >
                Egy pillanat türelmet kérünk
              </p>
              <p
                data-ui-id="contact-rate-limited-message"
                data-ui-role="feedback-description"
                className="text-gray-400 mb-6"
              >
                {RATE_LIMITED_MESSAGE}
              </p>
              <button
                type="button"
                data-ui-type="button"
                data-ui-id="contact-rate-limited-reset"
                data-ui-action="reset"
                data-ui-trigger="click"
                onClick={resetForm}
                className="text-neon-blue hover:underline font-medium"
              >
                Próbálom újra
              </button>
            </div>
          ) : (
            <form
              data-ui-id="contact-form"
              data-ui-type="form"
              data-ui-action="submit-form"
              data-ui-trigger="submit"
              data-ui-state={state.kind}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div data-ui-id="contact-name-field" data-ui-role="form-field">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Név *
                  </label>
                  <input
                    type="text"
                    name="your-name"
                    required
                    disabled={formDisabled}
                    placeholder="Kovács János"
                    aria-invalid={!!fieldErrorFor('your-name')}
                    data-ui-type="input"
                    data-ui-id="contact-name-input"
                    data-ui-required="true"
                    data-ui-format="text"
                    className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition disabled:opacity-50"
                  />
                  {fieldErrorFor('your-name') && (
                    <p
                      data-ui-id="contact-name-error"
                      data-ui-role="field-error"
                      className="mt-2 text-sm text-red-400"
                    >
                      {fieldErrorFor('your-name')}
                    </p>
                  )}
                </div>
                <div data-ui-id="contact-phone-field" data-ui-role="form-field">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefonszám
                  </label>
                  <input
                    type="tel"
                    name="your-phone"
                    disabled={formDisabled}
                    placeholder="+36 30 123 4567"
                    aria-invalid={!!fieldErrorFor('your-phone')}
                    data-ui-type="input"
                    data-ui-id="contact-phone-input"
                    data-ui-format="tel"
                    className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition disabled:opacity-50"
                  />
                  {fieldErrorFor('your-phone') && (
                    <p
                      data-ui-id="contact-phone-error"
                      data-ui-role="field-error"
                      className="mt-2 text-sm text-red-400"
                    >
                      {fieldErrorFor('your-phone')}
                    </p>
                  )}
                </div>
              </div>
              <div data-ui-id="contact-email-field" data-ui-role="form-field">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="your-email"
                  required
                  disabled={formDisabled}
                  placeholder="kovacs.janos@email.com"
                  aria-invalid={!!fieldErrorFor('your-email')}
                  data-ui-type="input"
                  data-ui-id="contact-email-input"
                  data-ui-required="true"
                  data-ui-format="email"
                  className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition disabled:opacity-50"
                />
                {fieldErrorFor('your-email') && (
                  <p
                    data-ui-id="contact-email-error"
                    data-ui-role="field-error"
                    className="mt-2 text-sm text-red-400"
                  >
                    {fieldErrorFor('your-email')}
                  </p>
                )}
              </div>
              <div data-ui-id="contact-message-field" data-ui-role="form-field">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Üzenet *
                </label>
                <textarea
                  name="your-message"
                  required
                  disabled={formDisabled}
                  rows={5}
                  placeholder="Írja le kérését..."
                  aria-invalid={!!fieldErrorFor('your-message')}
                  data-ui-type="textarea"
                  data-ui-id="contact-message-textarea"
                  data-ui-required="true"
                  data-ui-format="text"
                  className="w-full px-4 py-3 bg-graphite-950 border border-graphite-700 rounded text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-transparent transition resize-none disabled:opacity-50"
                />
                {fieldErrorFor('your-message') && (
                  <p
                    data-ui-id="contact-message-error"
                    data-ui-role="field-error"
                    className="mt-2 text-sm text-red-400"
                  >
                    {fieldErrorFor('your-message')}
                  </p>
                )}
              </div>

              {/* GDPR consent — required by CF7 [acceptance gdpr-accept] */}
              <div
                data-ui-id="contact-gdpr-field"
                data-ui-role="form-field"
                className="flex items-start gap-3 text-sm text-gray-300"
              >
                <input
                  type="checkbox"
                  id="contact-gdpr-checkbox"
                  name="gdpr-accept"
                  value="1"
                  required
                  disabled={formDisabled}
                  aria-invalid={!!fieldErrorFor('gdpr-accept')}
                  data-ui-type="checkbox"
                  data-ui-id="contact-gdpr-input"
                  data-ui-required="true"
                  className="mt-1 w-4 h-4 accent-neon-blue cursor-pointer disabled:opacity-50"
                />
                <label
                  htmlFor="contact-gdpr-checkbox"
                  className="leading-relaxed cursor-pointer select-none"
                >
                  Elfogadom az adatvédelmi tájékoztatót (lábléc → Adatvédelem). *
                </label>
              </div>
              {fieldErrorFor('gdpr-accept') && (
                <p
                  data-ui-id="contact-gdpr-error"
                  data-ui-role="field-error"
                  className="-mt-3 text-sm text-red-400"
                >
                  {fieldErrorFor('gdpr-accept')}
                </p>
              )}

              {/* Honeypot — invisible to humans, bots fill it in */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                }}
              >
                <label htmlFor="honeypot-field">Ne töltse ki ezt a mezőt</label>
                <input
                  type="text"
                  id="honeypot-field"
                  name="honeypot-field"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {generalError && (
                <p
                  role="alert"
                  data-ui-id="contact-general-error"
                  data-ui-role="form-error"
                  className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded px-4 py-3"
                >
                  {generalError}
                </p>
              )}

              <button
                type="submit"
                disabled={formDisabled}
                data-ui-type="button"
                data-ui-id="contact-submit-button"
                data-ui-action="submit-form"
                data-ui-trigger="click"
                data-ui-role="submit-button"
                data-ui-state={state.kind}
                className="w-full font-semibold py-3 px-6 rounded bg-neon-blue text-graphite-950 transition-colors hover:bg-neon-blue-light disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state.kind === 'loading' ? 'Küldés…' : 'Üzenet küldése'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
