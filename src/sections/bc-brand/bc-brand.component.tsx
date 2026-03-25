import { cn } from '@spektra/components'
import type { BcBrandData } from './bc-brand.schema'

export function BcBrand({ brands }: BcBrandData) {
  return (
    <section
      id="brand"
      data-ui-id="section-bc-brand"
      data-ui-component="bc-brand"
      data-ui-role="brand-bar"
      className="bg-background py-12 border-y border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={cn(
                'text-muted-foreground text-lg md:text-xl font-semibold',
                'tracking-wider uppercase',
                'hover:text-accent transition-colors',
              )}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
