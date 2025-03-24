import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#FF0101", "#FBFBFB"];

const ScoreChart = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/user/12")
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.data || responseData.data.todayScore === undefined) {
          throw new Error("Données manquantes");
        }

        setScore(responseData.data.todayScore);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de chargement :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (score === null) return <div>Aucune donnée disponible</div>;

  const data = [
    { name: "Score", value: score * 100 },
    { name: "Reste", value: 100 - score * 100 },
  ];

  return (
    <div
      style={{
        width: 258,
        height: 263,
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
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
            endAngle={90 + score * 360}
            fill="#FF0101"
            stroke="none"
            cornerRadius={10}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#282D30",
        }}
      >
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
