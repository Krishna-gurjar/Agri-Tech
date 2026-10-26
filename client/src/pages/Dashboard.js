import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../auth';
import { useT } from '../i18n';
import {
  IconFarms,
  IconCrops,
  IconAlert,
  IconWeather,
  IconMarket,
  IconCheck,
  IconPlus
} from '../components/Icons';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useT();
  const [d, setD] = useState({ farms: [], crops: [], alerts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/farms'),
      api.get('/crops'),
      api.get('/posts?type=pestAlert')
    ])
      .then(([f, c, a]) => {
        setD({ farms: f.data, crops: c.data, alerts: a.data });
      })
      .finally(() => setLoading(false));
  }, []);

  const growing = d.crops.filter(c => c.status === 'growing');
  const weak = d.crops.filter(
    c => c.soil && Object.keys(c.soil).length && c.analysis?.rating === 'Poor'
  );

  const stats = [
    {
      num: d.farms.length,
      label: t('Farms'),
      sub: 'Managed plots & fields',
      to: '/farms',
      icon: IconFarms,
      color: 'green'
    },
    {
      num: growing.length,
      label: 'Crops growing',
      sub: `${d.crops.length} total crops recorded`,
      to: '/crops',
      icon: IconCrops,
      color: 'blue'
    },
    {
      num: weak.length,
      label: 'Fields needing soil care',
      sub: weak.length === 0 ? 'All soils healthy' : 'Immediate care required',
      to: '/crops',
      icon: IconAlert,
      color: weak.length > 0 ? 'rose' : 'amber'
    }
  ];

  return (
    <>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Hello, {user.name}</h1>
          <div className="page-header-sub">
            Overview of your agricultural operations, active crops, and real-time advisory.
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/farms" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
            <IconPlus size={15} />
            <span>{t('Add farm')}</span>
          </Link>
          <Link to="/crops" className="btn btn-sm btn-field d-flex align-items-center gap-1">
            <IconPlus size={15} />
            <span>{t('Add crop')}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        {stats.map(({ num, label, sub, to, icon: IconComponent, color }) => (
          <div key={label} className="col-12 col-md-4">
            <Link to={to} className="metric-card text-decoration-none">
              <div className="metric-card-top">
                <div>
                  <div className="metric">{loading ? '…' : num}</div>
                  <div className="metric-label">{label}</div>
                  <div className="metric-sub">{sub}</div>
                </div>
                <div className={`metric-icon-wrap ${color}`}>
                  <IconComponent size={22} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pest Alerts & Advisory */}
      <div className="panel mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="metric-icon-wrap amber" style={{ width: 34, height: 34 }}>
              <IconAlert size={18} />
            </div>
            <div>
              <h2 className="h5 mb-0">{t('Pest alerts')}</h2>
              <span className="text-muted small">Advisories & warnings from agricultural experts</span>
            </div>
          </div>
          {d.alerts.length > 0 && (
            <span className="badge bg-warning text-dark px-2 py-1 rounded-pill small">
              {d.alerts.length} active
            </span>
          )}
        </div>

        {d.alerts.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {d.alerts.slice(0, 4).map(p => (
              <div key={p._id} className="alertbox alert-warning-soft">
                <IconAlert size={18} className="flex-shrink-0 mt-1" />
                <div>
                  <div className="fw-bold">{p.title}</div>
                  <div>{p.body}</div>
                  {p.createdAt && (
                    <div className="small text-muted mt-1">
                      Posted {p.createdAt.slice(0, 10)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-3 bg-light text-muted d-flex align-items-center gap-3">
            <div className="text-success">
              <IconCheck size={24} />
            </div>
            <div>
              <div className="fw-bold text-dark">No active pest alerts</div>
              <div className="small">
                Your region looks clear. Keep an eye on <Link to="/weather" className="fw-semibold text-success">the weather forecast</Link> for rainfall and humidity advisories.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="panel h-100 d-flex flex-column justify-content-between mb-0">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="metric-icon-wrap blue" style={{ width: 32, height: 32 }}>
                  <IconWeather size={17} />
                </div>
                <h3 className="h6 mb-0">Weather Forecast</h3>
              </div>
              <p className="text-muted small mb-3">
                Check 7-day temperature, wind speed, precipitation, and rain probability for your farm coordinates.
              </p>
            </div>
            <Link to="/weather" className="btn btn-sm btn-outline-secondary align-self-start">
              View Forecast →
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="panel h-100 d-flex flex-column justify-content-between mb-0">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="metric-icon-wrap green" style={{ width: 32, height: 32 }}>
                  <IconMarket size={17} />
                </div>
                <h3 className="h6 mb-0">Agri Marketplace</h3>
              </div>
              <p className="text-muted small mb-3">
                Browse verified seeds, fertilizers, pesticides, and tools directly shipped to your village.
              </p>
            </div>
            <Link to="/market" className="btn btn-sm btn-outline-secondary align-self-start">
              Browse Supplies →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
