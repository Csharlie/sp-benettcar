import { cn } from '@spektra/components'
import type { BcAboutData } from './bc-about.schema'

export function BcAbout({
  title,
  subtitle,
  content,
  image,
  imagePosition = 'right',
  stats,
  cta,
  colorScheme,
}: BcAboutData) {
  const imageBlock = image && (
    <div className="flex-1">
      <img
        src={image.src}
        alt={image.alt}
        className="rounded-2xl w-full h-auto object-cover"
        loading="lazy"
      />
    </div>
  )

  return (
    <section
      id="about"
      data-ui-id="section-bc-about"
      data-ui-component="bc-about"
      data-ui-role="about"
      data-color-scheme={colorScheme}
      className="bg-background text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          'flex flex-col gap-12',
          image ? 'lg:flex-row lg:items-center' : '',
        )}>
          {imagePosition === 'left' && imageBlock}

          <div className="flex-1">
            {subtitle && (
              <p className="text-muted-foreground font-semibold text-lg mb-2">
                {subtitle}
              </p>
            )}
            <h2 className="text-4xl md:text-5xl font-bold mb-8">{title}</h2>

            <div className="space-y-4 mb-8">
              {content.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {cta && (
              <a
                href={cta.href}
                data-ui-type="link"
                data-ui-id="about-cta"
                data-ui-action="navigate"
                data-ui-trigger="click"
                className={cn(
                  'inline-flex items-center justify-center font-medium transition-all',
                  'px-6 py-3 rounded-xl',
                  'bg-accent text-accent-foreground hover:bg-accent/90',
                )}
              >
                {cta.text}
              </a>
            )}
          </div>

          {imagePosition === 'right' && imageBlock}
        </div>

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-12 border-t border-border">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground whitespace-pre-line">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
