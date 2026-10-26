import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useT } from '../i18n';
import {
  IconCrops,
  IconFarms,
  IconPlus,
  IconTrash,
  IconAlert,
  IconSend,
  IconLayers
} from '../components/Icons';

const S = [
  ['ph', 'pH Level', '6.0 - 7.5'],
  ['n', 'N (kg/ha)', 'Nitrogen'],
  ['p', 'P (kg/ha)', 'Phosphorus'],
  ['k', 'K (kg/ha)', 'Potassium'],
  ['organicMatter', 'Organic C %', 'Carbon'],
  ['moisture', 'Moisture %', 'Water content']
];

export default function Crops() {
  const { t } = useT();
  const [farms, setFarms] = useState([]);
  const [list, setList] = useState([]);
  const [err, setErr] = useState('');
  const [f, setF] = useState({ farm: '', name: '', sownOn: '', soil: {} });
  const [note, setNote] = useState({});

  const load = useCallback(() => api.get('/crops').then(r => setList(r.data)), []);

  useEffect(() => {
    load();
    api.get('/farms').then(r => {
      setFarms(r.data);
      if (r.data[0]) {
        setF(x => ({ ...x, farm: r.data[0]._id }));
      }
    });
  }, [load]);

  const submit = async e => {
    e.preventDefault();
    setErr('');
    const soil = Object.fromEntries(
      Object.entries(f.soil)
        .filter(([, v]) => v !== '')
        .map(([k, v]) => [k, +v])
    );
    try {
      await api.post('/crops', { ...f, soil });
      setF(prev => ({ ...prev, name: '', sownOn: '', soil: {} }));
      load();
    } catch (x) {
      setErr(errMsg(x));
    }
  };

  if (!farms.length) {
    return (
      <>
        <div className="page-header">
          <div>
            <h1>{t('Crops')}</h1>
            <div className="page-header-sub">Track active crop lifecycles and soil health reports</div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconFarms size={26} />
          </div>
          <div className="empty-state-title">No Farms Available</div>
          <p className="empty-state-desc">
            You need to register at least one farm property before you can track crop cultivation and soil tests.
          </p>
          <Link to="/farms" className="btn btn-field d-inline-flex align-items-center gap-2">
            <IconPlus size={16} />
            <span>{t('Add farm')}</span>
          </Link>
        </div>
      </>
    );
  }

  const getStatusClass = status => {
    switch (status) {
      case 'growing':
        return 'badge-growing';
      case 'harvested':
        return 'badge-harvested';
      case 'failed':
        return 'badge-failed';
      default:
        return 'badge-soft';
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t('Crops')}</h1>
          <div className="page-header-sub">
            Monitor planting cycles, soil test analytics, and field log history.
          </div>
        </div>
        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
          {list.length} {list.length === 1 ? 'Crop' : 'Crops'} Tracked
        </span>
      </div>

      {/* Add Crop Form */}
      <div className="panel mb-4">
        <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
          <div className="metric-icon-wrap green" style={{ width: 34, height: 34 }}>
            <IconPlus size={18} />
          </div>
          <div>
            <h2 className="h5 mb-0">{t('Add crop')}</h2>
            <span className="text-muted small">Select the farm, assign crop variety, and enter soil parameters</span>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">Assigned Farm *</label>
              <select
                className="form-select"
                value={f.farm}
                onChange={e => setF({ ...f, farm: e.target.value })}
              >
                {farms.map(x => (
                  <option key={x._id} value={x._id}>
                    {x.name} {x.village ? `(${x.village})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Crop variety / Name *</label>
              <input
                className="form-control"
                placeholder="e.g. Wheat (Kundan), Cotton, Tomato"
                required
                value={f.name}
                onChange={e => setF({ ...f, name: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Sown on</label>
              <input
                type="date"
                className="form-control"
                value={f.sownOn}
                onChange={e => setF({ ...f, sownOn: e.target.value })}
              />
            </div>

            {/* Soil Health Inputs */}
            <div className="col-12 mt-4">
              <div className="p-3 rounded-3 bg-light border">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <IconLayers size={17} className="text-success" />
                  <span className="fw-bold text-dark">{t('Soil health')} test parameters (optional)</span>
                </div>
                <p className="text-muted small mb-3">
                  Enter laboratory or field sensor values to generate instant automated soil health ratings and expert fertilizer recommendations.
                </p>

                <div className="row g-2">
                  {S.map(([k, label, placeholder]) => (
                    <div key={k} className="col-6 col-md-2">
                      <label className="form-label small mb-1">{label}</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control form-control-sm"
                        placeholder={placeholder}
                        value={f.soil[k] ?? ''}
                        onChange={e =>
                          setF({
                            ...f,
                            soil: { ...f.soil, [k]: e.target.value }
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {err && (
              <div className="col-12">
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-0" role="alert">
                  <IconAlert size={16} className="flex-shrink-0" />
                  <span>{err}</span>
                </div>
              </div>
            )}

            <div className="col-12 pt-2">
              <button className="btn btn-field d-inline-flex align-items-center gap-2">
                <IconPlus size={16} />
                <span>{t('Add crop')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Crops List */}
      <h2 className="h5 mb-3">Active Plantings ({list.length})</h2>

      {!list.length ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconCrops size={26} />
          </div>
          <div className="empty-state-title">No crops recorded yet</div>
          <p className="empty-state-desc">
            Use the form above to record your current crop plantings, track cultivation dates, and monitor soil fertility.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {list.map(c => {
            const hasSoil = c.soil && Object.keys(c.soil).length > 0;
            const rating = c.analysis?.rating || 'Unknown';
            const ratingClass =
              rating === 'Good' || rating === 'Optimal'
                ? 'good'
                : rating === 'Fair' || rating === 'Moderate'
                ? 'fair'
                : 'poor';

            return (
              <div key={c._id} className="col-12">
                <div className="panel mb-0">
                  {/* Crop Header */}
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3 pb-2 border-bottom">
                    <div className="d-flex align-items-start gap-3">
                      <div className="metric-icon-wrap green" style={{ width: 44, height: 44 }}>
                        <IconCrops size={22} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h3 className="h5 fw-bold mb-0">{c.name}</h3>
                          <span className={`status-badge ${getStatusClass(c.status)}`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="text-muted small mt-1">
                          <span className="fw-semibold text-secondary">{c.farm?.name || 'Assigned Farm'}</span>
                          {c.sownOn && <span> · Sown on {c.sownOn.slice(0, 10)}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                        aria-label="Status"
                        value={c.status}
                        onChange={async e => {
                          await api.put('/crops/' + c._id, { status: e.target.value });
                          load();
                        }}
                      >
                        {['growing', 'harvested', 'failed'].map(s => (
                          <option key={s} value={s}>
                            Mark as {s}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                        onClick={async () => {
                          if (window.confirm(`Delete "${c.name}"?`)) {
                            await api.delete('/crops/' + c._id);
                            load();
                          }
                        }}
                      >
                        <IconTrash size={14} />
                        <span>{t('Delete')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Soil Analysis Report if available */}
                  {hasSoil && (
                    <div className="soil-score-box mb-3">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <IconLayers size={16} className="text-success" />
                          <span className="fw-bold">{t('Soil health')} Evaluation</span>
                        </div>
                        <span className={`soil-score-meter ${ratingClass}`}>
                          {rating} Condition ({c.analysis?.score ?? 0}/100)
                        </span>
                      </div>

                      {c.analysis?.advice && c.analysis.advice.length > 0 && (
                        <div className="mt-2">
                          <div className="small fw-bold text-secondary mb-1">Recommended Action Items:</div>
                          <ul className="mb-0 ps-3 small text-muted">
                            {c.analysis.advice.map((a, i) => (
                              <li key={i} className="mb-1">
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Logs & Activities Timeline */}
                  <div className="mb-3">
                    <div className="small fw-bold text-secondary mb-2">Recent Field Activity Log:</div>
                    {c.logs && c.logs.length > 0 ? (
                      <div className="timeline-list">
                        {c.logs.slice(-3).map(l => (
                          <div key={l._id} className="timeline-item">
                            <span className="fw-semibold text-dark">{l.at.slice(0, 10)}:</span>{' '}
                            <span className="text-secondary">{l.note}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="small text-muted fst-italic mb-2">No activity recorded yet for this crop.</div>
                    )}
                  </div>

                  {/* Add log input */}
                  <div className="input-group">
                    <input
                      className="form-control"
                      placeholder="Record field action (e.g. irrigated 2 hours, applied urea, weeded rows)…"
                      value={note[c._id] || ''}
                      onChange={e => setNote({ ...note, [c._id]: e.target.value })}
                      onKeyDown={async e => {
                        if (e.key === 'Enter' && note[c._id]) {
                          e.preventDefault();
                          await api.post(`/crops/${c._id}/logs`, { note: note[c._id] });
                          setNote({ ...note, [c._id]: '' });
                          load();
                        }
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={async () => {
                        if (!note[c._id]) return;
                        await api.post(`/crops/${c._id}/logs`, { note: note[c._id] });
                        setNote({ ...note, [c._id]: '' });
                        load();
                      }}
                    >
                      <IconSend size={15} />
                      <span>{t('Add')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
