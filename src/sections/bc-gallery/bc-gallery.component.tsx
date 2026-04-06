import { cn } from '@spektra/components'
import { X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { BcGalleryData, BcGalleryImage } from './bc-gallery.schema'

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
  const [selectedImage, setSelectedImage] = useState<BcGalleryImage | null>(null)

  const closeLightbox = useCallback(() => setSelectedImage(null), [setSelectedImage])

  useEffect(() => {
    if (!selectedImage) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selectedImage, closeLightbox])

  const filteredImages = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : images

  return (
    <section
      id="gallery"
      data-ui-id="section-bc-gallery"
      data-ui-component="bc-gallery"
      data-ui-role="gallery"
      className="bg-graphite-950 text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          {subtitle && (
            <p
              data-ui-id="gallery-subtitle"
              data-ui-role="section-subtitle"
              className="text-sm font-medium text-neon-blue uppercase tracking-wider mb-3"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="gallery-title"
            data-ui-role="section-title"
            className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight"
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
                  ? 'bg-neon-blue text-graphite-950'
                  : 'bg-graphite-800 text-gray-400 hover:text-white',
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
                    ? 'bg-neon-blue text-graphite-950'
                    : 'bg-graphite-800 text-gray-400 hover:text-white',
                )}
                onClick={() => setActiveCategory(cat!)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.src}
              data-ui-id={`gallery-item-${index}`}
              data-ui-role="gallery-image"
              className="relative aspect-square overflow-hidden cursor-pointer group rounded-lg bg-graphite-800"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {image.caption && (
                  <span className="text-white text-sm font-medium leading-tight">
                    {image.caption}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          data-ui-id="gallery-lightbox"
          data-ui-role="lightbox"
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            data-ui-type="button"
            data-ui-id="gallery-lightbox-close"
            data-ui-action="close"
            data-ui-trigger="click"
            className="absolute top-4 right-4 text-white hover:text-neon-blue transition-colors"
            onClick={closeLightbox}
            aria-label="Bezárás"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col items-center max-w-6xl w-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain mb-4"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.caption && (
              <p className="text-white text-lg font-medium text-center bg-black/50 px-6 py-3 rounded-lg">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
