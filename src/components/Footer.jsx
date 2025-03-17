import logoWhite from '../assets/logo-white.svg';

const Footer = () => {
  return (
    <footer className="py-6 w-full h-[60px] bg-[#243e87] text-white flex items-center justify-between px-6">
      <div className="flex items-center justify-center mx-auto ">
        <img className="h-10 w-[250px]" src={logoWhite} alt="logo" />
      </div>
    </footer>
  );
};

export default Footer;
