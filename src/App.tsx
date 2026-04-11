import { SiteDataProvider } from '@spektra/runtime'
import { LandingTemplate } from '@spektra/layouts'
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
        error={(error) => (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <p className="text-destructive font-semibold mb-2">A tartalom nem elérhető</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        )}
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
