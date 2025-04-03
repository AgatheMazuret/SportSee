import { useQuery } from "@tanstack/react-query";
import { fetchNutritionData, NutritionDataType } from "../services/api"; // Importation du service
import Card from "./card";

const NutritionData = () => {
  // Récupérer l'URL actuelle
  const url = window.location.href;

  // Expression régulière pour trouver le paramètre 'userId' dans l'URL
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Si un userId est trouvé, l'utiliser. Sinon, utiliser 12 par défaut.
  const userId = match ? parseInt(match[1], 10) : 12;

  const { data, error, isLoading } = useQuery<NutritionDataType, Error>({
    queryKey: ["nutritionData", userId],
    queryFn: () => fetchNutritionData(12),
  });

  if (isLoading)
    return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;
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
