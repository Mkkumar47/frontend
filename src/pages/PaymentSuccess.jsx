import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, ArrowRight } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { formatINR } from '../utils/helpers';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const bid = params.get('bid');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bid) return;
    bookingService.get(bid).then(({ data }) => setBooking(data.booking)).catch(() => {});
  }, [bid]);

  const download = async () => {
    if (!bid) return;
    try {
      const res = await paymentService.downloadReceipt(bid);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${booking?.bookingId || bid}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Could not download receipt'); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="card p-8 text-center space-y-5">
        <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-500/10 grid place-items-center">
          <CheckCircle2 size={44} className="text-emerald-600"/>
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold">Payment successful!</h1>
          <p className="text-gray-500 mt-1">Your booking is confirmed. A receipt has been emailed to you.</p>
        </div>
        {booking && (
          <div className="text-left bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-gray-500">Booking ID</span><span className="font-mono font-semibold">{booking.bookingId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold">{formatINR(booking.pricing.totalAmount)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-emerald-600 font-semibold capitalize">{booking.status}</span></div>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={download} className="btn-ghost flex-1"><Download size={16}/> Receipt</button>
          <Link to="/my-bookings" className="btn-primary flex-1">My bookings <ArrowRight size={16}/></Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
