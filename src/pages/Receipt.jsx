import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { formatINR, formatDate } from '../utils/helpers';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Receipt = () => {
  const { bookingId } = useParams();
  const [b, setB] = useState(null);

  useEffect(() => {
    bookingService.get(bookingId).then(({ data }) => setB(data.booking)).catch(() => {});
  }, [bookingId]);

  const download = async () => {
    try {
      const res = await paymentService.downloadReceipt(bookingId);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `receipt-${b.bookingId}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Could not download'); }
  };

  if (!b) return <Loader />;

  const Row = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-white/5 text-sm">
      <span className="text-gray-500">{label}</span><span className="font-medium">{value}</span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Receipt</h1>
        <button onClick={download} className="btn-primary !py-2"><Download size={16}/> Download PDF</button>
      </div>
      <div className="card p-6 sm:p-8 space-y-4">
        <div className="bg-gradient-to-r from-brand-600 to-purple-600 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 px-6 sm:px-8 py-5 text-white rounded-t-2xl">
          <p className="text-sm opacity-80">Booking</p>
          <h2 className="text-xl font-bold font-mono">{b.bookingId}</h2>
        </div>
        <div className="space-y-1">
          <Row label="Customer" value={b.user?.name} />
          <Row label="Email" value={b.user?.email} />
          <Row label="Room" value={`${b.room?.title} (${b.room?.category})`} />
          <Row label="Hostel" value={b.room?.hostelName} />
          <Row label="Check-in" value={formatDate(b.checkIn)} />
          <Row label="Check-out" value={formatDate(b.checkOut)} />
          <Row label="Duration" value={`${b.durationCount} ${b.durationType}`} />
          <Row label="Food" value={b.foodIncluded ? 'Included' : 'Not Included'} />
        </div>
        <div className="space-y-1">
          <Row label="Base amount" value={formatINR(b.pricing.baseAmount)} />
          {b.pricing.foodAmount > 0 && <Row label="Food amount" value={formatINR(b.pricing.foodAmount)} />}
          <Row label="GST (12%)" value={formatINR(b.pricing.gst)} />
          <div className="flex justify-between pt-3 text-lg font-bold"><span>Total paid</span><span>{formatINR(b.pricing.totalAmount)}</span></div>
        </div>
        <div className="text-xs text-gray-500 pt-4 border-t border-gray-100 dark:border-white/5">
          GSTIN: 36ABCDE1234F1Z5 · HostelHub Pvt Ltd. · System-generated receipt.
        </div>
      </div>
    </div>
  );
};

export default Receipt;
