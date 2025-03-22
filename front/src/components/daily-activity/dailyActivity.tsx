import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Définition des types pour les données récupérées
type ActivityData = {
  day: string; // Correspond à la date dans la réponse de l'API
  kilogram: number; // Correspond au poids dans la réponse de l'API
  calories: number; // Correspond aux calories brûlées dans la réponse de l'API
};

// Définition des types pour les données formatées utilisées par le graphique
type FormattedActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

const ActivityChart = () => {
  const [data, setData] = useState<FormattedActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/user/12/activity")
      .then((response) => response.json())
      .then((responseData: { data: { sessions: ActivityData[] } }) => {
        // Transformation des données pour correspondre au format attendu par le graphique
        const formattedData: FormattedActivityData[] =
          responseData.data.sessions.map((item: ActivityData) => ({
            day: item.day, // Utilisation de "day" de la réponse de l'API
            kilogram: item.kilogram, // Utilisation de "kilogram"
            calories: item.calories, // Utilisation de "calories"
          }));

        setData(formattedData);
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

  // Fonction pour formatter le jour à partir de la date complète (au format 'YYYY-MM-DD')
  const formatDay = (date: string) => {
    const day = new Date(date).getDate(); // Récupérer uniquement le jour du mois
    return day.toString();
  };

  return (
    <ResponsiveContainer width={835} height={320}>
      <BarChart data={data} style={{ backgroundColor: "#FBFBFB" }}>
        <CartesianGrid vertical={false} strokeDasharray="5 5" />
        {/* Personnalisation de l'axe X pour afficher juste le jour */}
        <XAxis
          dataKey="day"
          tickFormatter={formatDay} // Formattage de l'axe X pour afficher seulement le jour
        />
        <YAxis orientation="right" />
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="top" align="right" />
        <Bar dataKey="kilogram" fill="#282D30" barSize={7} radius={3} />
        <Bar dataKey="calories" fill="#E60000" barSize={7} radius={3} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;
