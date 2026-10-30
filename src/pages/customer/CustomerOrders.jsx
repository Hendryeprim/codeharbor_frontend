import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../../services/api';
import { ShoppingBag, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await customerAPI.getMyOrders();
        if (res.orders) setOrders(res.orders);
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 text-[#E2E8F0]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Order History & Purchasing Status
        </h1>
        <p className="text-xs text-[#C0C7D1] mt-1">
          Review transaction receipts and pending marketplace items.
        </p>
      </div>

      {/* Explanatory Banner regarding payment postponement */}
      <div className="p-6 rounded-3xl bg-[#131B2E] border border-amber-500/30 shadow-harbor-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Clock className="w-5 h-5 text-amber-400" />
          <span>Payment Gateway Phase: Coming Soon</span>
        </div>
        <p className="text-xs text-amber-200/80 leading-relaxed max-w-2xl">
          CoderHarbor's direct checkout with automated payment gateways (Stripe / Razorpay) is currently under scheduled deployment. In accordance with platform policy, no simulated or fake payments are executed. All commercial purchases remain disabled until the official payment phase launch.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#131B2E] rounded-3xl p-12 text-center border border-[#334155] max-w-md mx-auto">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No Orders Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            Online checkout is coming soon. You can browse current project architectures or download free community kits.
          </p>
          <Link
            to="/projects"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#00FFC6] text-[#0B0F1A] text-xs font-bold uppercase tracking-wider"
          >
            Explore Projects
          </Link>
        </div>
      ) : (
        <div className="bg-[#131B2E] rounded-3xl border border-[#334155] overflow-hidden shadow-harbor-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F172A] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#334155]">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60 text-slate-300">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 font-mono font-bold text-white">{o.orderNumber}</td>
                    <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{o.items?.length || 1} item(s)</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#00FFC6]">${Number(o.totalAmount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
