export const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h1 className="bg-linear-to-r from-zinc-200 to-zinc-500 text-2xl font-bold lg:font-extrabold bg-clip-text text-transparent">
              Support<span className="text-zinc-400">AI</span>
            </h1>
            <p className="text-gray-400 max-w-lg mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis soluta fugiat unde. Est modi cumque dicta maxime voluptate ab! Vitae distinctio.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="#home" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-400">Email: support@chatbot.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SupportAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
