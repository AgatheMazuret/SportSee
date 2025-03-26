import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";
import Hello from "../components/hello/hello";
import ActivityChart from "../components/daily-activity/dailyActivity";
import SectionLengthChart from "../components/section-length/sectionLength";
import SpentEnergyChart from "../components/spent-energy/spentEnergy";
import ScoreChart from "../components/score/score";
import NutritionData from "../components/nutrition/nutrition";

const App = () => {
  return (
    <>
      <Header />
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 px-4 md:px-30 pt-16 pb-2">
          <div className="mb-20">
            <Hello userId={12} />
          </div>
          <div className="flex w-full gap-8">
            <div className="flex-1 flex flex-col gap-8">
              <ActivityChart />
              <div className="flex gap-8 w-full">
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
