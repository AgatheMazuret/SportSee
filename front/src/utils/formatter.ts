const subjectByKind: Record<number, string> = {
  1: "intensity",
  2: "speed",
  3: "strength",
  4: "endurance",
  5: "energy",
  6: "cardio",
};
// formatter fonction to format the data for the chart
export const formatPerformanceData = (
  data: { kind: number; value: number }[]
) => {
  return data.map((item) => {
    return {
      subject: subjectByKind[item.kind] || "Inconnu",
      kind: item.kind,
      value: item.value,
    };
  });
};

// Définition des types avec "type"
export type NutritionRawData = {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
};

export type NutritionItem = {
  icon: string;
  title: string;
  value: number;
  unit: string;
};

// Fonction pour transformer les données brutes en objets prêts à afficher
export const formatNutritionData = (
  data: NutritionRawData
): NutritionItem[] => {
  return [
    {
      icon: "/icon-calories.svg",
      title: "Calories",
      value: data.calorieCount,
      unit: "kCal",
    },
    {
      icon: "/icon-protein.svg",
      title: "Protéines",
      value: data.proteinCount,
      unit: "g",
    },
    {
      icon: "/icon-carbs.svg",
      title: "Glucides",
      value: data.carbohydrateCount,
      unit: "g",
    },
    {
      icon: "/icon-fat.svg",
      title: "Lipides",
      value: data.lipidCount,
      unit: "g",
    },
  ];
};
