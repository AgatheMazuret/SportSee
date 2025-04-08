import { useQuery } from "@tanstack/react-query";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { fetchPerformanceData } from "../services/api";
import ErrorMessage from "./error-message";

const PerformanceChart = ({ userId: propUserId }: { userId?: number }) => {
  const url = window.location.href;

  // Expression régulière pour extraire l'userId de l'URL si disponible
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Déterminer l'userId à utiliser : priorité à la prop, sinon prendre celui de l'URL ou 12 par défaut
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  // Effectuer la requête pour récupérer les données de performance
  const {
    data = [], // Données de performance, valeur par défaut vide si aucune donnée n'est récupérée
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performanceData", userId], // Clé de la requête pour la mise en cache
    queryFn: () => fetchPerformanceData(userId), // Fonction pour récupérer les données de performance
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

  // Affichage du graphique radar avec les données de performance
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-[#282D30]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={80} data={data}>
          {" "}
          {/* Dimensions du graphique radar */}
          <PolarGrid stroke="#FFFFFF" strokeOpacity={0.5} />{" "}
          {/* Grille polaire */}
          <PolarAngleAxis
            dataKey="subject" // Utilisation de la clé 'subject' pour l'axe des angles
            tick={{ fill: "#FFFFFF", fontSize: 12 }} // Configuration des ticks de l'axe
          />
          <PolarRadiusAxis tick={false} axisLine={false} />{" "}
          {/* Suppression des ticks et de la ligne de l'axe radial */}
          <Radar
            name="Utilisateur" // Nom de la série de données
            dataKey="value" // Utilisation de la clé 'value' pour la valeur du radar
            stroke="#FF0101" // Couleur de la ligne
            fill="#FF0101" // Couleur de la zone remplie
            fillOpacity={0.6} // Opacité du remplissage
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
