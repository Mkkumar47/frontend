import { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { formatINR, formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { Calendar, Download, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  cancelled: 'bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
};

const MyBookings = () => {
  const [items, setItems] = useState(null);

  const load = () => bookingService.myBookings().then(({ data }) => setItems(data.items));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingService.cancel(id, 'User cancelled');
      toast.success('Booking cancelled');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const downloadReceipt = async (b) => {
    try {
      const res = await paymentService.downloadReceipt(b._id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `receipt-${b.bookingId}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Could not download receipt'); }
  };

  if (!items) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My bookings</h1>
        <p className="text-gray-500 mt-1">All your past and upcoming stays.</p>
      </div>

      {items.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          <p>You don't have any bookings yet.</p>
          <Link to="/rooms" className="btn-primary mt-4 inline-flex">Browse rooms</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(b => (
            <div key={b._id} className="card p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
              <img src={b.room?.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'}
                alt="" className="w-full sm:w-40 h-32 object-cover rounded-xl"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{b.room?.title || 'Room'}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12}/>{b.room?.hostelName} · {b.room?.location?.city}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{b.bookingId}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize shrink-0 ${statusStyles[b.status] || ''}`}>
                    {b.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300"><Calendar size={14}/> {formatDate(b.checkIn)} → {formatDate(b.checkOut)}</span>
                  <span className="font-semibold">{formatINR(b.pricing.totalAmount)}</span>
                  <span className={`text-xs uppercase tracking-wide ${b.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{b.paymentStatus}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  {b.paymentStatus === 'paid' && (
                    <button onClick={() => downloadReceipt(b)} className="btn-ghost !py-1.5 !px-3 text-xs"><Download size={12}/> Receipt</button>
                  )}
                  {['pending','confirmed'].includes(b.status) && (
                    <button onClick={() => cancel(b._id)} className="btn-ghost !py-1.5 !px-3 text-xs text-red-600"><X size={12}/> Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
