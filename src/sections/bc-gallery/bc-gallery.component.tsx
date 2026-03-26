import { cn } from '@spektra/components'
import { useState } from 'react'
import type { BcGalleryData } from './bc-gallery.schema'

export function BcGallery({
  title,
  subtitle,
  showCategories,
  images,
}: BcGalleryData) {
  const categories = showCategories
    ? Array.from(new Set(images.map((img) => img.category).filter(Boolean)))
    : []

  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredImages = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : images

  return (
    <section
      id="gallery"
      data-ui-id="section-bc-gallery"
      data-ui-component="bc-gallery"
      data-ui-role="gallery"
      className="bg-background text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {subtitle && (
            <p
              data-ui-id="gallery-subtitle"
              data-ui-role="section-subtitle"
              className="text-muted-foreground font-semibold text-lg mb-2"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="gallery-title"
            data-ui-role="section-title"
            className="text-4xl md:text-5xl font-bold"
          >
            {title}
          </h2>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              type="button"
              data-ui-type="button"
              data-ui-id="gallery-filter-all"
              data-ui-action="filter"
              data-ui-trigger="click"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                !activeCategory
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveCategory(null)}
            >
              Mind
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ui-type="button"
                data-ui-id={`gallery-filter-${cat?.toLowerCase().replace(/\s+/g, '-')}`}
                data-ui-action="filter"
                data-ui-trigger="click"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveCategory(cat!)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <figure
              key={image.src}
              className="group relative overflow-hidden rounded-lg aspect-[4/3]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {image.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm">{image.caption}</p>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
