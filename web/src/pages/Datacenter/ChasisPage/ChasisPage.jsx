import { Link, routes, useParams } from '@redwoodjs/router'
import './ChasisPage.css'

const chasisData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `CH-${String(i + 1).padStart(2, '0')}`,
  status: ['active', 'maintenance'][i % 2],
  load: Math.floor(Math.random() * 100),
  temp: 24 + i,
}))

const ChasisPage = () => {
  const { id } = useParams()

  return (
    <div className="tech-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="datacenter-title">
            <span className="datacenter-id">DC-{id}</span>
            <span className="datacenter-status active">
              <div className="status-pulse"></div>
              Operational
            </span>
          </h1>
          <Link
            to={routes.servidoresFisicos({ id })}
            className="nav-button physical"
          >
            <div className="button-glow"></div>
            <span>SERVIDORES FISICOS</span>
            <div className="node-stats">
              <span>28 Nodes Online</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="cluster-metrics">
          <div className="metric-card health">
            <h3>Cluster Health</h3>
            <div className="metric-value">94%</div>
            <div className="health-bar">
              <div className="health-progress"></div>
            </div>
          </div>

          <div className="metric-card temperature">
            <h3>Ambient Temperature</h3>
            <div className="metric-value">23.5°C</div>
            <div className="temp-gauge">
              <div className="temp-range"></div>
            </div>
          </div>
        </div>

        <div className="chasis-grid">
          {chasisData.map((chasis) => (
            <Link
              key={chasis.id}
              to={routes.blades({ id, chasisId: chasis.id })}
              className={`chasis-card ${chasis.status}`}
            >
              <div className="card-hover"></div>
              <div className="card-content">
                <div className="card-header">
                  <h2>{chasis.name}</h2>
                  <div className={`status-led ${chasis.status}`}></div>
                </div>

                <div className="card-metrics">
                  <div className="metric">
                    <label>Load</label>
                    <div className="load-bar">
                      <div
                        className="load-progress"
                        style={{ width: `${chasis.load}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="metric">
                    <label>Temperature</label>
                    <div className="temp-indicator">
                      <div className="temp-fill" style={{ width: `${(chasis.temp/50)*100}%` }}></div>
                      <span>{chasis.temp}°C</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="virtual-label">Virtual Node</span>
                  <div className="activity-indicator">
                    <div className="activity-pulse"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ChasisPage
