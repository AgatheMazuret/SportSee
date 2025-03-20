import React, { useState, useEffect } from "react";

interface HelloProps {
  userId: number;
}

const Hello: React.FC<HelloProps> = ({ userId }) => {
  const [firstName, setFirstName] = useState(""); // État pour stocker le prénom
  const [loading, setLoading] = useState(true); // État pour savoir si on attend la réponse de l'API
  const [error, setError] = useState<string | null>(null); // Gérer les erreurs

  useEffect(() => {
    fetch(`http://localhost:3000/user/12`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Problème avec l'appel à l'API");
        }
        return response.json(); // Convertir la réponse en JSON
      })
      .then((data) => {
        // Vérifier que userInfos existe et contient firstName
        if (data && data.userInfos && data.userInfos.firstName) {
          setFirstName(data.userInfos.firstName); // Mettre à jour l'état avec le prénom de l'utilisateur
        } else {
          throw new Error("Données utilisateur manquantes");
        }
        setLoading(false); // L'appel est terminé, on peut arrêter de charger
      })
      .catch((error: Error) => {
        setError(error.message); // En cas d'erreur, on la gère
        setLoading(false); // L'appel est terminé, même s'il y a eu une erreur
      });
  }, [userId]); // Ajout du userId comme dépendance pour recharger les données si le userId change

  if (loading) {
    return <p>Chargement...</p>; // Afficher "Chargement..." pendant que l'API répond
  }

  if (error) {
    return <p>Erreur : {error}</p>; // Afficher un message d'erreur si quelque chose a mal tourné
  }

  return (
    <div className="flex flex-col items-start justify-center">
      <a className="text-5xl">Bonjour {firstName}</a>
      <p className="text-lg">
        Félicitation ! Vous avez explosé vos objectifs hier 👏
      </p>
    </div>
  );
};

export default Hello;
