import { cn } from '@spektra/components'
import { Wrench, DollarSign, AlertCircle, type LucideIcon } from 'lucide-react'
import type { BcServicesData } from './bc-services.schema'

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  DollarSign,
  AlertCircle,
}

export function BcServices({ title, subtitle, services }: BcServicesData) {
  return (
    <section
      id="services"
      data-ui-id="section-bc-services"
      data-ui-component="bc-services"
      data-ui-role="service-list"
      className="bg-background text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {subtitle && (
            <p className="text-muted-foreground font-semibold text-lg mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.icon]
            return (
              <div
                key={service.title}
                className={cn(
                  'p-8 rounded-2xl border border-border',
                  'bg-muted/50 hover:bg-muted transition-colors',
                  'text-center',
                )}
              >
                {Icon && (
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
