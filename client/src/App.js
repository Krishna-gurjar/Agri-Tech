import { lazy, Suspense, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import { LANGS, useT } from './i18n';
import {
  IconSprout,
  IconDashboard,
  IconFarms,
  IconCrops,
  IconWeather,
  IconMarket,
  IconCommunity,
  IconAdmin,
  IconLogout,
  IconGlobe
} from './components/Icons';

const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Farms = lazy(() => import('./pages/Farms'));
const Crops = lazy(() => import('./pages/Crops'));
const Weather = lazy(() => import('./pages/Weather'));
const Market = lazy(() => import('./pages/Market'));
const Community = lazy(() => import('./pages/Community'));
const Admin = lazy(() => import('./pages/Admin'));

function LoadingScreen() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-muted" style={{ minHeight: '40vh' }}>
      <div className="spinner-border text-success mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="fw-semibold small mb-0">Loading farm data…</p>
    </div>
  );
}

export default function App() {
  const { user, ready, logout } = useAuth();
  const { t, lang, setLang } = useT();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="*" element={<Auth mode="login" />} />
        </Routes>
      </Suspense>
    );
  }

  const navItems = [
    { to: '/', label: 'Dashboard', icon: IconDashboard },
    { to: '/farms', label: 'Farms', icon: IconFarms },
    { to: '/crops', label: 'Crops', icon: IconCrops },
    { to: '/weather', label: 'Weather', icon: IconWeather },
    { to: '/market', label: 'Market', icon: IconMarket },
    { to: '/community', label: 'Community', icon: IconCommunity },
    ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: IconAdmin }] : [])
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'F';

  return (
    <div className="shell">
      {/* Mobile Top Header */}
      <div className="mobile-topbar">
        <div className="d-flex align-items-center gap-2">
          <div className="brand-icon" style={{ width: 30, height: 30, borderRadius: 8, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconSprout size={18} />
          </div>
          <span className="fw-bold fs-5 text-white">Agri<span style={{ color: 'var(--wheat)' }}>Tech</span></span>
        </div>
        <button
          className="mobile-nav-toggle"
          aria-label="Toggle Navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* Main Sidebar Navigation */}
      <nav className={`rail ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main">
        <div className="brand-wrap">
          <div className="brand-icon">
            <IconSprout size={22} />
          </div>
          <div>
            <div className="brand">Agri<span>Tech</span></div>
            <div className="brand-tagline">Smart Farm OS</div>
          </div>
        </div>

        <div className="nav-section-title">Navigation</div>
        {navItems.map(({ to, label, icon: IconComponent }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={handleNavClick}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <IconComponent size={19} className="nav-icon" />
            <span>{t(label)}</span>
          </NavLink>
        ))}

        <div className="spacer" />

        {/* User Profile Card */}
        <div className="rail-user-profile">
          <div className="rail-avatar">{userInitial}</div>
          <div className="rail-user-meta">
            <div className="rail-user-name" title={user.name}>{user.name}</div>
            <div className="rail-user-role">{user.role === 'admin' ? 'Farm Admin' : 'Farmer'}</div>
          </div>
        </div>

        {/* Language & Logout Controls */}
        <div className="rail-footer-controls">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-transparent border-0 text-white-50 px-1">
              <IconGlobe size={16} />
            </span>
            <select
              className="form-select form-select-sm rail-lang-select"
              aria-label="Language"
              value={lang}
              onChange={e => setLang(e.target.value)}
            >
              {Object.entries(LANGS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <button className="rail-logout-btn" onClick={logout}>
            <IconLogout size={16} />
            <span>{t('Log out')}</span>
          </button>
        </div>
      </nav>

      {/* Main Content View */}
      <main>
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/market" element={<Market />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={user.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
