import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchUserScore } from "../../services/api"; // Importation du service

const ScoreChart = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getScore = async () => {
      try {
        const userScore = await fetchUserScore(12); // ID utilisateur en paramètre
        setScore(userScore);
      } catch (error) {
        console.error("Erreur lors de la récupération du score :", error);
      } finally {
        setLoading(false);
      }
    };

    getScore();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (score === null) return <div>Aucune donnée disponible</div>;

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
