import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../auth';
import { useT } from '../i18n';
import { IconSprout, IconAlert, IconUser } from '../components/Icons';

export default function Auth({ mode }) {
  const { save } = useAuth();
  const { t } = useT();
  const reg = mode === 'register';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await api.post(reg ? '/auth/register' : '/auth/login', f);
      save(res.data);
    } catch (x) {
      setErr(errMsg(x));
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="auth-brand-logo mx-auto">
            <IconSprout size={28} />
          </div>
          <h1 className="h3 fw-bold mb-1">
            Agri<span style={{ color: 'var(--wheat)' }}>Tech</span>
          </h1>
          <p className="text-muted small mb-0">
            {reg
              ? 'Create a farmer account to manage your farm and crops'
              : 'Log in to monitor farms, live weather, and community alerts'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="d-flex p-1 bg-light rounded-3 mb-4">
          <Link
            to="/"
            className={`btn btn-sm flex-fill fw-bold py-2 ${!reg ? 'bg-white shadow-sm text-success' : 'text-muted border-0'}`}
          >
            {t('Log in')}
          </Link>
          <Link
            to="/register"
            className={`btn btn-sm flex-fill fw-bold py-2 ${reg ? 'bg-white shadow-sm text-success' : 'text-muted border-0'}`}
          >
            {t('Register')}
          </Link>
        </div>

        <form onSubmit={submit}>
          {reg && (
            <div className="mb-3">
              <label className="form-label" htmlFor="name-input">
                {t('Name')}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <IconUser size={16} />
                </span>
                <input
                  id="name-input"
                  className="form-control"
                  placeholder="e.g. Ramesh Patel"
                  required
                  value={f.name}
                  onChange={set('name')}
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label" htmlFor="email-input">
              {t('Email')}
            </label>
            <input
              id="email-input"
              type="email"
              className="form-control"
              placeholder="farmer@agritech.com"
              required
              value={f.email}
              onChange={set('email')}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password-input">
              {t('Password')}
            </label>
            <input
              id="password-input"
              type="password"
              minLength={8}
              className="form-control"
              placeholder="Minimum 8 characters"
              required
              value={f.password}
              onChange={set('password')}
            />
          </div>

          {err && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-3" role="alert">
              <IconAlert size={16} className="flex-shrink-0" />
              <span>{err}</span>
            </div>
          )}

          <button className="btn btn-field w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-4" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
            <span>{reg ? t('Register') : t('Log in')}</span>
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top small text-muted">
          {reg ? (
            <>
              Already have an account?{' '}
              <Link to="/" className="fw-bold text-success text-decoration-none">
                {t('Log in')}
              </Link>
            </>
          ) : (
            <>
              New to AgriTech?{' '}
              <Link to="/register" className="fw-bold text-success text-decoration-none">
                {t('Register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
