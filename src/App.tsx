import { SiteDataProvider } from '@spektra/runtime'
import { LandingTemplate } from '@spektra/templates'
import { registry } from './registry'
import { AppHeader, AppFooter } from './shell'
import { createAdapter } from './data/create-adapter'

const adapter = createAdapter()

export default function App() {
  return (
    <SiteDataProvider adapter={adapter}>
      <LandingTemplate
        registry={registry}
        header={AppHeader}
        footer={AppFooter}
        fallback={(type) => (
          <div className="p-8 text-center text-muted-foreground">
            Ismeretlen szekció: {type}
          </div>
        )}
        loading={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <p className="text-lg text-muted-foreground">Betöltés…</p>
          </div>
        }
      />
    </SiteDataProvider>
  )
}
