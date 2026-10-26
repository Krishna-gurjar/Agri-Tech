import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../auth';
import { useT } from '../i18n';
import {
  IconCommunity,
  IconSend,
  IconTrash,
  IconAlert,
  IconPlus
} from '../components/Icons';

export default function Community() {
  const { user } = useAuth();
  const { t } = useT();
  const isAdmin = user.role === 'admin';

  const tabs = [
    { key: 'forum', label: 'Forum', desc: 'Discussions & farmer experiences' },
    { key: 'consult', label: 'Ask an expert', desc: 'Direct agronomy consultation' },
    { key: 'pestAlert', label: 'Pest alerts', desc: 'Critical advisories & warnings' }
  ];

  const [type, setType] = useState('forum');
  const [posts, setPosts] = useState([]);
  const [f, setF] = useState({ title: '', body: '' });
  const [reply, setReply] = useState({});
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    api.get('/posts?type=' + type).then(r => setPosts(r.data));
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  const canPost = type !== 'pestAlert' || isAdmin;

  const submit = async e => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      await api.post('/posts', { ...f, type });
      setF({ title: '', body: '' });
      load();
    } catch (x) {
      setErr(errMsg(x));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{t('Community')}</h1>
          <div className="page-header-sub">
            Connect with regional farmers, ask certified agricultural experts, and review crop alerts.
          </div>
        </div>

        {/* Community Channel Tabs */}
        <div className="d-flex p-1 bg-light rounded-3 border">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              className={`btn btn-sm fw-bold px-3 py-1 rounded-2 ${
                type === key ? 'btn-field shadow-sm' : 'text-muted border-0'
              }`}
              onClick={() => setType(key)}
            >
              {t(label)}
            </button>
          ))}
        </div>
      </div>

      {/* New Post Form */}
      {canPost ? (
        <div className="panel mb-4">
          <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
            <div className="metric-icon-wrap green" style={{ width: 32, height: 32 }}>
              <IconPlus size={16} />
            </div>
            <div>
              <h2 className="h6 mb-0 fw-bold">
                {type === 'consult'
                  ? 'Ask an Agricultural Expert'
                  : type === 'pestAlert'
                  ? 'Issue a Pest or Disease Alert'
                  : 'Start a Community Discussion'}
              </h2>
              <span className="text-muted small">
                {type === 'consult'
                  ? 'Specify your crop variety, visible symptoms, and field observations'
                  : 'Share insights, ask questions, or exchange farming best practices'}
              </span>
            </div>
          </div>

          <form onSubmit={submit}>
            <div className="mb-2">
              <input
                className="form-control"
                required
                placeholder={
                  type === 'consult'
                    ? 'What issue are you facing? (e.g. Yellow leaf curl on tomato)'
                    : type === 'pestAlert'
                    ? 'Alert headline (e.g. Fall armyworm spotted in maize)'
                    : 'Topic Title'
                }
                value={f.title}
                onChange={e => setF({ ...f, title: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                rows={3}
                required
                placeholder="Provide details, symptoms, duration, or questions for fellow farmers…"
                value={f.body}
                onChange={e => setF({ ...f, body: e.target.value })}
              />
            </div>

            {err && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-3" role="alert">
                <IconAlert size={16} />
                <span>{err}</span>
              </div>
            )}

            <button className="btn btn-field d-inline-flex align-items-center gap-2" disabled={submitting}>
              <IconSend size={15} />
              <span>{submitting ? 'Submitting…' : t('Post')}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="alert alert-info-soft d-flex align-items-center gap-2 mb-4">
          <IconAlert size={18} />
          <span>Only verified agronomists and administrators can broadcast regional pest alerts.</span>
        </div>
      )}

      {/* Posts Feed */}
      <h2 className="h5 mb-3">
        {type === 'consult' ? 'Expert Inquiries' : type === 'pestAlert' ? 'Broadcasted Alerts' : 'Recent Discussions'} ({posts.length})
      </h2>

      {!posts.length ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <IconCommunity size={26} />
          </div>
          <div className="empty-state-title">No conversations here yet</div>
          <p className="empty-state-desc">
            {type === 'consult'
              ? 'Have a question about pest attacks or fertilizer schedules? Post above to get advice.'
              : 'Be the first to share an update or start a conversation with the farming community!'}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {posts.map(p => {
            const authorInitial = p.author?.name ? p.author.name.charAt(0).toUpperCase() : 'F';
            const isExpert = p.author?.role === 'admin';

            return (
              <div key={p._id} className="panel mb-0">
                {/* Post Author & Header */}
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rail-avatar" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
                      {authorInitial}
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-dark">{p.author?.name || 'Farmer'}</span>
                        {isExpert && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0 rounded-pill small">
                            Agri Expert
                          </span>
                        )}
                      </div>
                      <span className="text-muted small">
                        {p.createdAt ? p.createdAt.slice(0, 10) : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {(isAdmin || p.author?._id === user._id) && (
                    <button
                      className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                      onClick={async () => {
                        if (window.confirm('Delete this post?')) {
                          await api.delete('/posts/' + p._id);
                          load();
                        }
                      }}
                    >
                      <IconTrash size={13} />
                      <span>{t('Delete')}</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <h3 className="h5 fw-bold text-dark mt-2 mb-1">{p.title}</h3>
                <p className="text-secondary mb-3" style={{ whiteSpace: 'pre-line' }}>
                  {p.body}
                </p>

                {/* Replies Thread */}
                {p.replies && p.replies.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="small fw-bold text-muted mb-2">Replies ({p.replies.length}):</div>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {p.replies.map(r => {
                        const rExpert = r.author?.role === 'admin';
                        return (
                          <div
                            key={r._id}
                            className={`p-2 rounded-3 ${
                              rExpert ? 'bg-success-subtle border border-success-subtle' : 'bg-light border'
                            }`}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span className="fw-semibold small text-dark">
                                {r.author?.name || 'Community Member'}
                              </span>
                              {rExpert && (
                                <span className="badge bg-success text-white small" style={{ fontSize: '0.7rem' }}>
                                  Expert Reply
                                </span>
                              )}
                            </div>
                            <div className="small text-secondary">{r.body}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reply Input */}
                {type !== 'pestAlert' && (
                  <div className="input-group input-group-sm mt-2">
                    <input
                      className="form-control"
                      placeholder="Write a constructive response or advice…"
                      aria-label="Reply"
                      value={reply[p._id] || ''}
                      onChange={e => setReply({ ...reply, [p._id]: e.target.value })}
                      onKeyDown={async e => {
                        if (e.key === 'Enter' && reply[p._id]) {
                          e.preventDefault();
                          await api.post(`/posts/${p._id}/replies`, { body: reply[p._id] });
                          setReply({ ...reply, [p._id]: '' });
                          load();
                        }
                      }}
                    />
                    <button
                      className="btn btn-field d-inline-flex align-items-center gap-1"
                      onClick={async () => {
                        if (!reply[p._id]) return;
                        await api.post(`/posts/${p._id}/replies`, { body: reply[p._id] });
                        setReply({ ...reply, [p._id]: '' });
                        load();
                      }}
                    >
                      <IconSend size={14} />
                      <span>{t('Reply')}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
