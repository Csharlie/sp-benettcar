import { NavigationBar } from '@spektra/components'
import type { LayoutShellProps } from '@spektra/layouts'
import bcLogo from '../assets/bc-logo-128.png'

/**
 * Benettcar header — maps SiteData to NavigationBar props.
 * DI bridge: a LandingTemplate siteData-t injektál, mi rendereljük a komponenst.
 */
export function AppHeader({ siteData }: LayoutShellProps) {
  const links = siteData.navigation.primary.map((item) => ({
    label: item.label,
    href: item.href,
    onClick: () => {
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
    },
  }))

  return (
    <NavigationBar
      logo={bcLogo}
      logoText={siteData.site.name}
      logoClassName=""
      onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      links={links}
      cta={{
        text: 'Kapcsolat',
        onClick: () => {
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
        },
      }}
      variant="transparent"
      className="py-6 bg-black/60 backdrop-blur-md border-transparent"
    />
  )
}
