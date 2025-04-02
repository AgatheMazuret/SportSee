import Header from "../header";
import Sidebar from "../sidebar";
import Hello from "../hello";
import ActivityChart from "../components/activity-chart";
import SectionLengthChart from "../components/section-length-chart/section-length-chart";
import SpentEnergyChart from "../components/performance-chart/performance-chart";
import ScoreChart from "../components/score-chart/score-chart";
import NutritionData from "../components/nutrition-data/nutrition-data";

const App = () => {
  return (
    <>
      <Header />
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 p-[68px_70px_70px_65px]">
          <div className="mb-20">
            <Hello userId={12} />
          </div>
          <div className="flex w-full gap-8">
            <div className="flex-1 flex flex-col gap-8">
              <ActivityChart />
              <div className="flex gap-8 w-full h-full md:h-[205px]">
                <SectionLengthChart />
                <SpentEnergyChart />
                <ScoreChart />
              </div>
            </div>
            <NutritionData />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
