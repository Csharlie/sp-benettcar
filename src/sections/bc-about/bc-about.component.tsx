import type { BcAboutData } from './bc-about.schema'

export function BcAbout({
  title,
  subtitle,
  content,
  image,
  stats,
  cta,
}: BcAboutData) {
  return (
    <section
      id="about"
      data-ui-id="section-bc-about"
      data-ui-component="bc-about"
      data-ui-role="about"
      className="bg-graphite-900 text-foreground pt-24 scroll-mt-16"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Text Content */}
          <div>
            {subtitle && (
              <p
                data-ui-id="about-subtitle"
                data-ui-role="section-subtitle"
                className="text-sm font-medium text-neon-blue uppercase tracking-wider mb-3"
              >
                {subtitle}
              </p>
            )}
            <h2
              data-ui-id="about-title"
              data-ui-role="section-title"
              className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight"
            >
              {title}
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed mb-8">
              {content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {cta && (
              <a
                href={cta.href}
                data-ui-type="link"
                data-ui-id="about-cta"
                data-ui-action="navigate"
                data-ui-trigger="click"
                className="inline-flex items-center justify-center px-8 py-3 text-white font-semibold rounded border-2 bg-graphite-700 border-neon-blue/40 transition-colors hover:bg-graphite-600 hover:border-neon-blue-light/60"
              >
                {cta.text}
              </a>
            )}
          </div>

          {/* Image */}
          {image && (
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div
            data-ui-id="about-stats"
            data-ui-role="stats-grid"
            className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-24 border-b border-graphite-800"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-neon-blue mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400 whitespace-pre-line">
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
