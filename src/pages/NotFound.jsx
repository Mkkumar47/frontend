import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[60vh] grid place-items-center text-center">
    <div>
      <p className="text-6xl font-extrabold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">404</p>
      <h1 className="text-2xl font-bold mt-2">Page not found</h1>
      <p className="text-gray-500 mt-1">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Back home</Link>
    </div>
  </div>
);

export default NotFound;
