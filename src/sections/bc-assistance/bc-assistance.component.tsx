import { cn } from '@spektra/components'
import { Phone } from 'lucide-react'
import type { BcAssistanceData } from './bc-assistance.schema'

export function BcAssistance({
  title,
  subtitle,
  description,
  phone,
  serviceArea,
  colorScheme,
}: BcAssistanceData) {
  return (
    <section
      id="roadside"
      data-ui-id="section-bc-assistance"
      data-ui-component="bc-assistance"
      data-ui-role="cta"
      data-color-scheme={colorScheme}
      className="bg-background text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {subtitle && (
            <p className="text-muted-foreground font-semibold text-lg mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            {description}
          </p>

          <a
            href={`tel:${phone}`}
            data-ui-type="link"
            data-ui-id="assistance-phone"
            data-ui-action="call"
            data-ui-trigger="click"
            className={cn(
              'inline-flex items-center justify-center gap-3',
              'px-8 py-4 text-xl font-bold rounded-xl',
              'bg-accent text-accent-foreground hover:bg-accent/90',
              'transition-all',
            )}
          >
            <Phone className="w-6 h-6" />
            {phone}
          </a>

          {serviceArea && (
            <p className="mt-6 text-muted-foreground">
              Elérhető: {serviceArea}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
