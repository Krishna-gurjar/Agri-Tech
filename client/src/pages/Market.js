import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useT } from '../i18n';
import {
  IconMarket,
  IconBox,
  IconCheck,
  IconPin,
  IconInfo
} from '../components/Icons';

export default function Market() {
  const { t } = useT();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCat, setFilterCat] = useState('all');

  const load = useCallback(() => {
    api.get('/resources').then(r => setItems(r.data));
    api.get('/orders').then(r => setOrders(r.data));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const lines = items.filter(i => cart[i._id] && cart[i._id] > 0);
  const total = lines.reduce((s, i) => s + i.price * cart[i._id], 0);

  const order = async () => {
    if (!address.trim()) {
      setMsg('Please enter a delivery address.');
      return;
    }
    setIsSubmitting(true);
    setMsg('');
    try {
      await api.post('/orders', {
        address,
        items: lines.map(i => ({ resource: i._id, qty: cart[i._id] }))
      });
      setCart({});
      setAddress('');
      setMsg('Order placed successfully! Check your order history below.');
      load();
    } catch (e) {
      setMsg(errMsg(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrderStatusBadge = status => {
    switch (status) {
      case 'placed':
        return 'badge-placed';
      case 'approved':
        return 'badge-approved';
      case 'shipped':
        return 'badge-shipped';
      case 'delivered':
        return 'badge-delivered';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-soft';
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];
  const displayedItems = filterCat === 'all' ? items : items.filter(i => i.category === filterCat);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t('Market')}</h1>
          <div className="page-header-sub">
            Order certified seeds, organic fertilizers, equipment, and crop protection materials.
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm text-capitalize ${filterCat === cat ? 'btn-field' : 'btn-outline-secondary'}`}
              onClick={() => setFilterCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="row g-3 mb-4">
        {!displayedItems.length && (
          <div className="col-12">
            <div className="empty-state">
              <div className="empty-state-icon">
                <IconBox size={26} />
              </div>
              <div className="empty-state-title">No resources available</div>
              <p className="empty-state-desc">Products will appear here once listed by administration.</p>
            </div>
          </div>
        )}

        {displayedItems.map(i => {
          const qty = cart[i._id] || 0;
          return (
            <div key={i._id} className="col-12 col-md-6 col-lg-4">
              <div className="product-card">
                <div>
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <span className="badge-soft text-uppercase">{i.category || 'general'}</span>
                    <span
                      className={`badge rounded-pill small ${
                        i.stock > 10 ? 'bg-success-subtle text-success' : i.stock > 0 ? 'bg-warning-subtle text-warning-emphasis' : 'bg-danger-subtle text-danger'
                      }`}
                    >
                      {i.stock > 0 ? `${i.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <h3 className="h6 fw-bold mb-1 text-dark">{i.name}</h3>
                  <p className="text-muted small mb-3 text-truncate-2" style={{ minHeight: '2.5rem' }}>
                    {i.description || 'Certified agricultural input for maximum crop yield and safety.'}
                  </p>
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Price per unit</div>
                    <div className="price-tag">₹{i.price}</div>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <button
                      className="stepper-btn"
                      aria-label="Decrease quantity"
                      disabled={qty === 0}
                      onClick={() => setCart({ ...cart, [i._id]: Math.max(0, qty - 1) })}
                    >
                      −
                    </button>
                    <span className="stepper-val">{qty}</span>
                    <button
                      className="stepper-btn"
                      aria-label="Increase quantity"
                      disabled={qty >= i.stock || i.stock <= 0}
                      onClick={() => setCart({ ...cart, [i._id]: qty + 1 })}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Cart Drawer/Card */}
      {lines.length > 0 && (
        <div className="panel border-success mb-4" style={{ backgroundColor: '#fafffb' }}>
          <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div className="metric-icon-wrap green" style={{ width: 32, height: 32 }}>
                <IconMarket size={18} />
              </div>
              <h2 className="h5 mb-0 fw-bold">{t('Cart')} Summary ({lines.length} items)</h2>
            </div>
            <button className="btn btn-sm btn-link text-danger" onClick={() => setCart({})}>
              Clear Cart
            </button>
          </div>

          <div className="table-responsive mb-3">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr className="text-muted small">
                  <th>Item</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(i => (
                  <tr key={i._id}>
                    <td className="fw-semibold text-dark">{i.name}</td>
                    <td className="text-center">{cart[i._id]}</td>
                    <td className="text-end text-muted">₹{i.price}</td>
                    <td className="text-end fw-bold text-success">₹{i.price * cart[i._id]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 border-top border-bottom mb-3">
            <span className="fs-5 fw-bold text-dark">{t('Total')} Amount</span>
            <span className="fs-4 fw-extrabold text-success">₹{total}</span>
          </div>

          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <IconPin size={16} />
                </span>
                <input
                  className="form-control"
                  placeholder="Enter full delivery address / village landmark"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <button
                className="btn btn-field w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={order}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <IconCheck size={16} />
                )}
                <span>{t('Place order')} (₹{total})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {msg && (
        <div
          className={`alert ${
            msg.includes('successfully') ? 'alert-success' : 'alert-info'
          } d-flex align-items-center gap-2 mb-4`}
          role="alert"
        >
          <IconInfo size={18} />
          <span>{msg}</span>
        </div>
      )}

      {/* Order History */}
      <div className="mt-4">
        <h2 className="h5 mb-3">My Orders ({orders.length})</h2>

        {!orders.length ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconBox size={26} />
            </div>
            <div className="empty-state-title">No orders placed yet</div>
            <p className="empty-state-desc">Your past orders and delivery status updates will appear here.</p>
          </div>
        ) : (
          <div className="row g-3">
            {orders.map(o => (
              <div key={o._id} className="col-12 col-md-6">
                <div className="panel h-100 mb-0 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <span className="small text-muted fw-semibold">
                        Ordered on {o.createdAt ? o.createdAt.slice(0, 10) : 'Recent'}
                      </span>
                      <span className={`status-badge ${getOrderStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      {o.items.map((l, i) => (
                        <div key={i} className="d-flex justify-content-between small text-secondary py-1">
                          <span>{l.name} × {l.qty}</span>
                          <span className="fw-semibold">₹{(l.price || 0) * (l.qty || 1)}</span>
                        </div>
                      ))}
                    </div>

                    {o.address && (
                      <div className="small text-muted d-flex align-items-start gap-1 mb-2">
                        <IconPin size={13} className="flex-shrink-0 mt-1" />
                        <span className="text-truncate">{o.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Grand Total</span>
                    <span className="fw-bold fs-6 text-success">₹{o.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
