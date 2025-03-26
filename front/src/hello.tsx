import React, { useState, useEffect } from "react";

interface HelloProps {
  userId: number;
}

const Hello: React.FC<HelloProps> = ({ userId }) => {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        if (!response.ok) throw new Error("Problème avec l'appel à l'API");

        const result = await response.json();

        setFirstName(
          result?.data?.userInfos?.firstName || "Utilisateur inconnu"
        );
      } catch (error) {
        console.error("Erreur lors du fetch :", error);
        setFirstName("Erreur");
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className="flex flex-col items-start justify-center">
      <p className="text-5xl">
        Bonjour{" "}
        <a className="text-red-500" href={`/user/${userId}`}>
          {firstName === null ? "Chargement..." : firstName}
        </a>
      </p>
      {firstName && firstName !== "Erreur" && (
        <p className="text-lg mt-[41px]">
          Félicitations ! Vous avez explosé vos objectifs hier 👏
        </p>
      )}
    </div>
  );
};

export default Hello;
