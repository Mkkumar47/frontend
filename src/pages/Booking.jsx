import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { formatINR } from '../utils/helpers';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';

const Booking = () => {
  const { roomId } = useParams();
  const nav = useNavigate();
  const [room, setRoom] = useState(null);
  const [form, setForm] = useState({
    checkIn: new Date().toISOString().slice(0,10),
    checkOut: new Date(Date.now() + 86400000).toISOString().slice(0,10),
    durationType: 'daily',
    durationCount: 1,
    guests: 1,
    foodIncluded: false
  });
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    roomService.get(roomId).then(({ data }) => setRoom(data.room)).catch(() => nav('/rooms'));
  }, [roomId, nav]);

  // Recompute price whenever options change
  useEffect(() => {
    if (!room) return;
    bookingService.computePrice({
      roomId, durationType: form.durationType, durationCount: form.durationCount,
      foodIncluded: form.foodIncluded
    }).then(({ data }) => setPrice(data.pricing)).catch(() => {});
  }, [room, roomId, form.durationType, form.durationCount, form.foodIncluded]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const proceed = async () => {
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      return toast.error('Check-out must be after check-in');
    }
    setLoading(true);
    try {
      const { data } = await bookingService.create({ roomId, ...form });
      const { data: pay } = await paymentService.initiate(data.booking._id);
      // Redirect to PhonePe
      window.location.href = pay.redirectUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
      setLoading(false);
    }
  };

  if (!room) return <Loader />;

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Complete your booking</h1>
          <p className="text-gray-500 mt-1">{room.title} · {room.hostelName}</p>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">Dates</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Check-in</label>
              <input type="date" className="input mt-1" min={new Date().toISOString().slice(0,10)}
                value={form.checkIn} onChange={e => set('checkIn', e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Check-out</label>
              <input type="date" className="input mt-1" min={form.checkIn}
                value={form.checkOut} onChange={e => set('checkOut', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">Duration & price plan</h2>
          <div className="grid grid-cols-3 gap-2">
            {['daily','weekly','monthly'].map(t => (
              <button key={t} onClick={() => set('durationType', t)}
                className={`py-2.5 rounded-xl border transition text-sm font-medium capitalize ${form.durationType === t
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 hover:bg-gray-50'}`}>
                {t} · {formatINR(room.pricing[t])}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm">How many {form.durationType.replace('ly','s').replace('dais','days').replace('weeks','weeks').replace('months','months')}?</label>
            <input type="number" min={1} className="input mt-1"
              value={form.durationCount} onChange={e => set('durationCount', Math.max(1, +e.target.value || 1))} />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold">Add-ons</h2>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span>
              <span className="font-medium">Meals</span>
              <span className="block text-sm text-gray-500">Daily breakfast + dinner included (+₹200/day)</span>
            </span>
            <input type="checkbox" className="w-5 h-5 accent-brand-600" checked={form.foodIncluded}
              onChange={e => set('foodIncluded', e.target.checked)} />
          </label>
          <div>
            <label className="text-sm">Guests</label>
            <input type="number" min={1} className="input mt-1"
              value={form.guests} onChange={e => set('guests', Math.max(1, +e.target.value || 1))} />
          </div>
        </div>
      </motion.div>

      <aside className="lg:sticky lg:top-20 h-fit">
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Price summary</h2>
          {price ? (
            <>
              <div className="flex justify-between text-sm"><span>Base ({form.durationCount} {form.durationType})</span><span>{formatINR(price.baseAmount)}</span></div>
              {price.foodAmount > 0 && <div className="flex justify-between text-sm"><span>Food</span><span>{formatINR(price.foodAmount)}</span></div>}
              <div className="flex justify-between text-sm text-gray-500"><span>GST (12%)</span><span>{formatINR(price.gst)}</span></div>
              <div className="border-t border-gray-100 dark:border-white/5 my-2"/>
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatINR(price.totalAmount)}</span></div>
            </>
          ) : <div className="text-sm text-gray-500">Calculating…</div>}
          <button onClick={proceed} disabled={loading || !price} className="btn-primary w-full !py-3">
            {loading ? 'Redirecting to PhonePe…' : 'Pay with PhonePe'}
          </button>
          <p className="text-[11px] text-gray-500 text-center">By proceeding you agree to our terms.</p>
        </div>
      </aside>
    </div>
  );
};

export default Booking;
