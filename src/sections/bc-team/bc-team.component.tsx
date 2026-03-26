import { cn } from '@spektra/components'
import { Phone, Mail } from 'lucide-react'
import type { BcTeamData } from './bc-team.schema'

export function BcTeam({ title, subtitle, description, members }: BcTeamData) {
  return (
    <section
      id="team"
      data-ui-id="section-bc-team"
      data-ui-component="bc-team"
      data-ui-role="team"
      className="bg-background text-foreground py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {subtitle && (
            <p
              data-ui-id="team-subtitle"
              data-ui-role="section-subtitle"
              className="text-muted-foreground font-semibold text-lg mb-2"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="team-title"
            data-ui-role="section-title"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {title}
          </h2>
          {description && (
            <p
              data-ui-id="team-description"
              data-ui-role="section-description"
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {members.map((member) => (
            <div
              key={member.name}
              className={cn(
                'p-6 rounded-2xl border border-border',
                'bg-muted/50 text-center',
              )}
            >
              {member.image && (
                <img
                  src={member.image.src}
                  alt={member.image.alt}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  loading="lazy"
                />
              )}
              <h3
                data-ui-id={`team-member-name-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                data-ui-role="item-title"
                className="text-lg font-bold mb-1"
              >
                {member.name}
              </h3>
              <p
                data-ui-id={`team-member-role-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                data-ui-role="item-description"
                className="text-muted-foreground text-sm mb-4"
              >
                {member.role}
              </p>

              <div className="flex justify-center gap-4">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    data-ui-type="link"
                    data-ui-id={`team-phone-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                    data-ui-action="call"
                    data-ui-trigger="click"
                    className="text-muted-foreground hover:text-accent transition-colors"
                    aria-label={`${member.name} telefon`}
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    data-ui-type="link"
                    data-ui-id={`team-email-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                    data-ui-action="email"
                    data-ui-trigger="click"
                    className="text-muted-foreground hover:text-accent transition-colors"
                    aria-label={`${member.name} email`}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
