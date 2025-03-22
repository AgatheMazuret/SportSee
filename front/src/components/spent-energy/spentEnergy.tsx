import { useEffect, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

type DataItem = {
  kind: number;
  value: number;
};

const PerformanceChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/user/12/performance")
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.data) throw new Error("Données manquantes");

        const { data, kind } = responseData.data;

        if (!data || !kind) throw new Error("Format des données incorrect");

        // Formater les données avec leur libellé
        const formattedData = data.map((item: DataItem) => ({
          subject: kind[item.kind], // Conversion du kind en libellé
          value: item.value,
        }));

        setData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de chargement :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  if (data.length === 0) return <div>Aucune donnée disponible</div>;

  return (
    <div
      style={{
        width: 258,
        height: 263,
        backgroundColor: "#282D30",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={80} data={data}>
          <PolarGrid stroke="#FFFFFF" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#FFFFFF", fontSize: 12 }}
          />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar
            name="Utilisateur"
            dataKey="value"
            stroke="#FF0101"
            fill="#FF0101"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
