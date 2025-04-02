import { useEffect, useState } from "react";
import { fetchNutritionData, NutritionDataType } from "../../services/api"; // Importation du service
import Card from "../card";

const NutritionData = () => {
  const [data, setData] = useState<NutritionDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const nutritionData = await fetchNutritionData(12); // Appel à la fonction du service
        setData(nutritionData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!data) return <p className="text-center">Aucune donnée disponible</p>;

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
