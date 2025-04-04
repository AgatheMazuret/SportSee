import { useQuery } from "@tanstack/react-query";
import { fetchNutritionData, NutritionDataType } from "../services/api"; // Importation du service
import Card from "./card";
import { useState, useEffect } from "react";

const NutritionData = ({ userId: propUserId }: { userId?: number }) => {
  const [userId, setUserId] = useState<number>(12); // ID par défaut

  useEffect(() => {
    // Récupération de l'userId depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const newUserId =
      propUserId ?? parseInt(urlParams.get("userId") || "12", 10);

    setUserId(newUserId);
  }, [propUserId]);

  // Récupérer les données via la query de React Query
  const { data, error, isLoading } = useQuery<NutritionDataType, Error>({
    queryKey: ["nutritionData", userId],
    queryFn: () => fetchNutritionData(userId), // Utilisation du userId dynamique
  });

  if (isLoading)
    return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;
  if (!data) return <p className="text-center">Aucune donnée disponible</p>;

  return (
    <div className="flex flex-col items-center gap-4">
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
