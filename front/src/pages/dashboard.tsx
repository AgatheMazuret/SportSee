import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";
import Hello from "../components/hello/hello";
import ActivityChart from "../components/daily-activity/dailyActivity";
import SectionLengthChart from "../components/section-length/sectionLength";
import SpentEnergyChart from "../components/spent-energy/spentEnergy";
import ScoreChart from "../components/score/score";

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
          <ActivityChart />
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
