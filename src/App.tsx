import { useState } from 'react'
import { EvvEditTab } from './components/EvvEditTab'
import { EvvStateSummaryTable } from './components/EvvStateSummaryTable'
import { UsEvvMap } from './components/UsEvvMap'
import { EVV_CONFLUENCE_URL, EVV_LAST_UPDATED } from './data/evvByState'
import './App.css'

type MainTab = 'map-beta' | 'edit'

function App() {
  const [tab, setTab] = useState<MainTab>('map-beta')

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <h1 className="app-title">AlayaCare EVV — US state map</h1>
            <p className="app-subtitle">
              Hover states for aggregator status from the internal EVV guide. Data
              snapshot:{' '}
              <time dateTime={EVV_LAST_UPDATED}>{EVV_LAST_UPDATED}</time>.
            </p>
          </div>
          <a
            className="app-confluence-link"
            href={EVV_CONFLUENCE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Ultimate Guide to EVV (Confluence)
          </a>
        </div>
      </header>
      <div className="app-tabs-wrap">
        <div className="app-tabs-inner">
          <nav className="app-tabs" role="tablist" aria-label="Application views">
            <button
              type="button"
              role="tab"
              id="tab-map-beta"
              aria-selected={tab === 'map-beta'}
              aria-controls="panel-map-beta"
              tabIndex={tab === 'map-beta' ? 0 : -1}
              className={`app-tab ${tab === 'map-beta' ? 'app-tab-active' : ''}`}
              onClick={() => setTab('map-beta')}
            >
              Map &amp; Summary
            </button>
            <button
              type="button"
              role="tab"
              id="tab-edit"
              aria-selected={tab === 'edit'}
              aria-controls="panel-edit"
              tabIndex={tab === 'edit' ? 0 : -1}
              className={`app-tab ${tab === 'edit' ? 'app-tab-active' : ''}`}
              onClick={() => setTab('edit')}
            >
              Edit States (beta)
            </button>
          </nav>
        </div>
      </div>
      <main className="app-main">
        {tab === 'map-beta' ? (
          <div
            id="panel-map-beta"
            role="tabpanel"
            aria-labelledby="tab-map-beta"
            className="app-tab-panel"
          >
            <UsEvvMap variant="beta" />
            <EvvStateSummaryTable />
          </div>
        ) : (
          <div
            id="panel-edit"
            role="tabpanel"
            aria-labelledby="tab-edit"
            className="app-tab-panel"
          >
            <EvvEditTab />
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>
          Internal reference only. Guide data:{' '}
          <code className="inline-code">src/data/evvByState.ts</code>. Local edits
          use browser storage — see the Edit States (beta) tab.
        </p>
      </footer>
    </div>
  )
}

export default App
