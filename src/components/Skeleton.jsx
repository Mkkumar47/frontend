export const RoomCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-[4/3]" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-5 w-24 rounded mt-2" />
    </div>
  </div>
);

export const ListSkeleton = ({ n = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: n }).map((_, i) => <RoomCardSkeleton key={i} />)}
  </div>
);
