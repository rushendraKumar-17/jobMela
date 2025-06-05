

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400">+91 8788168814</p>
          <p className="text-gray-400">info@jobmela2025.in</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <a href="#" className="block text-gray-400 hover:text-white mb-2">
            FAQs
          </a>
          <a href="#" className="block text-gray-400 hover:text-white mb-2">
            Privacy Policy
          </a>
        </div>
        <div className="hidden md:block" />
        <div className="hidden md:block" />
      </div>
    </footer>
  );
};

export default Footer;

