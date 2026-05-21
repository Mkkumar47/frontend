export const formatINR = (n) => new Intl.NumberFormat('en-IN',
  { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export const formatDate = (d) => new Date(d).toLocaleDateString('en-IN',
  { day: 'numeric', month: 'short', year: 'numeric' });

export const daysBetween = (a, b) => Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

export const cn = (...classes) => classes.filter(Boolean).join(' ');
