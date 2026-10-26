import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import api, { errMsg } from '../api';
import { useT } from '../i18n';
import {
  IconWeather,
  IconTemp,
  IconHumidity,
  IconWind,
  IconRain,
  IconAlert,
  IconCheck,
  IconPlus
} from '../components/Icons';

export default function Weather() {
  const { t } = useT();
  const [farms, setFarms] = useState([]);
  const [id, setId] = useState('');
  const [w, setW] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/farms').then(r => {
      setFarms(r.data);
      if (r.data[0]) setId(r.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    setW(null);
    setErr('');
    setLoading(true);
    api
      .get('/weather/' + id)
      .then(r => setW(r.data))
      .catch(e => setErr(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (!farms.length) {
    return (
      <>
        <div className="page-header">
          <div>
            <h1>{t('Weather')}</h1>
            <div className="page-header-sub">Hyperlocal agricultural meteorological forecast</div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconWeather size={26} />
          </div>
          <div className="empty-state-title">No Farms Available</div>
          <p className="empty-state-desc">
            Add a farm with GPS coordinates to unlock real-time weather analytics and 7-day precipitation forecasts.
          </p>
          <Link to="/farms" className="btn btn-field d-inline-flex align-items-center gap-2">
            <IconPlus size={16} />
            <span>{t('Add farm')}</span>
          </Link>
        </div>
      </>
    );
  }

  const selectedFarm = farms.find(f => f._id === id);
  const rows = w?.daily?.time?.map((d, i) => ({
    day: d.slice(5),
    max: w.daily.temperature_2m_max[i],
    min: w.daily.temperature_2m_min[i],
    rain: w.daily.precipitation_sum[i]
  }));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t('Weather')}</h1>
          <div className="page-header-sub">
            Real-time conditions, 7-day agrometeorological projections, and risk advisories.
          </div>
        </div>

        {/* Farm Selector Pill */}
        <div className="d-flex align-items-center gap-2">
          <span className="small fw-bold text-muted d-none d-sm-inline">Farm Location:</span>
          <select
            className="form-select form-select-sm"
            style={{ minWidth: 220 }}
            aria-label={t('Select a farm')}
            value={id}
            onChange={e => setId(e.target.value)}
          >
            {farms.map(f => (
              <option key={f._id} value={f._id}>
                {f.name} {f.village ? `(${f.village})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <IconAlert size={18} />
          <span>{err}</span>
        </div>
      )}

      {loading && (
        <div className="panel text-center py-5">
          <div className="spinner-border text-success mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="text-muted fw-semibold">Fetching hyperlocal forecast for {selectedFarm?.name}…</div>
        </div>
      )}

      {w && (
        <>
          {/* Current Conditions Card */}
          <div className="weather-hero-card">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 pb-2 border-bottom border-light border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <IconWeather size={24} className="text-warning" />
                <span className="h5 mb-0 text-white fw-bold">Current Field Conditions</span>
              </div>
              <span className="badge bg-white bg-opacity-20 text-white px-3 py-1 rounded-pill small">
                {selectedFarm?.name} ({selectedFarm?.lat}, {selectedFarm?.lon})
              </span>
            </div>

            <div className="row text-center g-3">
              <div className="col-6 col-md-3 weather-stat-cell">
                <div className="d-flex justify-content-center mb-1 text-warning">
                  <IconTemp size={26} />
                </div>
                <div className="metric">{w.current.temperature_2m}°C</div>
                <div className="weather-label">Temperature</div>
              </div>

              <div className="col-6 col-md-3 weather-stat-cell">
                <div className="d-flex justify-content-center mb-1 text-info">
                  <IconHumidity size={26} />
                </div>
                <div className="metric">{w.current.relative_humidity_2m}%</div>
                <div className="weather-label">Humidity</div>
              </div>

              <div className="col-6 col-md-3 weather-stat-cell">
                <div className="d-flex justify-content-center mb-1" style={{ color: '#6ee7b7' }}>
                  <IconWind size={26} />
                </div>
                <div className="metric">{w.current.wind_speed_10m}</div>
                <div className="weather-label">Wind km/h</div>
              </div>

              <div className="col-6 col-md-3 weather-stat-cell">
                <div className="d-flex justify-content-center mb-1" style={{ color: '#93c5fd' }}>
                  <IconRain size={26} />
                </div>
                <div className="metric">{w.current.precipitation}</div>
                <div className="weather-label">Rain mm</div>
              </div>
            </div>
          </div>

          {/* Advisories & Risks */}
          <div className="panel mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="metric-icon-wrap amber" style={{ width: 34, height: 34 }}>
                <IconAlert size={18} />
              </div>
              <div>
                <h2 className="h5 mb-0">{t('Alerts')} & Weather Hazards</h2>
                <span className="text-muted small">Automatic risks calculated based on temperature and precipitation thresholds</span>
              </div>
            </div>

            {w.alerts && w.alerts.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {w.alerts.map((a, i) => (
                  <div key={i} className={`alertbox alert-${a.level}-soft`}>
                    <IconAlert size={18} className="flex-shrink-0 mt-1" />
                    <div>
                      <strong className="d-block">{a.day}</strong>
                      <span>{a.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-3 bg-light text-muted d-flex align-items-center gap-3">
                <div className="text-success">
                  <IconCheck size={22} />
                </div>
                <div>
                  <span className="fw-bold text-dark">Optimal Conditions Ahead</span>
                  <div className="small">No high heat waves, heavy storms, or frost risks forecast in the next 7 days.</div>
                </div>
              </div>
            )}

            {w.expertAlerts && w.expertAlerts.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <h3 className="h6 fw-bold text-secondary mb-2">{t('Pest alerts')} in this zone:</h3>
                <div className="d-flex flex-column gap-2">
                  {w.expertAlerts.map(p => (
                    <div key={p._id} className="alertbox alert-warning-soft">
                      <IconAlert size={18} className="flex-shrink-0 mt-1" />
                      <div>
                        <strong>{p.title}:</strong> {p.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Temperature Forecast Chart */}
          <div className="panel mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="h5 mb-0">7-Day Temperature Range (°C)</h2>
                <span className="text-muted small">Daily maximum and minimum temperatures</span>
              </div>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      border: '1px solid #cbd5e1'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#ea580c' }}
                    activeDot={{ r: 6 }}
                    name="High Temp (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="min"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284c7' }}
                    activeDot={{ r: 6 }}
                    name="Low Temp (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rainfall Chart */}
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="h5 mb-0">Expected Precipitation (mm)</h2>
                <span className="text-muted small">Daily anticipated rainfall sum</span>
              </div>
            </div>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      border: '1px solid #cbd5e1'
                    }}
                  />
                  <Bar
                    dataKey="rain"
                    fill="#166534"
                    radius={[6, 6, 0, 0]}
                    name="Rainfall (mm)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
