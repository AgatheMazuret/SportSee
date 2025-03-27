export type Length = {
  day: number;
  sessionLength: number;
};

export type FormattedLengthData = {
  day: number;
  sessionLength: number;
};

export const fetchSessionData = async (): Promise<FormattedLengthData[]> => {
  try {
    const response = await fetch(
      "http://localhost:3000/user/12/average-sessions"
    );
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
