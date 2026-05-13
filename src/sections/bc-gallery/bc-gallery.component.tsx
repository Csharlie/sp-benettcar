import { cn } from '@spektra/components'
import { X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { BcGalleryData, BcGalleryImage } from './bc-gallery.schema'

export function BcGallery({
  title,
  subtitle,
  showCategories,
  perPage = 8,
  images,
}: BcGalleryData) {
  const categories = showCategories
    ? Array.from(new Set(images.map((img) => img.category).filter(Boolean)))
    : []

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredImages = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : images

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') setLightboxIndex((i) => i !== null ? Math.min(filteredImages.length - 1, i + 1) : i)
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => i !== null ? Math.max(0, i - 1) : i)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxIndex, closeLightbox, filteredImages.length])

  const totalPages = Math.ceil(filteredImages.length / perPage)
  const pagedImages = filteredImages.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  return (
    <section
      id="gallery"
      data-ui-id="section-bc-gallery"
      data-ui-component="bc-gallery"
      data-ui-role="gallery"
      className="bg-graphite-950 text-foreground py-20 md:py-32 scroll-mt-16"
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
              onClick={() => handleCategoryChange(null)}
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
                onClick={() => handleCategoryChange(cat!)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagedImages.map((image, index) => (
            <div
              key={image.src}
              data-ui-id={`gallery-item-${index}`}
              data-ui-role="gallery-image"
              className="relative aspect-square overflow-hidden cursor-pointer group rounded-lg bg-graphite-800"
              onClick={() => setLightboxIndex(filteredImages.indexOf(image))}
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

        {totalPages > 1 && (
          <div
            data-ui-id="gallery-pagination"
            data-ui-role="pagination"
            className="flex items-center justify-center gap-3 mt-10"
          >
            <button
              type="button"
              data-ui-type="button"
              data-ui-id="gallery-prev"
              data-ui-action="paginate"
              data-ui-trigger="click"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-graphite-800 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                data-ui-type="button"
                data-ui-id={`gallery-page-${page}`}
                data-ui-action="paginate"
                data-ui-trigger="click"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-neon-blue text-graphite-950'
                    : 'bg-graphite-800 text-gray-400 hover:text-white',
                )}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              data-ui-type="button"
              data-ui-id="gallery-next"
              data-ui-action="paginate"
              data-ui-trigger="click"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-graphite-800 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (() => {
        const image = filteredImages[lightboxIndex]
        return (
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
              className="absolute top-4 right-4 text-white hover:text-neon-blue transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Bezárás"
            >
              <X className="w-8 h-8" />
            </button>

            {lightboxIndex > 0 && (
              <button
                type="button"
                data-ui-type="button"
                data-ui-id="gallery-lightbox-prev"
                data-ui-action="navigate"
                data-ui-trigger="click"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-neon-blue transition-colors text-4xl z-10 px-3 py-2"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1) }}
                aria-label="Előző"
              >
                ←
              </button>
            )}

            {lightboxIndex < filteredImages.length - 1 && (
              <button
                type="button"
                data-ui-type="button"
                data-ui-id="gallery-lightbox-next"
                data-ui-action="navigate"
                data-ui-trigger="click"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-neon-blue transition-colors text-4xl z-10 px-3 py-2"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1) }}
                aria-label="Következő"
              >
                →
              </button>
            )}

            <div className="flex flex-col items-center max-w-6xl w-full">
              <img
                src={image.src}
                alt={image.alt}
                className="max-w-full max-h-[80vh] object-contain mb-4"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex items-center gap-4">
                {image.caption && (
                  <p className="text-white text-lg font-medium text-center bg-black/50 px-6 py-3 rounded-lg">
                    {image.caption}
                  </p>
                )}
                <p className="text-gray-500 text-sm">
                  {lightboxIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  )
}
