import type { BcMapData } from './bc-map.schema'

export function BcMap({ title, query, height = 500 }: BcMapData) {
  const encodedQuery = encodeURIComponent(query)

  return (
    <section
      id="map"
      data-ui-id="section-bc-map"
      data-ui-component="bc-map"
      data-ui-role="map"
      className="bg-background text-foreground"
    >
      {title && (
        <h2 className="sr-only">{title}</h2>
      )}
      <iframe
        title={title ?? 'Térkép'}
        src={`https://www.google.com/maps?q=${encodedQuery}&output=embed`}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  )
}
