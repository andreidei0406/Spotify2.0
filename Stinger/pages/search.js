import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import SearchComponent from "@/components/SearchComponent";
function Search() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <SearchComponent />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export default Search;