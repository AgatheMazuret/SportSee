import { useQuery } from "@tanstack/react-query";
import { fetchSessionData } from "../services/api"; // Assure-toi d'avoir bien ce service d'API
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

const dayAbbreviations = ["L", "M", "M", "J", "V", "S", "D"];

// Fonction de Tooltip personnalisé pour afficher les données au survol
const customTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length > 0) {
    const sessionLength = payload[0]?.value ?? 0; // Durée de la session
    const dayIndex = payload[0]?.payload?.day ?? 1; // Index du jour
    const day = dayAbbreviations[dayIndex - 1] || ""; // Récupérer l'abréviation du jour

    return (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Fond sombre pour le tooltip
          color: "white",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <p>{`Jour: ${day}`}</p>
        <p>{`Durée de session: ${sessionLength} min`}</p>
      </div>
    );
  }
  return null;
};

const SectionLengthChart = ({ userId }: { userId?: number }) => {
  // Fonction pour récupérer l'userId à partir de l'URL si non fourni en prop
  const getUserIdFromUrl = () => {
    const regex = /[?&]userId=(\d+)/; // Expression régulière pour extraire userId de l'URL
    const match = window.location.href.match(regex);
    return match ? parseInt(match[1], 10) : 12;
  };

  // Prendre l'userId passé en prop ou celui extrait de l'URL
  const finalUserId = userId ?? getUserIdFromUrl();

  // Requête pour récupérer les données de session associées à l'userId
  const {
    data = [], // Données de session par défaut vides si aucune donnée disponible
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessionData", finalUserId], // Utilisation de l'userId comme clé de requête
    queryFn: () => fetchSessionData(finalUserId), // Fonction pour récupérer les données
  });

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  if (error || data.length === 0) {
    return <div>Aucune donnée disponible pour cet utilisateur.</div>;
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-red-600">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} horizontal={false} />{" "}
          {/* Grille du graphique */}
          <YAxis hide={true} /> {/* Masquer l'axe Y */}
          <XAxis
            dataKey="day" // Utilisation de 'day' pour l'axe X
            tickFormatter={(value) => dayAbbreviations[value - 1]} // Formater les ticks pour afficher les abréviations des jours
            tick={{ fill: "white" }} // Couleur des ticks en blanc
            axisLine={false} // Supprimer la ligne de l'axe X
            tickLine={false} // Supprimer les lignes de ticks
          />
          <Tooltip content={customTooltip} />{" "}
          {/* Affichage du tooltip personnalisé */}
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="right"
            formatter={(value) => (
              <span style={{ color: "white" }}>{value}</span> // Formater le texte de la légende
            )}
          />
          <Line
            name="Durée moyenne des sessions" // Nom de la ligne
            dataKey="sessionLength" // Clé de données utilisée pour la ligne
            stroke="white" // Couleur de la ligne
            strokeWidth={3} // Largeur de la ligne
            type="monotone" // Type de ligne (lisse)
            strokeLinejoin="round" // Arrondi des joints de la ligne
            dot={false} // Désactiver l'affichage des points sur la ligne
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectionLengthChart;
