const icons = [
  { src: "/icon-yoga.svg", alt: "yoga" },
  { src: "/icon-swim.svg", alt: "swim" },
  { src: "/icon-bike.svg", alt: "bike" },
  { src: "/icon-body-building.svg", alt: "bodyBuilding" },
];

const Sidebar = () => {
  return (
    // On crée une div qui va contenir toutes les icônes
    <div className="bg-black w-[117px] h-[780px] justify-center items-center flex flex-col gap-7">
      {/* On utilise map pour parcourir la liste d'icônes et en afficher une par une  */}
      {icons.map((icon, index) => (
        // les icônes sont mises dans une div avec une classe correspondant à son nom
        <div key={index} className={icon.alt}>
          {/* On affiche l'image avec son chemin src et son texte  */}
          <img src={icon.src} alt={icon.alt} />
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
