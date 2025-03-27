// components/Card.tsx
interface CardProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
}

const Card = ({ icon, title, value, unit }: CardProps) => {
  return (
    <div className="flex flex-col w-3xs h-[124px]">
      <div className="flex w-full bg-gray-100 rounded-xl">
        <img className="flex ml-[20px]" src={icon} alt={title} />
        <div className="flex flex-col justify-center w-3xs h-[124px]">
          <p className="text-xl text-center font-bold">
            {value} {unit}
          </p>
          <h3 className="text-sm text-center text-[#74798C]">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default Card;

export interface NutritionDataType {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}

export const fetchNutritionData = async (
  userId: number
): Promise<NutritionDataType> => {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}/`);
    if (!response.ok) {
      throw new Error("La réponse du réseau n'est pas correcte");
    }
    const result = await response.json();
    if (result.data && result.data.keyData) {
      return result.data.keyData;
    } else {
      throw new Error("Pas de 'keyData' dans la réponse");
    }
  } catch (error) {
    console.error("❌ Erreur de récupération:", error);
    throw error;
  }
};
