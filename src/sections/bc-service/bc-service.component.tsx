import { cn } from '@spektra/components'
import type { BcServiceData } from './bc-service.schema'

export function BcService({
  title,
  subtitle,
  description,
  brands,
  colorScheme,
}: BcServiceData) {
  return (
    <section
      id="car-service"
      data-ui-id="section-bc-service"
      data-ui-component="bc-service"
      data-ui-role="service-detail"
      data-color-scheme={colorScheme}
      className="bg-background text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          {subtitle && (
            <p className="text-muted-foreground font-semibold text-lg mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className={cn(
                'px-5 py-2.5 rounded-lg text-sm font-semibold',
                'border border-border bg-muted/50 text-foreground',
                'tracking-wider uppercase',
              )}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
