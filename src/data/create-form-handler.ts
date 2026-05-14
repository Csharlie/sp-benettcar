import { createFormHandler, type FormHandler } from '@spektra/data'

/**
 * Picks the FormHandler driver based on Vite environment variables.
 * Mirror of {@link createAdapter} for the read-side DataSource.
 *
 * Supported `VITE_FORM_HANDLER` values:
 *  - `cf7`     production (Contact Form 7 REST endpoint on wp.benettcar.hu)
 *  - `noop`    development / Storybook (console.log + fake success)
 *  - `mailto`  env-selectable fallback (opens user's email client)
 *
 * Unknown values fall back to `noop` with a console warning — so a misspelled
 * env var in dev doesn't silently break things.
 */
export function createBcFormHandler(): FormHandler {
  const driver = import.meta.env.VITE_FORM_HANDLER ?? 'noop'

  switch (driver) {
    case 'cf7': {
      const apiBase = import.meta.env.VITE_FORM_CF7_API_BASE as
        | string
        | undefined
      const formId = import.meta.env.VITE_FORM_CF7_FORM_ID as
        | string
        | undefined
      if (!apiBase) {
        throw new Error(
          'VITE_FORM_CF7_API_BASE is required when VITE_FORM_HANDLER=cf7',
        )
      }
      if (!formId) {
        throw new Error(
          'VITE_FORM_CF7_FORM_ID is required when VITE_FORM_HANDLER=cf7',
        )
      }
      return createFormHandler({
        driver: 'cf7',
        apiBase,
        formId,
      })
    }

    case 'mailto': {
      const target =
        (import.meta.env.VITE_FORM_MAILTO_TARGET as string | undefined) ??
        'kapcsolat@benettcar.hu'
      return createFormHandler({
        driver: 'mailto',
        target,
        subjectTemplate: '[benettcar.hu] Új ajánlatkérés ({formId})',
      })
    }

    case 'noop':
      return createFormHandler({ driver: 'noop' })

    default:
      // eslint-disable-next-line no-console
      console.warn(
        `Unknown VITE_FORM_HANDLER "${driver as string}", falling back to noop`,
      )
      return createFormHandler({ driver: 'noop' })
  }
}
