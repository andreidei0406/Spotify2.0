import CenterPlaylist from "@/components/CenterPlaylist";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

function Playlist() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <CenterPlaylist />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Playlist;