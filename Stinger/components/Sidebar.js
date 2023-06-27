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

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const router = useRouter();

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists({ limit: 50, offset: 1 }).then((data) => {
        setPlaylists(data.body?.items);
      });
    }
  }, [session, spotifyApi]);

  const createPlaylist = () => {
    spotifyApi
      .createPlaylist("Give it a name...")
      .then((data) => {
        setPlaylistId(data.body?.id);
        router.push({
          pathname: "/playlist/[id]",
          query: { id: data.body?.id, custom: Boolean(true) },
        });
      })
      .catch((err) => console.error("Unable to create playlist", err));
  };

  return (
    <div
      className="bg-slate-800 text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 
    overflow-y-scroll scrollbar-hide h-screen w-screen sm:max-w-[15rem] lg:max-w-[20rem]
    hidden md:inline-flex pb-36"
    >
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => {
            router.replace("/");
          }}
        >
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => {
            router.replace("/search");
          }}
        >
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={createPlaylist}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button
          className="flex items-center space-x-2 text-blue-500 hover:text-white"
          onClick={() => {
            router.replace("/liked");
          }}
        >
          <HeartIcon className="h-5 w-5" />
          <p>Liked songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex items-center space-x-3">
            <img
              className="w-10 h-10 shadow-md rounded-sm"
              src={playlist?.images?.[0]?.url}
              alt=""
            />
            <p
              onClick={() => {
                setPlaylistId(playlist.id);
                router.push({
                  pathname: "/playlist/[id]",
                  query: { id: playlist.id },
                });
              }}
              className="cursor-pointer hover:text-white truncate"
            >
              {playlist.name}
            </p>
          </div>
          // <PlaylistSidebar key={playlist.id} playlist={playlist}/>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
