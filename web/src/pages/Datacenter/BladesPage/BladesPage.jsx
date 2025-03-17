// src/pages/BladesPage/BladesPage.js
import { Link, routes, useParams } from '@redwoodjs/router'
import { Server, Cpu, Activity, Database } from 'react-feather'
import './BladesPage.css'

const bladesData = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `BL-0${i + 1}`,
  status: ['active', 'warning', 'inactive'][i % 3],
  cpu: Math.floor(Math.random() * 100),
  memory: Math.floor(Math.random() * 100),
}))

const BladesPage = () => {
  const { id, chasisId } = useParams()

  return (
    <div className="universal-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <Database size={28} className="header-icon" />
            <span>DC-{id}</span>
            <span className="divider">/</span>
            <Server size={28} className="header-icon" />
            <span>CH-{chasisId}</span>
          </h1>
          <div className="header-actions">
            <Link
              to={routes.servidoresPage({ id, chasisId, bladeId: 'new' })}
              className="action-button"
            >
              <Activity size={18} />
              <span>Manage Blades</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="universal-grid">
        {bladesData.map((blade) => (
          <Link
            key={blade.id}
            to={routes.servidoresPage({ id, chasisId, bladeId: blade.id })}
            className={`grid-card ${blade.status}`}
          >
            <div className="card-header">
              <Cpu className="card-icon" />
              <div className="card-status">
                <div className={`status-indicator ${blade.status}`}></div>
              </div>
            </div>

            <h3 className="card-title">{blade.name}</h3>

            <div className="card-metrics">
              <div className="metric">
                <span className="metric-label">CPU Load</span>
                <div className="metric-bar">
                  <div
                    className="metric-fill cpu"
                    style={{ width: `${blade.cpu}%` }}
                  ></div>
                </div>
              </div>

              <div className="metric">
                <span className="metric-label">Memory</span>
                <div className="metric-bar">
                  <div
                    className="metric-fill memory"
                    style={{ width: `${blade.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <span className="resource-tag">Virtual Resource</span>
              <span className="metric-value">{blade.cpu}%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BladesPage
