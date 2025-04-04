const icons = [
  { src: "/icon-yoga.svg", alt: "yoga" },
  { src: "/icon-swim.svg", alt: "swim" },
  { src: "/icon-bike.svg", alt: "bike" },
  { src: "/icon-body-building.svg", alt: "bodyBuilding" },
];

const Sidebar = () => {
  return (
    <div className="bg-black w-30 shrink-0 flex flex-col items-center">
      {/* Conteneur des icônes */}
      <div className="flex flex-col items-center gap-4 lg:gap-7 flex-1 justify-center cursor-pointer">
        {icons.map((icon) => (
          <div key={icon.alt} className={icon.alt}>
            <img src={icon.src} alt={icon.alt} />
          </div>
        ))}
      </div>

      {/* Copyright en bas */}
      <div className="mb-2 lg:mb-5">
        <p className="text-white text-xs [writing-mode:vertical-rl] rotate-180">
          Copyright, SportSee 2020
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
