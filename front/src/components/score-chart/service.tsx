export const fetchUserScore = async (userId) => {
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
