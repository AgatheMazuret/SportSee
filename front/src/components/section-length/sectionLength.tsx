import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

  return (
    <LineChart data={data} style={{ backgroundColor: "#FBFBFB" }}>
      <CartesianGrid vertical={false} strokeDasharray="5 5" />
      <XAxis dataKey="day" />
      <YAxis orientation="right" />
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="top" align="right" />
      <Line dataKey="sessionLength" stroke="#E60000" />
    </LineChart>
  );
};

export default SectionLengthChart;
