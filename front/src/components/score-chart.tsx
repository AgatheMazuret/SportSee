import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchUserScore } from "../services/api";
import ErrorMessage from "./error-message";

const ScoreChart = ({ userId: propUserId }: { userId?: number }) => {
  const url = window.location.href;

  // Expression régulière pour extraire le userId de l'URL si disponible
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Déterminer l'userId à utiliser : priorité à la prop, sinon prendre celui de l'URL ou 12 par défaut
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  // Effectuer la requête pour récupérer le score de l'utilisateur
  const {
    data: score,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userScore", userId], // Clé de la requête pour la mise en cache
    queryFn: () => fetchUserScore(userId), // Fonction pour récupérer le score de l'utilisateur
  });

  // Gestion du chargement et des erreurs
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage />;
  if (score === null)
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.
      </div>
    );

  const data = [
    { name: "Score", value: (score ?? 0) * 100, color: "#FF0101" }, // Données du score
    { name: "Reste", value: 100 - (score ?? 0) * 100, color: "#FBFBFB" }, // le pourcentage à atteindre
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 relative">
      {/* Titre "Score" en haut à gauche */}
      <div className="absolute top-4 left-4 text-l font-semibold text-gray-800">
        Score
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value" // Utilisation de la clé 'value' pour les valeurs
            nameKey="name" // Utilisation de la clé 'name' pour les noms
            cx="50%" // Centre du graphique sur l'axe horizontal
            cy="50%" // Centre du graphique sur l'axe vertical
            innerRadius={80} // Rayon intérieur du graphique circulaire
            outerRadius={90} // Rayon extérieur du graphique circulaire
            startAngle={90} // Angle de départ du graphique
            endAngle={90 + 360} // Angle de fin du graphique
            fill="#FFF" // Couleur de remplissage du graphique
            stroke="none" // Pas de bordure pour les segments du graphique
            cornerRadius={10} // Bords arrondis des segments
          >
            {/* Générer des cellules pour chaque segment du graphique avec la couleur appropriée */}
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
          {/* Afficher le score sous forme de pourcentage */}
        </div>
        <div style={{ fontSize: "12px", color: "#74798C" }}>
          de votre objectif
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
