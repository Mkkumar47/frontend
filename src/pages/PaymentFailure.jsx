import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => (
  <div className="max-w-lg mx-auto">
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="card p-8 text-center space-y-5">
      <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-500/10 grid place-items-center">
        <XCircle size={44} className="text-red-600"/>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Payment didn't go through</h1>
        <p className="text-gray-500 mt-1">No worries — no amount was deducted. You can try again.</p>
      </div>
      <div className="flex gap-3">
        <Link to="/rooms" className="btn-ghost flex-1">Back to rooms</Link>
        <Link to="/my-bookings" className="btn-primary flex-1">My bookings</Link>
      </div>
    </motion.div>
  </div>
);

export default PaymentFailure;
