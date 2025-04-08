import Header from "../header";
import Sidebar from "../sidebar";
import Hello from "../hello";
import ActivityChart from "../components/activity-chart";
import SectionLengthChart from "../components/section-length-chart";
import SpentEnergyChart from "../components/performance-chart";
import ScoreChart from "../components/score-chart";
import NutritionData from "../components/nutrition-data";

const App = ({ propUserId }: { propUserId?: number }) => {
  const url = window.location.href;

  // Chercher le paramètre 'userId' dans l'URL avec une expression régulière
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Définir userId, avec une valeur par défaut de 12 si non précisé dans les props ou l'URL
  const userId = propUserId ?? (match ? parseInt(match[1], 10) : 12);

  if (userId !== 12 && userId !== 18) {
    alert("userId invalide.");
  }

  return (
    <>
      <Header />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-[68px_70px_70px_65px]">
          <div className="mb-20">
            {/* Passer userId comme prop au composant Hello */}
            <Hello userId={userId} />
          </div>
          <div className="flex w-full gap-8">
            <div className="flex-1 flex flex-col gap-8">
              {/* Afficher le graphique des activités */}
              <ActivityChart userId={userId} />
              <div className="flex gap-8 w-full h-full md:h-[205px]">
                {/* Afficher les graphiques de longueur de section, énergie dépensée, et score */}
                <SectionLengthChart userId={userId} />
                <SpentEnergyChart userId={userId} />
                <ScoreChart userId={userId} />
              </div>
            </div>
            {/* Afficher les données nutritionnelles */}
            <NutritionData userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
