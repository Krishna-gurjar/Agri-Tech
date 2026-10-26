import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import {
  IconUser,
  IconFarms,
  IconCrops,
  IconBox,
  IconPlus,
  IconTrash,
  IconCheck
} from '../components/Icons';

const blank = { name: '', category: 'seed', price: '', stock: '', description: '' };

export default function Admin() {
  const [s, setS] = useState({});
  const [users, setUsers] = useState([]);
  const [res, setRes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    api.get('/admin/stats').then(r => setS(r.data));
    api.get('/admin/users').then(r => setUsers(r.data));
    api.get('/resources').then(r => setRes(r.data));
    api.get('/orders?all=1').then(r => setOrders(r.data));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async e => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      await api.post('/resources', f);
      setF(blank);
      load();
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setSubmitting(false);
    }
  };

  const statMetrics = [
    { key: 'users', label: 'Users', icon: IconUser, color: 'purple' },
    { key: 'farms', label: 'Farms', icon: IconFarms, color: 'green' },
    { key: 'crops', label: 'Crops', icon: IconCrops, color: 'blue' },
    { key: 'orders', label: 'Orders', icon: IconBox, color: 'amber' },
    { key: 'revenue', label: 'Revenue (₹)', icon: IconCheck, color: 'green', isCurr: true }
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <div className="page-header-sub">
            System overview, resource catalog management, order fulfillment, and user accounts.
          </div>
        </div>
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-bold">
          Administrator Console
        </span>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        {statMetrics.map(({ key, label, icon: IconComponent, color, isCurr }) => (
          <div key={key} className="col-6 col-md">
            <div className="metric-card p-3">
              <div className="metric-card-top mb-1">
                <div>
                  <div className="metric" style={{ fontSize: '1.75rem' }}>
                    {isCurr && s[key] !== undefined ? `₹${s[key]}` : s[key] ?? '–'}
                  </div>
                  <div className="metric-label" style={{ fontSize: '0.85rem' }}>
                    {label}
                  </div>
                </div>
                <div className={`metric-icon-wrap ${color}`} style={{ width: 36, height: 36 }}>
                  <IconComponent size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Approval & Status Tracking */}
      <div className="panel mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="metric-icon-wrap amber" style={{ width: 34, height: 34 }}>
              <IconBox size={18} />
            </div>
            <div>
              <h2 className="h5 mb-0">Customer Orders Fulfillment ({orders.length})</h2>
              <span className="text-muted small">Update status, approve processing, and track delivery stages</span>
            </div>
          </div>
        </div>

        {!orders.length ? (
          <div className="text-muted small py-3 text-center">No orders placed by customers yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Customer</th>
                  <th>Order Items</th>
                  <th>Total</th>
                  <th>Delivery Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="small">
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>
                      <div className="fw-bold text-dark">{o.user?.name || 'Customer'}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{o.user?.email}</div>
                    </td>
                    <td>
                      {o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}
                    </td>
                    <td className="fw-bold text-success">₹{o.total}</td>
                    <td className="text-muted" style={{ maxWidth: 200 }}>
                      <span className="text-truncate d-block">{o.address || 'Standard'}</span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm w-auto"
                        aria-label="Order status"
                        value={o.status}
                        onChange={async e => {
                          await api.patch(`/orders/${o._id}/status`, { status: e.target.value });
                          load();
                        }}
                      >
                        {['placed', 'approved', 'shipped', 'delivered', 'cancelled'].map(x => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resources Management */}
      <div className="panel mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="metric-icon-wrap green" style={{ width: 34, height: 34 }}>
              <IconPlus size={18} />
            </div>
            <div>
              <h2 className="h5 mb-0">Marketplace Resources & Catalog ({res.length})</h2>
              <span className="text-muted small">Add certified farm inputs for farmers to purchase</span>
            </div>
          </div>
        </div>

        <form className="row g-2 mb-4 p-3 bg-light rounded-3 border" onSubmit={add}>
          <div className="col-12 col-md-4">
            <label className="form-label small">Resource Name *</label>
            <input
              className="form-control form-control-sm"
              required
              placeholder="e.g. Urea 46% N (50kg)"
              value={f.name}
              onChange={e => setF({ ...f, name: e.target.value })}
            />
          </div>

          <div className="col-6 col-md-2">
            <label className="form-label small">Category</label>
            <select
              className="form-select form-select-sm text-capitalize"
              value={f.category}
              onChange={e => setF({ ...f, category: e.target.value })}
            >
              {['seed', 'fertilizer', 'pesticide', 'equipment'].map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <label className="form-label small">Price (₹) *</label>
            <input
              type="number"
              min="0"
              className="form-control form-control-sm"
              required
              placeholder="e.g. 450"
              value={f.price}
              onChange={e => setF({ ...f, price: e.target.value })}
            />
          </div>

          <div className="col-6 col-md-2">
            <label className="form-label small">Stock (Units) *</label>
            <input
              type="number"
              min="0"
              className="form-control form-control-sm"
              required
              placeholder="e.g. 100"
              value={f.stock}
              onChange={e => setF({ ...f, stock: e.target.value })}
            />
          </div>

          <div className="col-6 col-md-2 d-flex align-items-end">
            <button className="btn btn-field btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-1" disabled={submitting}>
              <IconPlus size={14} />
              <span>{submitting ? 'Adding…' : 'Add Item'}</span>
            </button>
          </div>

          {err && (
            <div className="col-12">
              <div className="alert alert-danger py-1 px-2 small mb-0">{err}</div>
            </div>
          )}
        </form>

        <div className="row g-2">
          {res.map(r => (
            <div key={r._id} className="col-12 col-md-6">
              <div className="p-2 px-3 border rounded-3 d-flex justify-content-between align-items-center bg-white">
                <div>
                  <div className="fw-bold text-dark">{r.name}</div>
                  <div className="small text-muted">
                    <span className="badge-soft text-capitalize me-2">{r.category}</span>
                    <span>₹{r.price}</span> · <span>{r.stock} in stock</span>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                  onClick={async () => {
                    if (window.confirm(`Delete ${r.name}?`)) {
                      await api.delete('/resources/' + r._id);
                      load();
                    }
                  }}
                >
                  <IconTrash size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Management */}
      <div className="panel">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="metric-icon-wrap purple" style={{ width: 34, height: 34 }}>
              <IconUser size={18} />
            </div>
            <div>
              <h2 className="h5 mb-0">Registered User Accounts ({users.length})</h2>
              <span className="text-muted small">View all registered farmers and platform admins</span>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light small">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="small">
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rail-avatar" style={{ width: 30, height: 30, fontSize: '0.8rem' }}>
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="fw-semibold text-dark">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{u.email}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        u.role === 'admin'
                          ? 'bg-danger-subtle text-danger border border-danger-subtle'
                          : 'bg-success-subtle text-success border border-success-subtle'
                      }`}
                    >
                      {u.role === 'admin' ? 'Administrator' : 'Farmer'}
                    </span>
                  </td>
                  <td className="text-end">
                    {u.role !== 'admin' && (
                      <button
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                        onClick={async () => {
                          if (window.confirm(`Delete user "${u.name}" and all their farms and crops?`)) {
                            await api.delete('/admin/users/' + u._id);
                            load();
                          }
                        }}
                      >
                        <IconTrash size={13} />
                        <span>Delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
