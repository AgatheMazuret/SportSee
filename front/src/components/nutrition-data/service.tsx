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
