import { useEffect, useState } from "react";

interface CardProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
}

const Card = ({ icon, title, value, unit }: CardProps) => {
  return (
    <div className="flex flex-col w-3xs h-[124px] ">
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

interface NutritionDataType {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}

const NutritionData = () => {
  const [data, setData] = useState<NutritionDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/user/12/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("La réponse du réseau n'est pas correcte");
        }
        return response.json();
      })
      .then((result) => {
        if (result.data && result.data.keyData) {
          setData(result.data.keyData);
        } else {
          throw new Error("Pas de 'keyData' dans la réponse");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Erreur de récupération:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (error) {
    console.error("🚨 Erreur:", error);
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!data) {
    console.warn("⚠ Aucune donnée disponible !");
    return <p className="text-center">Aucune donnée disponible</p>;
  }

  return (
    <div className="flex gap-4 flex-col items-center">
      <Card
        icon="/icon-calories.svg"
        title="Calories"
        value={data.calorieCount}
        unit="kCal"
      />
      <Card
        icon="/icon-protein.svg"
        title="Protéines"
        value={data.proteinCount}
        unit="g"
      />
      <Card
        icon="/icon-carbs.svg"
        title="Glucides"
        value={data.carbohydrateCount}
        unit="g"
      />
      <Card
        icon="/icon-fat.svg"
        title="Lipides"
        value={data.lipidCount}
        unit="g"
      />
    </div>
  );
};

export default NutritionData;
