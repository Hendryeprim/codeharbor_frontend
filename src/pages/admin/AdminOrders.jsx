import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { ShoppingBag, Clock, AlertCircle, Zap } from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getOrders();
        if (res.orders) setOrders(res.orders);
      } catch (err) {
        console.error('Error fetching admin orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 text-[#22D3EE] text-[11px] font-semibold tracking-wider uppercase mb-2">
          <Zap className="w-3.5 h-3.5 text-[#00FFC6]" />
          Commerce & Licensing Records
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E2E8F0] tracking-tight">
          Order & Transaction Management
        </h1>
        <p className="text-xs sm:text-sm text-[#C0C7D1]/70 mt-1">
          Review commercial transaction statuses and incoming customer license orders.
        </p>
      </div>

      {/* Explanatory Policy Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#131B2E] to-[#0F172A] border border-amber-500/30 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Payment Processing: Scheduled for Future Phase (Coming Soon)</span>
        </div>
        <p className="text-xs text-[#C0C7D1]/80 leading-relaxed max-w-2xl">
          Per platform instructions, payment gateways (Razorpay, Stripe, PayPal) are postponed to the upcoming development phase. In order to maintain strict data integrity, no fabricated revenue or simulated paid orders are rendered.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gradient-to-br from-[#131B2E] to-[#0F172A] rounded-2xl p-12 text-center border border-[#334155]/60 max-w-md mx-auto shadow-xl">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#E2E8F0] mb-1">No Orders Generated</h3>
          <p className="text-xs text-[#C0C7D1]/60">
            Real orders will be processed once payment gateway hooks are configured in Phase 2.
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#131B2E] to-[#0F172A] rounded-2xl border border-[#334155]/60 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F1A]/80 text-[#C0C7D1] uppercase tracking-wider font-semibold border-b border-[#334155]/60">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/40 text-[#E2E8F0]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#1E293B]/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-[#22D3EE]">{o.orderNumber}</td>
                  <td className="px-6 py-4 text-[#E2E8F0]">{o.user?.name}</td>
                  <td className="px-6 py-4 text-[#C0C7D1]">{o.items?.length || 1} item(s)</td>
                  <td className="px-6 py-4 font-bold font-mono text-[#00FFC6]">${Number(o.totalAmount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
