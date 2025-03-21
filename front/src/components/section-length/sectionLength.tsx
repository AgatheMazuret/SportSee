import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Définition des types pour les données récupérées
type Length = {
  day: number;
  sessionLength: number;
};

// Définition des types pour les données formatées utilisées par le graphique
type FormattedLengthData = {
  day: number;
  sessionLength: number;
};

const SectionLengthChart = () => {
  const [data, setData] = useState<FormattedLengthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/user/12/average-sessions")
      .then((response) => response.json())
      .then((responseData: { data: { sessions: Length[] } }) => {
        // Transformation des données pour correspondre au format attendu par le graphique
        const formattedLengthData: FormattedLengthData[] =
          responseData.data.sessions.map((item: Length) => ({
            day: item.day, // Utilisation de "day" de la réponse de l'API
            sessionLength: item.sessionLength, // Utilisation de "sessionLength"
          }));

        console.log(
          "Données formatées pour le graphique :",
          formattedLengthData
        );

        setData(formattedLengthData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  console.log("Données finales envoyées au graphique :", data);

  // Tableau des premières lettres des jours
  const dayAbbreviations = ["L", "M", "M", "J", "V", "S", "D"]; // Lundi, Mardi, Mercredi, etc.

  // Fonction de formatage du Tooltip
  const customTooltip = ({ payload, label }: any) => {
    if (payload && payload.length > 0) {
      const { sessionLength } = payload[0].payload;
      const day = dayAbbreviations[label - 1]; // Récupérer le jour par son indice
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

  return (
    <div
      style={{
        width: 258,
        height: 263,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "red",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} style={{ backgroundColor: "red" }}>
          <CartesianGrid vertical={false} horizontal={false} />
          <YAxis hide={true} />
          <XAxis
            dataKey="day"
            tickFormatter={(value) => dayAbbreviations[value - 1]}
            tick={{ fill: "white" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={customTooltip} />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="right"
            formatter={() => "Durée moyenne des sessions"}
          />
          <Line
            dataKey="sessionLength"
            stroke="white"
            strokeWidth={3}
            type="monotone"
            strokeLinejoin="round"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectionLengthChart;
