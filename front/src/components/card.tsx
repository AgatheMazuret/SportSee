interface CardProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
}

const Card = ({ icon, title, value, unit }: CardProps) => {
  return (
    <div className="flex w-[150px] h-[65px] xl:w-[280px] xl:h-[124px] items-center bg-gray-100 rounded-xl">
      <img
        className="flex ml-[10px] xl:w-auto w-[40px]"
        src={icon}
        alt={title}
      />
      <div className="flex flex-col justify-center w-full h-full">
        <p className="text-xs xl:text-xl text-center font-bold">
          {value} {unit}
        </p>
        <h3 className="text-xs xl:text-sm text-center text-[#74798C]">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default Card;
