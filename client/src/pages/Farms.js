import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useT } from '../i18n';
import {
  IconFarms,
  IconPin,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlert,
  IconCheck
} from '../components/Icons';

const blank = { name: '', village: '', lat: '', lon: '', areaAcres: 1, soilType: 'loamy' };

export default function Farms() {
  const { t } = useT();
  const [list, setList] = useState([]);
  const [f, setF] = useState(blank);
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const [locating, setLocating] = useState(false);

  const load = useCallback(() => api.get('/farms').then(r => setList(r.data)), []);

  useEffect(() => {
    load();
  }, [load]);

  const set = k => e => setF({ ...f, [k]: e.target.value });

  const locate = () => {
    if (!navigator.geolocation) {
      setErr('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      p => {
        setLocating(false);
        setF(x => ({
          ...x,
          lat: +p.coords.latitude.toFixed(4),
          lon: +p.coords.longitude.toFixed(4)
        }));
      },
      () => {
        setLocating(false);
        setErr('Location permission blocked. Please enter coordinates manually.');
      }
    );
  };

  const submit = async e => {
    e.preventDefault();
    setErr('');
    try {
      await (edit ? api.put('/farms/' + edit, f) : api.post('/farms', f));
      setF(blank);
      setEdit(null);
      load();
    } catch (x) {
      setErr(errMsg(x));
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t('Farms')}</h1>
          <div className="page-header-sub">
            Register and monitor your agricultural properties, coordinates, and soil classifications.
          </div>
        </div>
        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
          {list.length} {list.length === 1 ? 'Farm' : 'Farms'} Registered
        </span>
      </div>

      {/* Farm Form */}
      <div className="panel mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="metric-icon-wrap green" style={{ width: 34, height: 34 }}>
              {edit ? <IconEdit size={17} /> : <IconPlus size={17} />}
            </div>
            <div>
              <h2 className="h5 mb-0">{edit ? 'Edit Farm Details' : t('Add farm')}</h2>
              <span className="text-muted small">Enter boundaries, location coordinates, and soil baseline</span>
            </div>
          </div>
          {edit && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setEdit(null);
                setF(blank);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form className="row g-3" onSubmit={submit}>
          <div className="col-12 col-md-6">
            <label className="form-label">Farm name *</label>
            <input
              className="form-control"
              placeholder="e.g. Green Valley Plot A"
              required
              value={f.name}
              onChange={set('name')}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Village / District</label>
            <input
              className="form-control"
              placeholder="e.g. Nashik, Maharashtra"
              value={f.village || ''}
              onChange={set('village')}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Latitude *</label>
            <input
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 19.9975"
              required
              value={f.lat}
              onChange={set('lat')}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Longitude *</label>
            <input
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 73.7898"
              required
              value={f.lon}
              onChange={set('lon')}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Area (acres)</label>
            <input
              type="number"
              step="any"
              min="0"
              className="form-control"
              value={f.areaAcres}
              onChange={set('areaAcres')}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label">Soil type</label>
            <select className="form-select text-capitalize" value={f.soilType} onChange={set('soilType')}>
              {['alluvial', 'black', 'red', 'laterite', 'sandy', 'loamy'].map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {err && (
            <div className="col-12">
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-0" role="alert">
                <IconAlert size={16} className="flex-shrink-0" />
                <span>{err}</span>
              </div>
            </div>
          )}

          <div className="col-12 d-flex flex-wrap gap-2 pt-2">
            <button className="btn btn-field d-flex align-items-center gap-2">
              {edit ? <IconCheck size={16} /> : <IconPlus size={16} />}
              <span>{edit ? t('Save') : t('Add farm')}</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={locate}
              disabled={locating}
            >
              <IconPin size={16} />
              <span>{locating ? 'Detecting coordinates…' : 'Use my current location'}</span>
            </button>
            {edit && (
              <button
                type="button"
                className="btn btn-link text-muted"
                onClick={() => {
                  setEdit(null);
                  setF(blank);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Farms List */}
      <h2 className="h5 mb-3">Registered Farms ({list.length})</h2>

      {!list.length ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconFarms size={26} />
          </div>
          <div className="empty-state-title">No farms added yet</div>
          <p className="empty-state-desc">
            Add your first farm using the form above to unlock automated 7-day weather forecasting, soil health tracking, and crop management.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {list.map(x => (
            <div key={x._id} className="col-12">
              <div className="panel d-flex justify-content-between align-items-center flex-wrap gap-3 mb-0">
                <div className="d-flex align-items-start gap-3">
                  <div className="metric-icon-wrap green flex-shrink-0" style={{ width: 42, height: 42 }}>
                    <IconFarms size={22} />
                  </div>
                  <div>
                    <h3 className="h6 fw-bold mb-1">{x.name}</h3>
                    <div className="d-flex flex-wrap align-items-center gap-2 text-muted small">
                      {x.village && (
                        <span className="d-inline-flex align-items-center gap-1">
                          <IconPin size={13} />
                          {x.village}
                        </span>
                      )}
                      <span className="badge-soft">{x.areaAcres} {x.areaAcres === 1 ? 'acre' : 'acres'}</span>
                      <span className="badge-soft text-capitalize">{x.soilType} soil</span>
                      <span className="text-secondary">({x.lat}, {x.lon})</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => {
                      setEdit(x._id);
                      setF(x);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <IconEdit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    onClick={async () => {
                      if (window.confirm(`Delete "${x.name}"? This will also remove associated crop data.`)) {
                        await api.delete('/farms/' + x._id);
                        load();
                      }
                    }}
                  >
                    <IconTrash size={14} />
                    <span>{t('Delete')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
