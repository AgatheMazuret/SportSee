// Fonction pour lire la valeur de USE_MOCK_DATA dans le localStorage
const shouldUseMock = () => {
  const stored = localStorage.getItem("USE_MOCK_DATA");
  return stored ? JSON.parse(stored) : false; // Retourne false si aucune valeur n'est trouvée
};

import mockData from "../../public/mock-data.json";

// Fonction pour récupérer les données depuis l'API si USE_MOCK_DATA est false
const getData = async (url: string) => {
  try {
    const res = await fetch(url); // Appel à l'API
    if (!res.ok) {
      console.error(`Erreur API : ${url} avec le statut ${res.status}`);
      throw new Error(`Erreur API : ${url}`);
    }
    const data = await res.json(); // Conversion de la réponse en JSON
    return data.data;
  } catch (error) {
    console.error(
      `Erreur lors du chargement des données depuis ${url}:`,
      error
    );
    throw error;
  }
};

// Structure des données d'activité
export type ActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

// Fonction pour récupérer les données d'activité d'un utilisateur
export const fetchActivityData = async (
  userId: number
): Promise<ActivityData[]> => {
  console.log(
    `Fetching activity data for userId ${userId} with USE_MOCK_DATA = ${shouldUseMock()}`
  );

  if (shouldUseMock()) {
    const user = mockData.userActivity.find(
      (u: { userId: number }) => u.userId === userId
    ); // Recherche des données dans le mock
    if (!user)
      throw new Error(
        `Activité non trouvée pour l'utilisateur avec ID ${userId}`
      );
    console.log("Données mock pour l'activité:", user.sessions);
    return user.sessions;
  } else {
    const data = await getData(`http://localhost:3000/user/${userId}/activity`); // Récupération des données depuis l'API
    console.log("Données backend pour l'activité:", data.sessions);
    return data.sessions;
  }
};

// Structure des données nutritionnelles
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
  console.log(
    `Fetching nutrition data for userId ${userId} with USE_MOCK_DATA = ${shouldUseMock()}`
  );

  if (shouldUseMock()) {
    const user = mockData.userMainData.find(
      (u: { id: number }) => u.id === userId
    ); // Recherche dans les données mock
    if (!user || !user.keyData)
      throw new Error(
        `Données nutritionnelles non trouvées pour l'utilisateur avec ID ${userId}`
      );
    console.log("Données mock pour la nutrition:", user.keyData);
    return user.keyData;
  } else {
    const data = await getData(`http://localhost:3000/user/${userId}`); // Récupération des données depuis l'API
    console.log("Données backend pour la nutrition:", data.keyData);
    return data.keyData;
  }
};

// Structure des données de performance
export type PerformanceData = {
  subject: string;
  value: number;
};

// Fonction pour récupérer les données de performance d'un utilisateur
export const fetchPerformanceData = async (
  userId: number
): Promise<PerformanceData[]> => {
  console.log(
    `Fetching performance data for userId ${userId} with USE_MOCK_DATA = ${shouldUseMock()}`
  );

  if (shouldUseMock()) {
    const perf = mockData.userPerformance.find(
      (p: { userId: number }) => p.userId === userId
    ); // Recherche dans les données mock
    if (!perf)
      throw new Error(
        `Données de performance non trouvées pour l'utilisateur avec ID ${userId}`
      );

    const performanceData = perf.data.map(
      (item: { kind: number; value: number }) => ({
        subject:
          perf.kind[item.kind as unknown as keyof typeof perf.kind] ||
          "Inconnu", // Récupération du sujet de performance
        value: item.value,
      })
    );

    console.log("Données mock pour la performance:", performanceData);
    return performanceData;
  } else {
    const data = await getData(
      `http://localhost:3000/user/${userId}/performance`
    ); // Récupération des données depuis l'API
    const performanceData = data.data.map(
      (item: { kind: string; value: number }) => ({
        subject: item.kind,
        value: item.value,
      })
    );

    console.log("Données backend pour la performance:", performanceData);
    return performanceData;
  }
};

// Fonction pour récupérer le score d'un utilisateur
export const fetchUserScore = async (userId: number): Promise<number> => {
  console.log(
    `Fetching user score for userId ${userId} with USE_MOCK_DATA = ${shouldUseMock()}`
  );

  if (shouldUseMock()) {
    const user = mockData.userMainData.find(
      (u: { id: number }) => u.id === userId
    ); // Recherche dans les données mock
    if (!user) throw new Error(`Utilisateur non trouvé avec ID ${userId}`);
    console.log("Données mock pour le score:", user.todayScore ?? user.score);
    return user.todayScore ?? user.score; // Retourne le score
  } else {
    const data = await getData(`http://localhost:3000/user/${userId}`); // Récupération des données depuis l'API
    console.log(
      "Données backend pour le score:",
      data.todayScore ?? data.score
    );
    return data.todayScore ?? data.score;
  }
};

// Structure des données de session
export type Length = {
  day: number;
  sessionLength: number;
};

// Fonction pour récupérer les données des sessions moyennes d'un utilisateur
export const fetchSessionData = async (userId: number): Promise<Length[]> => {
  console.log(
    `Fetching session data for userId ${userId} with USE_MOCK_DATA = ${shouldUseMock()}`
  );

  if (shouldUseMock()) {
    const session = mockData.userAverageSessions.find(
      (s: { userId: number }) => s.userId === userId
    ); // Recherche dans les données mock
    if (!session)
      throw new Error(
        `Sessions moyennes non trouvées pour l'utilisateur avec ID ${userId}`
      );
    console.log("Données mock pour les sessions moyennes:", session.sessions);
    return session.sessions;
  } else {
    const data = await getData(
      `http://localhost:3000/user/${userId}/average-sessions`
    ); // Récupération des données depuis l'API
    console.log("Données backend pour les sessions moyennes:", data.sessions);
    return data.sessions;
  }
};

// Structure des informations utilisateur (prénom, nom, âge)
export interface UserInfo {
  firstName: string;
  lastName: string;
  age: number;
}

// Fonction pour récupérer les informations d'un utilisateur
export const fetchUserInfo = async (userId: number): Promise<UserInfo> => {
  console.log(
    `Fetching user info for userId ${userId} with USE_MOCK_DATA = ${shouldUseMock()}`
  );

  if (shouldUseMock()) {
    const user = mockData.userMainData.find(
      (u: { id: number }) => u.id === userId
    ); // Recherche dans les données mock
    if (!user || !user.userInfos)
      throw new Error(
        `Infos utilisateur non trouvées dans les mock pour l'utilisateur avec ID ${userId}`
      );
    console.log("Données mock pour l'utilisateur :", user.userInfos);
    return user.userInfos;
  } else {
    const data = await getData(`http://localhost:3000/user/${userId}`); // Récupération des données depuis l'API
    console.log("Données backend pour l'utilisateur :", data.userInfos);
    return data.userInfos;
  }
};

// Fonction pour récupérer toutes les données d'un utilisateur
export const fetchAllUserData = async (userId: number) => {
  try {
    console.log(`Fetching all user data for userId ${userId}`);
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
