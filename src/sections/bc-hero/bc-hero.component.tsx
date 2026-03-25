import { cn } from '@spektra/components'
import { ArrowRight } from 'lucide-react'
import type { BcHeroData } from './bc-hero.schema'

export function BcHero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  colorScheme,
}: BcHeroData) {
  return (
    <section
      id="hero"
      data-ui-id="section-bc-hero"
      data-ui-component="bc-hero"
      data-ui-role="hero"
      data-color-scheme={colorScheme}
      className={cn(
        'relative min-h-[600px] flex items-center justify-center',
        'bg-background text-foreground',
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4 py-20 text-center">
        {subtitle && (
          <p className="text-muted-foreground font-semibold text-lg mb-4">
            {subtitle}
          </p>
        )}

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          {title}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {primaryCTA && (
            <a
              href={primaryCTA.href}
              data-ui-type="link"
              data-ui-id="hero-primary-cta"
              data-ui-action="navigate"
              data-ui-trigger="click"
              className={cn(
                'inline-flex items-center justify-center font-medium transition-all',
                'px-8 py-4 text-xl rounded-xl',
                'bg-accent text-accent-foreground hover:bg-accent/90',
              )}
            >
              {primaryCTA.text}
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          )}

          {secondaryCTA && (
            <a
              href={secondaryCTA.href}
              data-ui-type="link"
              data-ui-id="hero-secondary-cta"
              data-ui-action="navigate"
              data-ui-trigger="click"
              className={cn(
                'inline-flex items-center justify-center font-medium transition-all',
                'px-8 py-4 text-xl rounded-xl',
                'border border-border text-foreground hover:bg-muted',
              )}
            >
              {secondaryCTA.text}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
