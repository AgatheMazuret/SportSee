interface CardProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
}

const Card = ({ icon, title, value, unit }: CardProps) => {
  return (
    <div className="flex w-3xs items-center h-[124px] bg-gray-100 rounded-xl">
      <img className="flex ml-[20px]" src={icon} alt={title} />
      <div className="flex flex-col justify-center w-3xs h-[124px]">
        <p className="text-xl text-center font-bold">
          {value} {unit}
        </p>
        <h3 className="text-sm text-center text-[#74798C]">{title}</h3>
      </div>
    </div>
  );
};

export default Card;
