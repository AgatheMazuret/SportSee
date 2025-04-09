import mockData from "./mocks/api.json";

const API_URL = import.meta.env.VITE_API_URL; // URL de l'API
const enableMock = import.meta.env.VITE_ENABLE_MOCKS === "true"; // Variable d'environnement pour activer les mocks
console.log(enableMock);
// Fonction pour récupérer les données depuis l'API si USE_MOCK_DATA est false
const getData = async (url: string) => {
  const res = await fetch(url); // Appel à l'API
  if (!res.ok) {
    console.error(`Erreur API : ${url} avec le statut ${res.status}`);
  }
  const data = await res.json(); // Conversion de la réponse en JSON
  return data.data;
};

export type ActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

// Fonction pour récupérer les données d'activité d'un utilisateur
export const fetchActivityData = async (
  userId: number
): Promise<ActivityData[]> => {
  if (enableMock) {
    const user = mockData.userActivity.find((u) => u.userId === userId);
    if (!user)
      throw new Error(
        `Activité non trouvée pour l'utilisateur avec ID ${userId}`
      );
    return user.sessions;
  }
  const data = await getData(`${API_URL}/user/${userId}/activity`);
  return data.sessions;
};

export interface NutritionDataType {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}

// Fonction pour récupérer les données nutritionnelles d'un utilisateur
export const fetchNutritionData = async (
  userId: number
): Promise<NutritionDataType> => {
  if (enableMock) {
    const user = mockData.userMainData.find((u) => u.id === userId);
    if (!user || !user.keyData)
      throw new Error(
        `Données nutritionnelles non trouvées pour l'utilisateur avec ID ${userId}`
      );
    return user.keyData;
  } else {
    const data = await getData(`${API_URL}/user/${userId}`);
    return data.keyData;
  }
};

export type PerformanceData = {
  kind: number;
  value: number;
};

// Fonction pour récupérer les données de performance d'un utilisateur
export const fetchPerformanceData = async (
  userId: number
): Promise<PerformanceData[]> => {
  if (enableMock) {
    const perf = mockData.userPerformance.find((p) => p.userId === userId);
    if (!perf)
      throw new Error(
        `Données de performance non trouvées pour l'utilisateur avec ID ${userId}`
      );

    return perf.data;
  } else {
    const data = await getData(`${API_URL}/user/${userId}/performance`);

    return data.data;
  }
};

// Fonction pour récupérer le score d'un utilisateur
export const fetchUserScore = async (userId: number): Promise<number> => {
  if (enableMock) {
    const user = mockData.userMainData.find((u) => u.id === userId);
    if (!user) throw new Error(`Utilisateur non trouvé avec ID ${userId}`);
    return user.todayScore ?? user.score;
  } else {
    const data = await getData(`${API_URL}/user/${userId}`);

    return data.todayScore ?? data.score;
  }
};

export type Length = {
  day: number;
  sessionLength: number;
};

// Fonction pour récupérer les données des sessions moyennes d'un utilisateur
export const fetchSessionData = async (userId: number): Promise<Length[]> => {
  if (enableMock) {
    const session = mockData.userAverageSessions.find(
      (s) => s.userId === userId
    );
    if (!session)
      throw new Error(
        `Sessions moyennes non trouvées pour l'utilisateur avec ID ${userId}`
      );
    return session.sessions;
  } else {
    const data = await getData(`${API_URL}/user/${userId}/average-sessions`);
    return data.sessions;
  }
};
export interface UserInfo {
  firstName: string;
  lastName: string;
  age: number;
}

// Fonction pour récupérer les informations d'un utilisateur
export const fetchUserInfo = async (userId: number): Promise<UserInfo> => {
  if (enableMock) {
    const user = mockData.userMainData.find((u) => u.id === userId);
    if (!user || !user.userInfos) {
      throw new Error(
        `Infos utilisateur non trouvées dans les mock pour l'utilisateur avec ID ${userId}`
      );
    }
    return user.userInfos;
  }
  const data = await getData(`${API_URL}/user/${userId}`);
  return data.userInfos;
};

// Fonction pour récupérer toutes les données d'un utilisateur
export const fetchAllUserData = async (userId: number) => {
  try {
    const [activity, nutrition, performance, score, sessions, userInfos] =
      await Promise.all([
        // Appel simultané des différentes fonctions
        fetchActivityData(userId),
        fetchNutritionData(userId),
        fetchPerformanceData(userId),
        fetchUserScore(userId),
        fetchSessionData(userId),
        fetchUserInfo(userId),
      ]);

    return {
      activity,
      nutrition,
      performance,
      score,
      sessions,
      userInfos,
      error: false,
    };
  } catch (error) {
    console.error(
      "❌ Erreur lors du chargement des données pour l'utilisateur:",
      error
    );
    return {
      activity: [],
      nutrition: null,
      performance: [],
      score: 0,
      sessions: [],
      userInfos: null,
      error: true,
    };
  }
};
