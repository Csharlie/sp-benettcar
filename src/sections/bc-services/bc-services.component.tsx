import {
  AlertCircle,
  AlertTriangle,
  Battery,
  Car,
  CircleDollarSign,
  Gauge,
  Settings,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { BcServicesData } from './bc-services.schema'

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Car,
  AlertCircle,
  AlertTriangle,
  Battery,
  Gauge,
  Settings,
  ShieldCheck,
  CircleDollarSign,
}

const iconAliases: Record<string, keyof typeof iconMap> = {
  wrench: 'Wrench',
  car: 'Car',
  alertcircle: 'AlertCircle',
  'alert-circle': 'AlertCircle',
  alerttriangle: 'AlertTriangle',
  'alert-triangle': 'AlertTriangle',
  battery: 'Battery',
  gauge: 'Gauge',
  settings: 'Settings',
  shieldcheck: 'ShieldCheck',
  'shield-check': 'ShieldCheck',
  circledollarsign: 'CircleDollarSign',
  'circle-dollar-sign': 'CircleDollarSign',
  dollarsign: 'CircleDollarSign',
  'dollar-sign': 'CircleDollarSign',
}

function resolveServiceIcon(iconName: string): LucideIcon {
  if (iconMap[iconName]) return iconMap[iconName]
  const normalized = iconName.trim().toLowerCase()
  const alias = iconAliases[normalized]
  return alias ? iconMap[alias] : Wrench
}

export function BcServices({ title, subtitle, services }: BcServicesData) {
  return (
    <section
      id="services"
      data-ui-id="section-bc-services"
      data-ui-component="bc-services"
      data-ui-role="features-section"
      className="bg-graphite-900 py-24"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          {subtitle && (
            <p
              data-ui-id="services-subtitle"
              data-ui-role="section-subtitle"
              className="text-sm font-medium text-neon-blue uppercase tracking-wider mb-3"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="services-title"
            data-ui-role="section-title"
            className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight"
          >
            {title}
          </h2>
        </div>

        <div
          data-ui-id="services-grid"
          data-ui-role="feature-grid"
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = resolveServiceIcon(service.icon)
            return (
              <div
                key={service.title}
                data-ui-id={`service-card-${index}`}
                data-ui-role="feature-card"
                className="relative overflow-hidden bg-graphite-850 border border-graphite-800 p-8 rounded-lg hover:border-neon-blue/30 transition-colors group"
              >
                {/* Background icon — top-left, large, faded */}
                <div className="absolute -top-4 -left-4 opacity-10 group-hover:opacity-15 transition-opacity">
                  <Icon className="w-32 h-32 text-neon-blue" />
                </div>
                {/* Foreground content */}
                <div className="relative z-10">
                  <h3
                    data-ui-id={`services-item-title-${index}`}
                    data-ui-role="item-title"
                    className="text-2xl font-semibold text-white mb-6"
                  >
                    {service.title}
                  </h3>
                  <p
                    data-ui-id={`services-item-desc-${index}`}
                    data-ui-role="item-description"
                    className="text-gray-400 leading-relaxed mb-4"
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
