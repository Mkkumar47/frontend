import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import Loader from '../components/Loader';

const PaymentRedirect = () => {
  const [params] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    const mtid = params.get('mtid');
    if (!mtid) return nav('/payment/failure');

    // Poll up to 5 times in case PhonePe is slow to settle
    let attempt = 0;
    const check = async () => {
      attempt++;
      try {
        const { data } = await paymentService.verify(mtid);
        if (data.status === 'success') {
          nav(`/payment/success?bid=${data.booking}`);
        } else if (data.status === 'failed') {
          nav('/payment/failure');
        } else if (attempt < 5) {
          setTimeout(check, 2500);
        } else {
          nav('/payment/failure');
        }
      } catch {
        if (attempt < 5) setTimeout(check, 2500);
        else nav('/payment/failure');
      }
    };
    check();
  }, [params, nav]);

  return <Loader />;
};

export default PaymentRedirect;
