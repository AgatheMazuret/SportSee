import Header from "../header";
import Sidebar from "../sidebar";
import Hello from "../hello";
import ActivityChart from "../components/activity-chart";
import SectionLengthChart from "../components/section-length-chart";
import SpentEnergyChart from "../components/performance-chart";
import ScoreChart from "../components/score-chart";
import NutritionData from "../components/nutrition-data";

const App = () => {
  // Récupérer l'URL actuelle
  const url = window.location.href;

  // Expression régulière pour trouver le paramètre 'userId' dans l'URL
  const regex = /[?&]userId=(\d+)/;
  const match = url.match(regex);

  // Si un userId est trouvé, l'utiliser. Sinon, utiliser 18 par défaut.
  const userId = match ? parseInt(match[1], 10) : 12;

  return (
    <>
      <Header />
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 p-[68px_70px_70px_65px]">
          <div className="mb-20">
            {/* Passer le userId au composant Hello */}
            <Hello userId={userId} />
          </div>
          <div className="flex w-full gap-8">
            <div className="flex-1 flex flex-col gap-8">
              <ActivityChart userId={userId} />
              <div className="flex gap-8 w-full h-full md:h-[205px]">
                <SectionLengthChart userId={userId} />
                <SpentEnergyChart userId={userId} />
                <ScoreChart userId={userId} />
              </div>
            </div>
            <NutritionData userId={userId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
