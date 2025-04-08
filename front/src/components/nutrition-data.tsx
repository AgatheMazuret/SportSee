import { useQuery } from "@tanstack/react-query";
import { fetchNutritionData, NutritionDataType } from "../services/api";
import Card from "./card";
import { useState, useEffect } from "react";
import ErrorMessage from "./error-message";

const NutritionData = ({ userId: propUserId }: { userId?: number }) => {
  // État local pour stocker l'userId, avec une valeur par défaut de 12
  const [userId, setUserId] = useState<number>(12);

  useEffect(() => {
    // Récupérer l'userId depuis l'URL ou depuis la prop si disponible
    const urlParams = new URLSearchParams(window.location.search);
    const newUserId =
      propUserId ?? parseInt(urlParams.get("userId") || "12", 10);

    setUserId(newUserId); // Mettre à jour l'état avec l'userId trouvé
  }, [propUserId]);

  const { data, error, isLoading } = useQuery<NutritionDataType, Error>({
    queryKey: ["nutritionData", userId], // Clé de la requête (permet la mise en cache)
    queryFn: () => fetchNutritionData(userId), // Fonction qui récupère les données de nutrition
  });

  // Gestion du chargement et des erreurs
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage />;
  if (!data)
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.
      </div>
    );

  // Affichage des données nutritionnelles sous forme de cartes
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
