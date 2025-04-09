import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSessionData } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import ErrorMessage from "./error-message";

const dayAbbreviations = ["L", "M", "M", "J", "V", "S", "D"];

// Fonction personnalisée pour afficher le tooltip
const customTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length > 0) {
    const sessionLength = payload[0]?.value ?? 0;
    const dayIndex = payload[0]?.payload?.day ?? 1;
    const day = dayAbbreviations[dayIndex - 1] || "";

    return (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
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

// Composant pour afficher le graphique de la durée des sessions
const SectionLengthChart = ({ userId }: { userId?: number }) => {
  // Fonction pour récupérer l'userId depuis l'URL si nécessaire
  const getUserIdFromUrl = () => {
    const regex = /[?&]userId=(\d+)/;
    const match = window.location.href.match(regex);
    return match ? parseInt(match[1], 10) : 12;
  };

  const finalUserId = userId ?? getUserIdFromUrl();

  // Utilisation de React Query pour récupérer les données de session
  const {
    data = [], // Données de session, valeur par défaut vide si aucune donnée n'est récupérée
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessionData", finalUserId],
    queryFn: () => fetchSessionData(finalUserId),
    staleTime: 1000 * 60 * 5,
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Gestion des états de chargement et d'erreur
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage />;
  if (!data || data.length === 0)
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.{" "}
        {/* Message si aucune donnée n'est trouvée */}
      </div>
    );

  // Largeur dynamique de la bande rouge foncé en fonction de l'index actif
  const rightOverlayWidth =
    activeIndex !== null && data.length > 1
      ? `${((data.length - 1 - activeIndex) / (data.length - 1)) * 100}%`
      : "0%";

  return (
    <div className="relative w-full h-full pt-[55px] rounded-xl overflow-hidden bg-red-600">
      {/* Titre centré au-dessus du graphique */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white text-opacity-50 text-sm font-medium z-10">
        Durée moyenne des sessions
      </div>

      {/* Bande dynamique rouge foncé (effet de survol) */}
      <div
        className="absolute top-0 bottom-0 right-0 bg-[#c20000] opacity-70 z-0 transition-all duration-200"
        style={{ width: rightOverlayWidth }}
      />

      {/* Conteneur Responsive pour afficher le graphique à taille adaptative */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          onMouseMove={(e) => {
            if (e.isTooltipActive) {
              const index = e.activeTooltipIndex;
              setActiveIndex(index !== undefined ? index : null);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid vertical={false} horizontal={false} />{" "}
          {/* Grille du graphique (pas de lignes verticales ni horizontales) */}
          <YAxis hide={true} /> {/* Cache l'axe Y (pas nécessaire ici) */}
          <XAxis
            dataKey="day"
            tickFormatter={(value) => dayAbbreviations[value - 1]}
            tick={{ fill: "white" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={customTooltip} />{" "}
          {/* Utilisation du tooltip personnalisé */}
          <Line
            name="Durée moyenne des sessions"
            dataKey="sessionLength"
            stroke="white"
            strokeWidth={3}
            type="monotone"
            strokeLinejoin="round"
            dot={false}
            activeDot={{
              stroke: "rgba(255, 255, 255, 0.5)",
              strokeWidth: 10,
              r: 5,
              fill: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectionLengthChart;
