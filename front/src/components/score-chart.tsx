import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchUserScore } from "../services/api";
import ErrorMessage from "./error-message";

// Composant pour afficher le graphique du score de l'utilisateur
const ScoreChart = ({ userId: propUserId }: { userId?: number }) => {
  const url = window.location.href;

  // Expression régulière pour extraire le userId de l'URL si disponible
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Déterminer l'userId à utiliser : priorité à la prop, sinon celui de l'URL ou 12 par défaut
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  // Utilisation de React Query pour récupérer le score de l'utilisateur
  const {
    data: score,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userScore", userId],
    queryFn: () => fetchUserScore(userId),
    staleTime: 1000 * 60 * 5,
  });

  // Gestion des états de chargement et d'erreur
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage />;
  if (score === null)
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.{" "}
        {/* Message si aucune donnée n'est trouvée */}
      </div>
    );

  // Préparation des données pour le graphique : score et reste à atteindre
  const data = [
    { name: "Score", value: (score ?? 0) * 100, color: "#FF0101" },
    { name: "Reste", value: 100 - (score ?? 0) * 100, color: "#FBFBFB" },
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 relative">
      {/* Titre "Score" positionné en haut à gauche */}
      <div className="absolute top-4 left-4 text-l font-semibold text-gray-800">
        Score
      </div>

      {/* Conteneur Responsive pour afficher le graphique à taille adaptative */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={90}
            startAngle={90}
            endAngle={90 + 360}
            fill="#FFF"
            stroke="none"
            cornerRadius={10}
          >
            {/* Génération des segments du graphique avec la couleur appropriée */}
            {data.map((cell) => (
              <Cell key={`cell-${cell.name}`} fill={cell.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Affichage du score au centre du graphique */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-lg font-bold text-gray-800">
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {(score ?? 0) * 100}%{" "}
        </div>
        <div style={{ fontSize: "12px", color: "#74798C" }}>
          de votre objectif
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
