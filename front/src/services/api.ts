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

/** Récupérer les données d'activité */
export const fetchActivityData = async (
  userId: number
): Promise<FormattedActivityData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/activity`);
    if (!response.ok) throw new Error("Erreur de chargement des activités");

    const responseData = await response.json();
    return responseData.data.sessions.map((item: ActivityData) => ({
      day: item.day,
      kilogram: item.kilogram,
      calories: item.calories,
    }));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des activités :", error);
    throw error;
  }
};

/** Structure des données nutritionnelles */
export interface NutritionDataType {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}

/** Récupérer les données nutritionnelles */
export const fetchNutritionData = async (
  userId: number
): Promise<NutritionDataType> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (!response.ok) throw new Error("Impossible de récupérer les données");

    const result = await response.json();
    if (!result.data?.keyData)
      throw new Error("Données nutritionnelles manquantes");

    return result.data.keyData;
  } catch (error) {
    console.error("❌ Erreur récupération nutrition :", error);
    throw error;
  }
};

/** Structure des performances */
export type PerformanceData = {
  subject: string;
  value: number;
};

/** Récupérer les performances */
export const fetchPerformanceData = async (
  userId: number
): Promise<PerformanceData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/performance`);
    if (!response.ok)
      throw new Error("Erreur de récupération des performances");

    const responseData = await response.json();
    if (!responseData.data?.data || !responseData.data?.kind)
      throw new Error("Format des données incorrect");

    const { data, kind } = responseData.data;

    return data.map((item: { kind: number; value: number }) => ({
      subject: kind[item.kind] || "Inconnu",
      value: item.value,
    }));
  } catch (error) {
    console.error("❌ Erreur récupération performance :", error);
    return [];
  }
};

/** Récupérer le score utilisateur */
export const fetchUserScore = async (userId: number): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (!response.ok) throw new Error("Erreur de récupération du score");

    const responseData = await response.json();
    const score = responseData.data?.todayScore ?? responseData.data?.score;
    if (score === undefined) throw new Error("Données score manquantes");

    return score;
  } catch (error) {
    console.error("❌ Erreur récupération score :", error);
    throw error;
  }
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

/** Récupérer la durée moyenne des sessions */
export const fetchSessionData = async (
  userId: number
): Promise<FormattedLengthData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/average-sessions`);
    if (!response.ok) throw new Error("Erreur récupération sessions");

    const responseData = await response.json();
    return responseData.data.sessions.map((item: Length) => ({
      day: item.day,
      sessionLength: item.sessionLength,
    }));
  } catch (error) {
    console.error("❌ Erreur récupération durée session :", error);
    return [];
  }
};
