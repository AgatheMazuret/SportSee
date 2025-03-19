import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";
import Hello from "../components/hello/hello";

const App = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 px-[117px] py-[68px]">
          <Hello />
        </div>
      </div>
    </>
  );
};

export default App;
