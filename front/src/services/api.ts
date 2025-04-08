const API_BASE_URL = "http://localhost:3000/user";

/** Structure des données d'activité */
export type ActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

export type FormattedActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

/** Récupérer les données d'activité d'un utilisateur */
export const fetchActivityData = async (
  userId: number
): Promise<FormattedActivityData[]> => {
  const response = await fetch(`${API_BASE_URL}/${userId}/activity`);
  if (!response.ok) throw new Error("Erreur de chargement des activités");

  const responseData = await response.json();
  return responseData.data.sessions.map((item: ActivityData) => ({
    day: item.day,
    kilogram: item.kilogram,
    calories: item.calories,
  }));
};

/** Structure des données nutritionnelles */
export interface NutritionDataType {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}

/** Récupérer les données nutritionnelles d'un utilisateur */
export const fetchNutritionData = async (
  userId: number
): Promise<NutritionDataType> => {
  const response = await fetch(`${API_BASE_URL}/${userId}`);
  if (!response.ok) throw new Error("Impossible de récupérer les données");

  const result = await response.json();
  if (!result.data?.keyData)
    throw new Error("Données nutritionnelles manquantes");

  return result.data.keyData;
};

/** Structure des performances physiques */
export type PerformanceData = {
  subject: string;
  value: number;
};

/** Récupérer les performances d'un utilisateur */
export const fetchPerformanceData = async (
  userId: number
): Promise<PerformanceData[]> => {
  const response = await fetch(`${API_BASE_URL}/${userId}/performance`);
  if (!response.ok) throw new Error("Erreur de récupération des performances");

  const responseData = await response.json();
  if (!responseData.data?.data || !responseData.data?.kind)
    throw new Error("Format des données incorrect");

  const { data, kind } = responseData.data;

  return data.map((item: { kind: number; value: number }) => ({
    subject: kind[item.kind] || "Inconnu",
    value: item.value,
  }));
};

/** Récupérer le score d'un utilisateur */
export const fetchUserScore = async (userId: number): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/${userId}`);
  if (!response.ok) throw new Error("Erreur de récupération du score");

  const responseData = await response.json();
  const score = responseData.data?.todayScore ?? responseData.data?.score;
  if (score === undefined) throw new Error("Données score manquantes");

  return score;
};

/** Structure des sessions moyennes */
export type Length = {
  day: number;
  sessionLength: number;
};

export type FormattedLengthData = {
  day: number;
  sessionLength: number;
};

/** Récupérer la durée moyenne des sessions d'un utilisateur */
export const fetchSessionData = async (
  userId: number
): Promise<FormattedLengthData[]> => {
  const response = await fetch(`${API_BASE_URL}/${userId}/average-sessions`);
  if (!response.ok) throw new Error("Erreur récupération sessions");

  const responseData = await response.json();
  return responseData.data.sessions.map((item: Length) => ({
    day: item.day,
    sessionLength: item.sessionLength,
  }));
};

/** Récupérer toutes les données utilisateur en une seule fois */
export const fetchAllUserData = async (userId: number) => {
  try {
    const [activity, nutrition, performance, score, sessions] =
      await Promise.all([
        fetchActivityData(userId),
        fetchNutritionData(userId),
        fetchPerformanceData(userId),
        fetchUserScore(userId),
        fetchSessionData(userId),
      ]);

    return {
      activity,
      nutrition,
      performance,
      score,
      sessions,
      error: false,
    };
  } catch (error) {
    console.error("❌ Une erreur est survenue :", error);
    return {
      activity: [],
      nutrition: null,
      performance: [],
      score: 0,
      sessions: [],
      error: true,
    };
  }
};
