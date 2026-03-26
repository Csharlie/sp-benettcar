import type { BcHeroData } from './bc-hero.schema'

export function BcHero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
}: BcHeroData) {
  return (
    <section
      id="hero"
      data-ui-id="section-bc-hero"
      data-ui-component="bc-hero"
      data-ui-role="hero"
      data-ui-state="default"
      data-ui-variant="primary"
      className="relative min-h-screen pt-24 pb-20 flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {backgroundImage && (
          <img
            src={backgroundImage.src}
            alt={backgroundImage.alt ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Dark left-heavy gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,15,20,0.88),rgba(15,15,20,0.78),rgba(15,15,20,0.68))]" />
      </div>

      {/* Content — left-aligned */}
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="max-w-3xl">
          {/* Subtitle — neon-blue accent, uppercase tracking */}
          {subtitle && (
            <p
              className="text-sm md:text-base font-medium text-neon-blue uppercase tracking-[0.2em] mb-6"
              data-ui-id="hero-subtitle"
              data-ui-role="hero-subtitle"
            >
              {subtitle}
            </p>
          )}

          {/* Title — text-shadow for depth */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-8 leading-tight tracking-tight [text-shadow:0_4px_20px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.6)]"
            data-ui-id="hero-title"
            data-ui-role="hero-title"
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed max-w-2xl"
            data-ui-id="hero-description"
            data-ui-role="hero-description"
          >
            {description}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4"
            data-ui-id="hero-cta-group"
            data-ui-role="hero-cta-group"
          >
            {primaryCTA && (
              <a
                href={primaryCTA.href}
                data-ui-type="link"
                data-ui-id="hero-primary-cta"
                data-ui-action="navigate"
                data-ui-trigger="click"
                data-ui-role="primary-cta"
                className="inline-flex items-center justify-center px-8 py-4 text-graphite-950 font-bold text-lg rounded transition-all bg-neon-blue hover:bg-neon-blue-light border border-white/30 hover:border-white/50"
              >
                {primaryCTA.text}
              </a>
            )}

            {secondaryCTA && (
              <a
                href={secondaryCTA.href}
                data-ui-type="link"
                data-ui-id="hero-secondary-cta"
                data-ui-action="navigate"
                data-ui-trigger="click"
                data-ui-role="secondary-cta"
                className="inline-flex items-center justify-center px-8 py-4 text-gray-300 font-normal text-base rounded transition-all border border-gray-600 hover:border-gray-400 hover:text-white"
              >
                {secondaryCTA.text}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        data-ui-role="scroll-indicator"
      >
        <div className="w-6 h-10 border-2 border-neon-blue/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neon-blue rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
