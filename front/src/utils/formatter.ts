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
