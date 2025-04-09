import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchActivityData } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ErrorMessage from "./error-message";

// ========== Types communs ==========
// Déclaration des types pour les props des composants
interface ActivityChartProps {
  userId?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number }[]; // Données pour l'affichage du tooltip
}

interface LegendPayload {
  dataKey: string;
  color: string;
}

interface CustomLegendProps {
  payload: LegendPayload[];
}

// ========== Composants enfants ==========

// Composant pour afficher la légende du graphique
const CustomLegend = ({ payload = [] }: CustomLegendProps) => (
  <ul className="flex space-x-8">
    {payload.map((entry) => (
      <li key={entry.dataKey} className="flex items-center">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: entry.color }}
        ></div>
        <span className="ml-2">
          {entry.dataKey === "kilogram"
            ? "Poids (kg)"
            : "Calories brûlées (kCal)"}
        </span>
      </li>
    ))}
  </ul>
);

// Composant personnalisé pour afficher le tooltip dans le graphique
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length === 2) {
    const weight = payload.find((p) => p.dataKey === "kilogram")?.value; // Récupère le poids
    const calories = payload.find((p) => p.dataKey === "calories")?.value; // Récupère les calories

    return (
      <div
        className="text-white text-sm p-2 rounded"
        style={{
          backgroundColor: "#E60000",
          lineHeight: "1.5",
          textAlign: "center",
          width: "70px",
        }}
      >
        <p>{weight}kg</p>
        <p>{calories}Kcal</p>
      </div>
    );
  }

  return null; // Ne rien afficher si le tooltip n'est pas actif
};

// Composant pour afficher un message personnalisé à l'utilisateur
const Hello = ({ userId }: { userId: number }) => {
  const [firstName, setFirstName] = useState<string | null>(null); // État pour le prénom

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${userId}`); // Appel à l'API pour récupérer l'utilisateur
        if (!response.ok) throw new Error("Problème avec l'appel à l'API");

        const result = await response.json();
        setFirstName(
          result?.data?.userInfos?.firstName || "Utilisateur inconnu" // Récupère le prénom
        );
      } catch (error) {
        console.error("Erreur lors du fetch :", error);
        setFirstName("Erreur"); // Gestion des erreurs
      }
    };

    fetchUser(); // Appel de la fonction pour récupérer les données utilisateur
  }, [userId]); // Relancer l'effet lorsque userId change

  return (
    <div className="flex flex-col items-start justify-center mb-6">
      <p className="text-5xl">
        Bonjour{" "}
        <span className="text-red-500">
          {firstName === null ? "Chargement..." : firstName}
        </span>
      </p>
      {firstName && firstName !== "Erreur" && (
        <p className="text-lg mt-[41px]">
          Félicitations ! Vous avez explosé vos objectifs hier 👏
        </p>
      )}
    </div>
  );
};

// ========== Composant Principal Fusionné ==========

// Composant principal pour afficher le tableau de bord d'activité
const ActivityDashboard = ({ userId: propUserId }: ActivityChartProps) => {
  // Fonction pour récupérer l'userId à partir de l'URL (si non fourni dans les props)
  const getUserIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    return userId ? parseInt(userId, 10) : 12; // Si l'userId n'est pas trouvé dans l'URL, utiliser 12 par défaut
  };

  const userId = propUserId ?? getUserIdFromUrl(); // Utiliser soit le userId fourni en prop, soit celui de l'URL

  // Utilisation de React Query pour récupérer les données d'activité
  const { data, error, isLoading } = useQuery({
    queryKey: ["activity", userId],
    queryFn: () => fetchActivityData(userId), // Appel à la fonction fetchActivityData
    staleTime: 1000 * 60 * 5, // Les données restent fraîches pendant 5 minutes
  });

  // Fonction pour formater la date dans le graphique
  const formatDay = (date: string) => {
    const day = new Date(date).getDate();
    return day.toString(); // Retourne le jour du mois
  };

  if (isLoading) return <div>Chargement...</div>; // Affichage du message de chargement
  if (error) return <ErrorMessage />; // Affichage du message d'erreur
  if (!data || data.length === 0) {
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.{" "}
        {/* Affichage si aucune donnée n'est disponible */}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <Hello userId={userId} />{" "}
      {/* Affiche le message personnalisé à l'utilisateur */}
      {/* Titre + Légende */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-l font-semibold">Activité quotidienne</h3>
        <CustomLegend
          payload={[
            // Légende personnalisée avec les couleurs pour poids et calories
            { dataKey: "kilogram", color: "#282D30" },
            { dataKey: "calories", color: "#E60000" },
          ]}
        />
      </div>
      {/* Graphique */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="5 5" />
            <XAxis dataKey="day" tickFormatter={formatDay} />{" "}
            {/* Formatage des jours */}
            <YAxis orientation="right" />
            <Tooltip content={<CustomTooltip />} />{" "}
            {/* Affichage du tooltip personnalisé */}
            <Bar
              dataKey="kilogram"
              fill="#282D30"
              barSize={8}
              radius={[7, 7, 0, 0]} // Barres arrondies
            />
            <Bar
              dataKey="calories"
              fill="#E60000"
              barSize={8}
              radius={[7, 7, 0, 0]} // Barres arrondies
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityDashboard;
