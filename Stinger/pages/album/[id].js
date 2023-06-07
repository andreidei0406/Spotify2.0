import CenterAlbum from "@/components/CenterAlbum";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

function Album() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <CenterAlbum />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Album;