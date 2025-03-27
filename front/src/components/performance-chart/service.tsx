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
