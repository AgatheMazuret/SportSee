function Header() {
  return (
    <div className="w-full h-[91px] bg-black text-white flex flex-wrap md:flex-nowrap items-center gap-[10%] px-6 lg:px-8">
      {/* Logo */}
      <div className="headerLogo">
        <img
          className="w-[120px] lg:w-[145px] h-[40px] lg:h-[47px]"
          src="/logo.svg"
          alt="Logo SportSee"
        />
      </div>

      {/* Menu */}
      <nav className="w-full lg:w-auto flex justify-center lg:justify-end">
        <ul className="flex flex-wrap lg:flex-nowrap text-lg lg:text-2xl  xl:gap-[50%] lg:gap-[20%]">
          <li>
            <a href="#">Accueil</a>
          </li>
          <li>
            <a href="#">Profil</a>
          </li>
          <li>
            <a href="#">Réglage</a>
          </li>
          <li>
            <a href="#">Communauté</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
