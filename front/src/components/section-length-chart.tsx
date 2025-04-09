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
    const sessionLength = payload[0]?.value ?? 0; // Durée de la session
    const dayIndex = payload[0]?.payload?.day ?? 1; // Indice du jour (1 = Lundi, 7 = Dimanche)
    const day = dayAbbreviations[dayIndex - 1] || ""; // Trouver l'abréviation du jour

    return (
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Fond sombre pour le tooltip
          color: "white", // Couleur du texte du tooltip
          padding: "5px", // Espacement interne du tooltip
          borderRadius: "5px", // Coins arrondis
        }}
      >
        <p>{`Jour: ${day}`}</p>
        <p>{`Durée de session: ${sessionLength} min`}</p>
      </div>
    );
  }
  return null; // Si le tooltip n'est pas actif, ne rien afficher
};

// Composant pour afficher le graphique de la durée des sessions
const SectionLengthChart = ({ userId }: { userId?: number }) => {
  // Fonction pour récupérer l'userId depuis l'URL si nécessaire
  const getUserIdFromUrl = () => {
    const regex = /[?&]userId=(\d+)/; // Expression régulière pour extraire l'userId
    const match = window.location.href.match(regex);
    return match ? parseInt(match[1], 10) : 12; // Retourne l'userId de l'URL ou 12 par défaut
  };

  const finalUserId = userId ?? getUserIdFromUrl(); // Utilisation de l'userId provenant de la prop ou de l'URL

  // Utilisation de React Query pour récupérer les données de session
  const {
    data = [], // Données de session, valeur par défaut vide si aucune donnée n'est récupérée
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessionData", finalUserId], // Clé de la requête pour la mise en cache
    queryFn: () => fetchSessionData(finalUserId), // Fonction pour récupérer les données de session
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null); // État pour gérer l'index du point actif dans le graphique

  // Gestion des états de chargement et d'erreur
  if (isLoading) return <div>Chargement...</div>; // Affiche un message de chargement pendant la récupération des données
  if (error) return <ErrorMessage />; // Affiche un message d'erreur si la requête échoue
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
          data={data} // Données à afficher dans le graphique
          onMouseMove={(e) => {
            if (e.isTooltipActive) {
              const index = e.activeTooltipIndex; // Récupère l'index du point actif lors du survol
              setActiveIndex(index !== undefined ? index : null); // Met à jour l'index actif
            }
          }}
          onMouseLeave={() => setActiveIndex(null)} // Réinitialise l'index actif lorsqu'on quitte le graphique
        >
          <CartesianGrid vertical={false} horizontal={false} />{" "}
          {/* Grille du graphique (pas de lignes verticales ni horizontales) */}
          <YAxis hide={true} /> {/* Cache l'axe Y (pas nécessaire ici) */}
          <XAxis
            dataKey="day" // Utilisation de la clé 'day' pour l'axe des X
            tickFormatter={(value) => dayAbbreviations[value - 1]} // Formattage des jours avec des abréviations
            tick={{ fill: "white" }} // Couleur des ticks de l'axe des X
            axisLine={false} // Cache la ligne de l'axe des X
            tickLine={false} // Cache les lignes des ticks
          />
          <Tooltip content={customTooltip} />{" "}
          {/* Utilisation du tooltip personnalisé */}
          <Line
            name="Durée moyenne des sessions"
            dataKey="sessionLength" // Utilisation de la clé 'sessionLength' pour les données des lignes
            stroke="white" // Couleur de la ligne
            strokeWidth={3} // Largeur de la ligne
            type="monotone" // Courbe lissée pour la ligne
            strokeLinejoin="round" // Coins arrondis pour les courbes
            dot={false} // Pas d'indicateurs (points) sur la ligne
            activeDot={{
              stroke: "rgba(255, 255, 255, 0.5)", // Couleur de l'indicateur actif
              strokeWidth: 10, // Largeur de l'indicateur actif
              r: 5, // Rayon de l'indicateur actif
              fill: "#fff", // Couleur de remplissage de l'indicateur actif
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectionLengthChart;
