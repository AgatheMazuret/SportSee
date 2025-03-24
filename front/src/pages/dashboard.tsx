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
        <div className="flex-1 px-[117px] pt-[68px] pb-[7px]">
          <div className="mb-[78px]">
            <Hello userId={12} />
          </div>
          <div className="flex gap-[31px]">
            <ActivityChart />
            <NutritionData />
          </div>
          <div className="flex gap-8 mt-[28px]">
            <SectionLengthChart />
            <SpentEnergyChart />
            <ScoreChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
