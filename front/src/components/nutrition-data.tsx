import { useQuery } from "@tanstack/react-query";
import { fetchNutritionData, NutritionDataType } from "../services/api";
import Card from "./card";
import { useState, useEffect } from "react";
import ErrorMessage from "./error-message";

// Composant principal pour afficher les données nutritionnelles
const NutritionData = ({ userId: propUserId }: { userId?: number }) => {
  // État local pour stocker l'userId, initialisé à 12 par défaut
  const [userId, setUserId] = useState<number>(12);

  useEffect(() => {
    // Effet qui récupère l'userId depuis l'URL ou depuis la prop si disponible
    const urlParams = new URLSearchParams(window.location.search);
    const newUserId =
      propUserId ?? parseInt(urlParams.get("userId") || "12", 10); // Si l'URL a un userId, on l'utilise, sinon on prend 12

    setUserId(newUserId); // Met à jour l'état local avec le userId trouvé
  }, [propUserId]); // Relance l'effet uniquement si propUserId change

  // Utilisation de React Query pour récupérer les données de nutrition
  const { data, error, isLoading } = useQuery<NutritionDataType, Error>({
    queryKey: ["nutritionData", userId], // Clé de la requête pour la mise en cache et l'identification de la donnée
    queryFn: () => fetchNutritionData(userId), // Fonction qui récupère les données nutritionnelles à partir du service API
  });

  // Gestion du chargement et des erreurs
  if (isLoading) return <div>Chargement...</div>; // Affiche un message pendant le chargement
  if (error) return <ErrorMessage />; // Affiche un message d'erreur si la requête échoue
  if (!data)
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.{" "}
        {/* Affiche un message si aucune donnée n'est trouvée */}
      </div>
    );

  // Affichage des données nutritionnelles sous forme de cartes
  return (
    <div className="flex flex-col items-center gap-17 max-[1440px]:gap-11">
      {/* Carte pour afficher les calories */}
      <Card
        icon="/icon-calories.svg"
        title="Calories"
        value={data.calorieCount}
        unit="kCal"
      />
      {/* Carte pour afficher les protéines */}
      <Card
        icon="/icon-protein.svg"
        title="Protéines"
        value={data.proteinCount}
        unit="g"
      />
      {/* Carte pour afficher les glucides */}
      <Card
        icon="/icon-carbs.svg"
        title="Glucides"
        value={data.carbohydrateCount}
        unit="g"
      />
      {/* Carte pour afficher les lipides */}
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
