// src/service.ts
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
