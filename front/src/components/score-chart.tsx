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
    queryKey: ["userScore", userId], // Clé de la requête pour la mise en cache
    queryFn: () => fetchUserScore(userId), // Fonction pour récupérer le score de l'utilisateur
  });

  // Gestion des états de chargement et d'erreur
  if (isLoading) return <div>Chargement...</div>; // Affiche un message de chargement pendant la récupération des données
  if (error) return <ErrorMessage />; // Affiche un message d'erreur si la requête échoue
  if (score === null)
    return (
      <div className="text-center">
        Aucune donnée disponible pour cet utilisateur.{" "}
        {/* Message si aucune donnée n'est trouvée */}
      </div>
    );

  // Préparation des données pour le graphique : score et reste à atteindre
  const data = [
    { name: "Score", value: (score ?? 0) * 100, color: "#FF0101" }, // Score de l'utilisateur
    { name: "Reste", value: 100 - (score ?? 0) * 100, color: "#FBFBFB" }, // Le pourcentage restant pour atteindre l'objectif
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
            data={data} // Données à afficher dans le graphique
            dataKey="value" // Utilisation de la clé 'value' pour les valeurs du graphique
            nameKey="name" // Utilisation de la clé 'name' pour les étiquettes du graphique
            cx="50%" // Centre du graphique sur l'axe horizontal
            cy="50%" // Centre du graphique sur l'axe vertical
            innerRadius={80} // Rayon intérieur du graphique circulaire
            outerRadius={90} // Rayon extérieur du graphique circulaire
            startAngle={90} // Angle de départ du graphique (rotation du graphique)
            endAngle={90 + 360} // Angle de fin du graphique
            fill="#FFF" // Couleur de remplissage des segments
            stroke="none" // Pas de bordure pour les segments du graphique
            cornerRadius={10} // Bords arrondis des segments
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
          {/* Affichage du score sous forme de pourcentage (ex: 75%) */}
        </div>
        <div style={{ fontSize: "12px", color: "#74798C" }}>
          de votre objectif
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
