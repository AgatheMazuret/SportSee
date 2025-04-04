type ActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

type FormattedActivityData = {
  day: string;
  kilogram: number;
  calories: number;
};

// Fonction pour récupérer les données d'activité depuis l'API
export const fetchActivityData = async (
  userId: number
): Promise<FormattedActivityData[]> => {
  try {
    const response = await fetch(
      `http://localhost:3000/user/${userId}/activity`
    );
    const responseData: { data: { sessions: ActivityData[] } } =
      await response.json();

    // Transformation des données pour correspondre au format attendu
    const formattedData: FormattedActivityData[] =
      responseData.data.sessions.map((item: ActivityData) => ({
        day: item.day,
        kilogram: item.kilogram,
        calories: item.calories,
      }));

    return formattedData;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error; // Relance l'erreur pour la gérer dans le composant
  }
};

export interface NutritionDataType {
  calorieCount: number;
  proteinCount: number;
  carbohydrateCount: number;
  lipidCount: number;
}

export const fetchNutritionData = async (
  userId: number
): Promise<NutritionDataType> => {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}/`);
    if (!response.ok) {
      throw new Error("La réponse du réseau n'est pas correcte");
    }
    const result = await response.json();
    if (result.data && result.data.keyData) {
      return result.data.keyData;
    } else {
      throw new Error("Pas de 'keyData' dans la réponse");
    }
  } catch (error) {
    console.error("❌ Erreur de récupération:", error);
    throw error;
  }
};

export const fetchPerformanceData = async (userId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/user/${userId}/performance`
    );
    const responseData = await response.json();

    if (!responseData.data) throw new Error("Données manquantes");

    const { data, kind } = responseData.data;
    if (!data || !kind) throw new Error("Format des données incorrect");

    // Formater les données avec leur libellé
    return data.map((item: { kind: number; value: number }) => ({
      subject: kind[item.kind],
      value: item.value,
    }));
  } catch (error) {
    console.error("Erreur de chargement :", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

export const fetchUserScore = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    const responseData = await response.json();

    if (!responseData.data || responseData.data.todayScore === undefined) {
      throw new Error("Données manquantes");
    }

    return responseData.data.todayScore;
  } catch (error) {
    console.error("Erreur de chargement :", error);
    throw error; // On relance l'erreur pour que le composant puisse la gérer
  }
};

export type Length = {
  day: number;
  sessionLength: number;
};

export type FormattedLengthData = {
  day: number;
  sessionLength: number;
};

export const fetchSessionData = async (userId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`);
    const responseData = await response.json();

    return responseData.data.sessions.map((item: Length) => ({
      day: item.day,
      sessionLength: item.sessionLength,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return [];
  }
};
