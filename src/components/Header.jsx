import logo from '../assets/logo.svg';

const Header = () => {
  return (
    <header className="bg-gray-200 px-20 py-10 shadow-lg w-full border-b border-gray-300">
      {/* اللوجو على الشمال */}
      <div className="max-w-4/6 flex items-center justify-between mx-auto">
        <div className="flex items-center justify-center">
          <img className="h-10 w-[250px]" src={logo} alt="logo" />
        </div>
        {/* زر Shop Now مع الـ Cart SVG */}
        <a
          href="https://www.redahazardcontrol.com/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-[#ee2e3a] text-white font-semibold rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:bg-[#ee2e3a]/80 hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 bounce-slow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="text-sm md:text-base">زوروا موقعنا الإلكتروني</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
