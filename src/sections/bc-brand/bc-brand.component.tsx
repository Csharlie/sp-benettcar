import type { BcBrandData } from './bc-brand.schema'

export function BcBrand({ title, description, brands }: BcBrandData) {
  return (
    <section
      id="brand"
      data-ui-id="section-bc-brand"
      data-ui-component="bc-brand"
      data-ui-role="brand-bar"
      className="bg-graphite-900 py-20 border-t border-graphite-800"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section header */}
        {title && (
          <div className="text-center mb-12">
            <h4
              data-ui-id="brand-title"
              data-ui-role="section-title"
              className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight"
            >
              {title}
            </h4>
          </div>
        )}

        {description && (
          <div className="text-center mb-12">
            <p
              data-ui-id="brand-description"
              data-ui-role="section-description"
              className="text-lg md:text-xl text-gray-300 mx-auto leading-relaxed"
            >
              {description}
            </p>
          </div>
        )}

        {/* Brand logos / names */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 mb-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="w-8 h-8 md:w-14 md:h-14 flex items-center justify-center"
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.alt ?? `${brand.name} logó`}
                  className={`max-w-full max-h-full object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300${
                    brand.invert ? ' invert' : ''
                  }`}
                  style={brand.invert ? { mixBlendMode: 'screen' } : undefined}
                />
              ) : (
                <span className="text-gray-400 text-sm md:text-base font-semibold uppercase tracking-wider hover:text-neon-blue transition-colors">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
