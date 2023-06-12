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

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Category;