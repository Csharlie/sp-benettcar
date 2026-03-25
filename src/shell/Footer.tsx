import { FooterBlock } from '@spektra/components'
import type { TemplateShellProps } from '@spektra/templates'

/**
 * Benettcar footer — maps SiteData to FooterBlock props.
 * A flat NavItem[] footer linkeket 3 csoportba rendezzük:
 * Szolgáltatások / Információ / Jogi.
 */
export function AppFooter({ siteData }: TemplateShellProps) {
  const footerLinks = siteData.navigation.footer ?? []

  return (
    <FooterBlock
      logoText={siteData.site.name}
      description={siteData.site.description ?? ''}
      sections={[
        {
          title: 'Szolgáltatások',
          links: footerLinks
            .filter((l) => l.href === '#car-service' || l.href === '#roadside')
            .map((l) => ({ label: l.label, href: l.href })),
        },
        {
          title: 'Információ',
          links: footerLinks
            .filter((l) => l.href === '#about' || l.href === '#contact')
            .map((l) => ({ label: l.label, href: l.href })),
        },
        {
          title: 'Jogi',
          links: footerLinks
            .filter((l) => l.href === '#privacy' || l.href === '#terms')
            .map((l) => ({ label: l.label, href: l.href })),
        },
      ]}
      copyright={`\u00a9 ${new Date().getFullYear()} ${siteData.site.name}. Minden jog fenntartva.`}
      colorScheme="dark"
    />
  )
}
