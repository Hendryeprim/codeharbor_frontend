import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminPortalAPI } from '../../services/api';
import { Bell, Check, ExternalLink, AlertCircle } from 'lucide-react';

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await adminPortalAPI.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await adminPortalAPI.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-amber-400" />
          <span>System Alerts & Notifications</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time events: code submissions, resubmissions, execution status, and developer progress alerts.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-[#0F172A] border border-[#334155] rounded-3xl text-slate-400 text-xs">
          No active admin notifications.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 text-xs ${
                n.isRead
                  ? 'bg-[#0F172A]/80 border-slate-800 text-slate-400'
                  : 'bg-[#131B2E] border-amber-500/40 text-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="px-2.5 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold text-[11px] hover:brightness-110 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
