import { useQuery } from "@tanstack/react-query";
import { fetchNutritionData, NutritionDataType } from "../services/api";
import Card from "./card";
import { useState, useEffect } from "react";
import ErrorMessage from "./error-message";
import { formatNutritionData } from "../utils/formatter";

// Composant principal pour afficher les données nutritionnelles
const NutritionData = ({ userId: propUserId }: { userId?: number }) => {
  // État local pour stocker l'userId, initialisé à 12 par défaut
  const [userId, setUserId] = useState<number>(12);

  useEffect(() => {
    // Effet qui récupère l'userId depuis l'URL ou depuis la prop si disponible
    const urlParams = new URLSearchParams(window.location.search);
    const newUserId =
      propUserId ?? parseInt(urlParams.get("userId") || "12", 10);

    setUserId(newUserId);
  }, [propUserId]);

  // Utilisation de React Query pour récupérer les données de nutrition
  const { data, error, isLoading } = useQuery<NutritionDataType, Error>({
    queryKey: ["nutritionData", userId],
    queryFn: () => fetchNutritionData(userId),
    staleTime: 1000 * 60 * 5,
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

  const nutritionItems = formatNutritionData(data);

  // Affichage des données nutritionnelles sous forme de cartes
  return (
    <div className="flex flex-col items-center gap-17 max-[1440px]:gap-16">
      {nutritionItems.map((item) => (
        <Card
          key={item.title}
          icon={item.icon}
          title={item.title}
          value={item.value}
          unit={item.unit}
        />
      ))}
    </div>
  );
};

export default NutritionData;
