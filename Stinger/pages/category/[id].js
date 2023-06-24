import CenterCategory from "@/components/CenterCategory";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

function Category() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <CenterCategory />
      </main>

      <div className="hidden xs:bottom-0 xs:sticky">
        <Player />
      </div>
    </div>
  );
}

export default Category;