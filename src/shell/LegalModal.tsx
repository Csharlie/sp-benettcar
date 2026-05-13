import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { LegalDocument } from '../data/legal'

interface LegalModalProps {
  doc: LegalDocument
  onClose: () => void
}

export function LegalModal({ doc, onClose }: LegalModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      data-ui-id="legal-modal-overlay"
      data-ui-role="modal-overlay"
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-ui-id="legal-modal"
        data-ui-role="modal"
        className="bg-graphite-900 border border-graphite-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-graphite-800 flex-shrink-0">
          <div>
            <h2
              data-ui-id="legal-modal-title"
              data-ui-role="modal-title"
              className="text-white font-semibold text-xl"
            >
              {doc.title}
            </h2>
            <p className="text-gray-500 text-xs mt-1">Utolsó frissítés: {doc.lastUpdated}</p>
          </div>
          <button
            type="button"
            data-ui-type="button"
            data-ui-id="legal-modal-close"
            data-ui-action="close"
            data-ui-trigger="click"
            onClick={onClose}
            aria-label="Bezárás"
            className="text-gray-400 hover:text-white transition-colors ml-4 flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-8 py-6 space-y-6">
          {doc.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-3">
                {section.heading}
              </h3>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-400 text-sm leading-relaxed mb-2">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
