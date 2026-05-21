import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatINR, formatDate } from '../../utils/helpers';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const AdminBookings = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState({ status: '', paymentStatus: '', page: 1 });

  const load = () => {
    const params = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v !== ''));
    api.get('/admin/bookings', { params }).then(r => setData(r.data.data));
  };
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id, status) => {
    try { await api.patch(`/bookings/${id}/status`, { status }); toast.success('Updated'); load(); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
      </div>
      <div className="card p-3 flex flex-wrap gap-2">
        <select className="input max-w-[180px]" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value, page: 1 })}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        <select className="input max-w-[180px]" value={filter.paymentStatus} onChange={e => setFilter({ ...filter, paymentStatus: e.target.value, page: 1 })}>
          <option value="">All payments</option>
          <option value="pending">Payment Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {!data ? <Loader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/5 text-left">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {data.items.map(b => (
                <tr key={b._id}>
                  <td className="px-4 py-3 font-mono text-xs">{b.bookingId}</td>
                  <td className="px-4 py-3">{b.user?.name}<div className="text-xs text-gray-500">{b.user?.email}</div></td>
                  <td className="px-4 py-3">{b.room?.title}<div className="text-xs text-gray-500">{b.room?.hostelName}</div></td>
                  <td className="px-4 py-3 text-xs">{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</td>
                  <td className="px-4 py-3 font-semibold">{formatINR(b.pricing.totalAmount)}</td>
                  <td className="px-4 py-3"><span className="capitalize text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/5">{b.status}</span></td>
                  <td className={`px-4 py-3 text-xs uppercase font-semibold ${b.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{b.paymentStatus}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    {b.status === 'pending' && (
                      <>
                        <button onClick={() => setStatus(b._id, 'confirmed')} className="p-2 rounded hover:bg-emerald-50 text-emerald-600" aria-label="Approve"><Check size={14}/></button>
                        <button onClick={() => setStatus(b._id, 'rejected')} className="p-2 rounded hover:bg-red-50 text-red-600" aria-label="Reject"><X size={14}/></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {!data.items.length && <tr><td colSpan="8" className="text-center py-8 text-gray-500">No bookings.</td></tr>}
            </tbody>
          </table>
          {data.pages > 1 && (
            <div className="flex justify-center gap-2 p-3 border-t border-gray-100 dark:border-white/5">
              {Array.from({ length: data.pages }).map((_, i) => (
                <button key={i} onClick={() => setFilter({ ...filter, page: i + 1 })}
                  className={`w-9 h-9 rounded ${filter.page === i + 1 ? 'bg-brand-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
