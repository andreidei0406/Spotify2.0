import CenterArtist from "@/components/CenterArtist";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

function Artist() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <CenterArtist />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Artist;