import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { formatINR } from '../utils/helpers';
import { motion } from 'framer-motion';
import { Star, MapPin, Wind, Utensils, Wifi, ShieldCheck, ArrowLeft } from 'lucide-react';
import Loader from '../components/Loader';

const RoomDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [room, setRoom] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    roomService.get(id).then(({ data }) => setRoom(data.room)).catch(() => nav('/rooms'));
  }, [id, nav]);

  if (!room) return <Loader />;

  const images = room.images?.length ? room.images : [{ url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200' }];

  return (
    <div className="space-y-8">
      <button onClick={() => nav(-1)} className="text-sm text-gray-500 hover:text-brand-600 flex items-center gap-1"><ArrowLeft size={14}/> Back</button>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-5">
          <motion.div layoutId={`img-${id}`} className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
            <img src={images[active].url} alt="" className="w-full h-full object-cover"/>
          </motion.div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`aspect-square rounded-lg overflow-hidden ring-2 transition ${active === i ? 'ring-brand-500' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{room.title}</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-1"><MapPin size={14}/> {room.hostelName} · {room.location?.city}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              {room.rating > 0 && <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400"/> {room.rating} ({room.reviewCount})</span>}
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5">{room.category}</span>
              {room.ac && <span className="flex items-center gap-1 text-blue-600"><Wind size={14}/>AC</span>}
              {room.foodIncluded && <span className="flex items-center gap-1 text-emerald-600"><Utensils size={14}/>Food included</span>}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">About this place</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{room.description}</p>
          </div>
          {room.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map(a => <span key={a} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-sm">{a}</span>)}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="card p-5 space-y-4">
            <div>
              <p className="text-3xl font-bold">{formatINR(room.pricing.daily)}<span className="text-sm font-normal text-gray-500">/day</span></p>
              <p className="text-sm text-gray-500 mt-1">
                {formatINR(room.pricing.weekly)}/wk · {formatINR(room.pricing.monthly)}/mo
              </p>
            </div>
            <div className={`text-sm font-medium ${room.isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
              {room.isAvailable ? `${room.availableUnits} unit${room.availableUnits > 1 ? 's' : ''} available` : 'Fully booked'}
            </div>
            <Link to={`/book/${room._id}`} className="btn-primary w-full !py-3">Book now</Link>
            <div className="text-xs text-gray-500 flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-white/5">
              <ShieldCheck size={14}/> Secure payments · Free cancellation 24h before
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetail;
