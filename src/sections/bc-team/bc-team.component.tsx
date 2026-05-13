import { Phone, Mail } from 'lucide-react'
import type { BcTeamData } from './bc-team.schema'

export function BcTeam({ title, subtitle, description, members }: BcTeamData) {
  return (
    <section
      id="team"
      data-ui-id="section-bc-team"
      data-ui-component="bc-team"
      data-ui-role="team"
      className="bg-graphite-900 py-24 scroll-mt-16"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          {subtitle && (
            <p
              data-ui-id="team-subtitle"
              data-ui-role="section-subtitle"
              className="text-sm font-medium text-neon-blue uppercase tracking-wider mb-3"
            >
              {subtitle}
            </p>
          )}
          <h2
            data-ui-id="team-title"
            data-ui-role="section-title"
            className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight"
          >
            {title}
          </h2>
          {description && (
            <p
              data-ui-id="team-description"
              data-ui-role="section-description"
              className="text-lg text-gray-400 max-w-3xl mx-auto"
            >
              {description}
            </p>
          )}
        </div>

        <div className={members.length === 1 ? 'flex justify-center' : 'grid md:grid-cols-2 gap-12 max-w-5xl mx-auto'}>
          {members.map((member, index) => (
            <div
              key={member.name}
              data-ui-id={`team-member-${index}`}
              data-ui-role="team-member"
              className="flex flex-col md:flex-row md:items-start md:gap-6"
            >
              {/* Mobile: identity-first centered card */}
              <div className="md:hidden flex flex-col items-center text-center">
                {member.image && (
                  <img
                    src={member.image.src}
                    alt={member.image.alt}
                    className="w-28 h-28 rounded-full object-cover border-2 border-graphite-700 mb-5"
                    loading="lazy"
                  />
                )}
                <h3
                  data-ui-id={`team-member-name-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                  data-ui-role="item-title"
                  className="text-2xl font-bold text-white mb-1"
                >
                  {member.name}
                </h3>
                <p
                  data-ui-id={`team-member-role-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                  data-ui-role="item-description"
                  className="text-neon-blue text-sm font-medium mb-6"
                >
                  {member.role}
                </p>
                <div className="flex flex-col gap-3 w-full">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, '')}`}
                      data-ui-type="link"
                      data-ui-id={`team-phone-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                      data-ui-action="call"
                      data-ui-trigger="click"
                      className="flex items-center justify-center gap-2 bg-neon-blue hover:bg-neon-blue-light text-graphite-950 font-semibold py-3.5 px-6 rounded-lg transition-colors min-h-[44px]"
                    >
                      <Phone className="w-5 h-5" /> Hívás
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      data-ui-type="link"
                      data-ui-id={`team-email-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                      data-ui-action="email"
                      data-ui-trigger="click"
                      className="flex items-center justify-center gap-2 bg-graphite-800 hover:bg-graphite-700 text-white font-medium py-3.5 px-6 rounded-lg transition-colors border border-graphite-600 min-h-[44px]"
                    >
                      <Mail className="w-5 h-5" /> Email
                    </a>
                  )}
                </div>
              </div>

              {/* Desktop: Avatar + info layout */}
              <div className="hidden md:flex md:items-center md:gap-8">
                {member.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={member.image.src}
                      alt={member.image.alt}
                      className="w-56 h-56 rounded-full object-cover border-2 border-graphite-700"
                      loading="lazy"
                    />
                  </div>
                )}
                <div>
                  <h3
                    data-ui-id={`team-member-name-desktop-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                    data-ui-role="item-title"
                    className="text-3xl font-semibold text-white mb-1"
                  >
                    {member.name}
                  </h3>
                  <p
                    data-ui-id={`team-member-role-desktop-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                    data-ui-role="item-description"
                    className="text-neon-blue text-lg font-medium mb-4"
                  >
                    {member.role}
                  </p>
                  <div className="space-y-2">
                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/\s/g, '')}`}
                        data-ui-type="link"
                        data-ui-id={`team-phone-desktop-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                        data-ui-action="call"
                        data-ui-trigger="click"
                        className="flex items-center text-gray-400 hover:text-neon-blue transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-2" /> {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        data-ui-type="link"
                        data-ui-id={`team-email-desktop-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                        data-ui-action="email"
                        data-ui-trigger="click"
                        className="flex items-center text-gray-400 hover:text-neon-blue transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" /> {member.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
