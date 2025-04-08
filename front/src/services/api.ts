// Définir un flag pour choisir entre les données mock et les données du backend
const USE_MOCK_DATA = true; // Mets à false pour utiliser les vraies données du backend

import mockData from "../../public/mock-data.json";

// Fonction d'aide pour récupérer les données depuis l'API si USE_MOCK_DATA est false
const getData = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API : ${url}`);
  const data = await res.json();
  return data.data;
};

/** Structure des données d'activité */
export type ActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

export const fetchActivityData = async (
  userId: number
): Promise<ActivityData[]> => {
  if (USE_MOCK_DATA) {
    const user = mockData.userActivity.find(
      (u: { userId: number }) => u.userId === userId
    );
    if (!user) throw new Error("Activité non trouvée");
    return user.sessions;
  } else {
    const data = await getData(`http://localhost:3000/user/${userId}/activity`);
    return data.sessions;
  }
};

/** Structure des données nutritionnelles */
export interface NutritionDataType {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}

export const fetchNutritionData = async (
  userId: number
): Promise<NutritionDataType> => {
  if (USE_MOCK_DATA) {
    const user = mockData.userMainData.find(
      (u: { id: number }) => u.id === userId
    );
    if (!user || !user.keyData)
      throw new Error("Données nutritionnelles non trouvées");
    return user.keyData;
  } else {
    const data = await getData(`http://localhost:3000/user/${userId}`);
    return data.keyData;
  }
};

/** Structure des performances physiques */
export type PerformanceData = {
  subject: string;
  value: number;
};

export const fetchPerformanceData = async (
  userId: number
): Promise<PerformanceData[]> => {
  if (USE_MOCK_DATA) {
    const perf = mockData.userPerformance.find(
      (p: { userId: number }) => p.userId === userId
    );
    if (!perf) throw new Error("Données de performance non trouvées");
    return perf.data.map((item: { kind: number; value: number }) => ({
      subject:
        perf.kind[item.kind as unknown as keyof typeof perf.kind] || "Inconnu",
      value: item.value,
    }));
  } else {
    const data = await getData(
      `http://localhost:3000/user/${userId}/performance`
    );
    return data.data.map((item: { kind: string; value: number }) => ({
      subject: item.kind,
      value: item.value,
    }));
  }
};

/** Récupérer le score d'un utilisateur */
export const fetchUserScore = async (userId: number): Promise<number> => {
  if (USE_MOCK_DATA) {
    const user = mockData.userMainData.find(
      (u: { id: number }) => u.id === userId
    );
    if (!user) throw new Error("Utilisateur non trouvé");
    return user.todayScore ?? user.score;
  } else {
    const data = await getData(`http://localhost:3000/user/${userId}`);
    return data.todayScore ?? data.score;
  }
};

/** Moyenne des sessions */
export type Length = {
  day: number;
  sessionLength: number;
};

export const fetchSessionData = async (userId: number): Promise<Length[]> => {
  if (USE_MOCK_DATA) {
    const session = mockData.userAverageSessions.find(
      (s: { userId: number }) => s.userId === userId
    );
    if (!session) throw new Error("Sessions moyennes non trouvées");
    return session.sessions;
  } else {
    const data = await getData(
      `http://localhost:3000/user/${userId}/average-sessions`
    );
    return data.sessions;
  }
};

/** Regrouper les données */
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
    console.error("❌ Erreur lors du chargement :", error);
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
