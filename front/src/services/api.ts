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
  try {
    // Récupère les données d'activité depuis l'API
    const response = await fetch(`${API_BASE_URL}/${userId}/activity`);
    if (!response.ok) throw new Error("Erreur de chargement des activités");

    const responseData = await response.json();
    // Formate et retourne les données
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

/** Récupérer les données nutritionnelles d'un utilisateur */
export const fetchNutritionData = async (
  userId: number
): Promise<NutritionDataType> => {
  try {
    // Récupère les données nutritionnelles depuis l'API
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (!response.ok) throw new Error("Impossible de récupérer les données");

    const result = await response.json();
    if (!result.data?.keyData)
      throw new Error("Données nutritionnelles manquantes");

    // Retourne les données nutritionnelles
    return result.data.keyData;
  } catch (error) {
    console.error("❌ Erreur récupération nutrition :", error);
    throw error;
  }
};

/** Structure des performances physiques */
export type PerformanceData = {
  subject: string; // Sujet de performance (ex : force, endurance)
  value: number;
};

/** Récupérer les performances d'un utilisateur */
export const fetchPerformanceData = async (
  userId: number
): Promise<PerformanceData[]> => {
  try {
    // Récupère les données de performances depuis l'API
    const response = await fetch(`${API_BASE_URL}/${userId}/performance`);
    if (!response.ok)
      throw new Error("Erreur de récupération des performances");

    const responseData = await response.json();
    if (!responseData.data?.data || !responseData.data?.kind)
      throw new Error("Format des données incorrect");

    const { data, kind } = responseData.data;

    // Formate et retourne les performances
    return data.map((item: { kind: number; value: number }) => ({
      subject: kind[item.kind] || "Inconnu", // Mappe le type de performance
      value: item.value, // Valeur de la performance
    }));
  } catch (error) {
    console.error("❌ Erreur récupération performance :", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

/** Récupérer le score d'un utilisateur */
export const fetchUserScore = async (userId: number): Promise<number> => {
  try {
    // Récupère le score de l'utilisateur depuis l'API
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

/** Récupérer la durée moyenne des sessions d'un utilisateur */
export const fetchSessionData = async (
  userId: number
): Promise<FormattedLengthData[]> => {
  try {
    // Récupère les données de durée de session depuis l'API
    const response = await fetch(`${API_BASE_URL}/${userId}/average-sessions`);
    if (!response.ok) throw new Error("Erreur récupération sessions");

    const responseData = await response.json();
    // Formate et retourne les données
    return responseData.data.sessions.map((item: Length) => ({
      day: item.day,
      sessionLength: item.sessionLength,
    }));
  } catch (error) {
    console.error("❌ Erreur récupération durée session :", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};
