import { libraryState } from "@/atoms/libraryAtom";
import { playlistIdState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import {
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

function MiniSidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const router = useRouter();
  const [library, setLibrary] = useRecoilState(libraryState);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists({ limit: 50, offset: 1 }).then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  const toggleLibrary = () =>{
    setLibrary(!library);
  }

  return (
    
    <div
      className="text-gray-500 p-5 text-center lg:text-sm border-r border-gray-900 
    overflow-y-scroll scrollbar-hide h-screen w-screen sm:max-w-[5rem]
    hidden md:inline-flex pb-36"
    >
      <div className="space-y-4 justify-center">
        <button
          className="flex items-center space-x-2 hover:text-white cursor-pointer"
          onClick={() => {
            router.replace("/");
          }}
        >
          <HomeIcon className="h-5 w-5" />
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white cursor-pointer"
          onClick={() => {
            router.replace("/search");
          }}
        >
          <SearchIcon className="h-5 w-5" />
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white cursor-pointer">
          <PlusCircleIcon className="h-5 w-5" />
        </button>
        <button
          className="flex items-center space-x-2 text-blue-500 hover:text-white cursor-pointer"
          onClick={() => {
            router.replace("/liked");
          }}
        >
          <HeartIcon className="h-5 w-5" />
        </button>
        <button className="flex items-center space-x-2 hover:text-white cursor-pointer" onClick={toggleLibrary}>
          <LibraryIcon className="h-5 w-5" />
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img
              className="w-10 h-10 shadow-md rounded-sm"
              src={playlist?.images?.[0].url}
              alt=""
              onClick={() => {
                setPlaylistId(playlist.id);
                router.push({
                  pathname: "/playlist/[id]",
                  query: { id: playlist.id },
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiniSidebar;
