function Header() {
  return (
    <div className="w-full h-[91px] bg-black text-white flex justify-between items-center px-8">
      <div className="header__logo">
        <img
          className="w-[145px] h-[47px]"
          src="/logo.svg"
          alt="Logo SportSee"
        />
      </div>
      <div className="flex justify-center items-center">
        <ul className="flex flex-row text-2xl gap-50">
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
      </div>
    </div>
  );
}

export default Header;
