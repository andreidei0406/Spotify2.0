import HomeCenter from "@/components/HomeCenter";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <HomeCenter />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Home;
