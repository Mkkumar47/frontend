import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Wind, Utensils, Heart } from 'lucide-react';
import { formatINR } from '../utils/helpers';

const RoomCard = ({ room, onWishlist, wishlisted }) => {
  const img = room.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800';
  return (
    <motion.div whileHover={{ y: -4 }} className="card overflow-hidden">
      <Link to={`/rooms/${room._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={img} alt={room.title} loading="lazy" className="w-full h-full object-cover transition duration-500 hover:scale-105" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/90 backdrop-blur text-gray-900">{room.category}</span>
            {room.ac && <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-500/90 text-white flex items-center gap-1"><Wind size={12}/>AC</span>}
          </div>
          {onWishlist && (
            <button onClick={(e) => { e.preventDefault(); onWishlist(room._id); }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur hover:scale-110 transition"
              aria-label="Wishlist">
              <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'} />
            </button>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{room.title}</h3>
            <p className="text-sm text-gray-500 truncate flex items-center gap-1">
              <MapPin size={12}/> {room.hostelName} · {room.location?.city}
            </p>
          </div>
          {room.rating > 0 && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star size={14} className="fill-yellow-400 text-yellow-400" /> {room.rating}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">{formatINR(room.pricing.daily)}<span className="text-xs font-normal text-gray-500">/day</span></p>
            {room.foodIncluded && <p className="text-xs text-emerald-600 flex items-center gap-1"><Utensils size={12}/>Food included</p>}
          </div>
          <Link to={`/rooms/${room._id}`} className="text-sm font-semibold text-brand-600 hover:underline">View →</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
