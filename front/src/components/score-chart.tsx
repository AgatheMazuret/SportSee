import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchUserScore } from "../services/api"; // Importation du service

const ScoreChart = ({ userId: propUserId }: { userId?: number }) => {
  // Récupérer l'URL actuelle
  const url = window.location.href;

  // Expression régulière pour trouver le paramètre 'userId' dans l'URL
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Si un userId est trouvé, l'utiliser. Sinon, utiliser 12 par défaut.
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  const {
    data: score,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userScore", userId], // ID utilisateur en paramètre
    queryFn: () => fetchUserScore(12),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error || score === null) return <div>Aucune donnée disponible</div>;

  const data = [
    { name: "Score", value: score * 100, color: "#FF0101" },
    { name: "Reste", value: 100 - score * 100, color: "#FBFBFB" },
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100 relative">
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
            {data.map((cell) => (
              <Cell key={`cell-${cell.name}`} fill={cell.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-lg font-bold text-gray-800">
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {score * 100}%
        </div>
        <div style={{ fontSize: "12px", color: "#74798C" }}>
          de votre objectif
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
