const Footer = () => (
  <footer className="mt-16 border-t border-gray-100 dark:border-white/5 py-10 text-sm text-gray-500">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
      <p>© {new Date().getFullYear()} HostelHub. Built with ♥ for travellers.</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-brand-600">Terms</a>
        <a href="#" className="hover:text-brand-600">Privacy</a>
        <a href="#" className="hover:text-brand-600">Contact</a>
      </div>
    </div>
  </footer>
);
export default Footer;
