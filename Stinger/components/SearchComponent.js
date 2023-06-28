import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { LogoutIcon, PlayIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Songs from "./Songs";
import { useRecoilState } from "recoil";
import { searchState } from "@/atoms/searchAtom";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import { queueIdState } from "@/atoms/queueAtoms";
import { durationState } from "@/atoms/durationAtoms";
import Song from "./Song";

function SearchComponent() {
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [queue, setQueue] = useRecoilState(queueIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [duration, setDuration] = useRecoilState(durationState);

  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [categories, setCategories] = useState();
  const [search, setSearch] = useRecoilState(searchState);
  const [playlist, setPlaylist] = useState([]);
  const [album, setAlbum] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [artistTopTracks, setArtistTopTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getCategories({ limit: 50 })
        .then((data) => {
          setCategories(data.body?.categories.items);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [spotifyApi, session]);

  useEffect(() => {
    if (search && spotifyApi.getAccessToken()) {
      debounceSearch(search);
    }
  }, [search, spotifyApi]);

  const debounceSearch = useCallback(
    debounce((search) => {
      spotifyApi
        .search(search, ["playlist", "artist", "album", "track"], { limit: 5 })
        .then((data) => {
          setPlaylist(data.body.playlists.items);
          setAlbum(data.body.albums.items);
          setTracks(data.body.tracks.items);
          setArtists(data.body.artists.items);
        })
        .catch((err) => {
          console.log("Couldnt search!", err);
        });
    }, 500),
    []
  );

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (typeof artists !== undefined && spotifyApi.getAccessToken()) {
        await spotifyApi
          .getArtistTopTracks(artists?.[0]?.id, "RO")
          .then((data) => {
            console.log(data);
            setArtistTopTracks(data.body.tracks);
            console.log(artistTopTracks);
          })
          .catch((err) => {
            console.error("Couldn't get artist top tracks", err);
          });
      }
    };
    fetchTopTracks();
    setIsLoading(false);
  }, [artists, spotifyApi]);

  const playArtistTopTracks = () => {
    setCurrentTrackId(artistTopTracks?.[0]?.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [artistTopTracks?.[0]?.uri],
    });
    setDuration(artistTopTracks?.[0]?.duration_ms);
    setQueue(artistTopTracks);
  };

  console.log(artistTopTracks);
  // console.log(artistTopTracks);
  // console.log(search);
  // console.log(tracks);

  return (
    <div className="flex-grow bg-slate-800 h-screen overflow-y-scroll scrollbar-hide pb-36">
      <header className="absolute top-5 right-8">
        <div
          className="hidden sm:inline-flex items-center bg-black space-x-3 opacity-90 
          hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2>Log out</h2>
          <LogoutIcon className="h-5 w-5" />
        </div>
      </header>
      <header>
        <div className="mt-5 ml-8 hidden sm:inline-flex">
          <input
            type="search"
            id="default-search"
            className="flex p-4 text-sm text-white border bg-gray-700 border-gray-600 placeholder-gray-400 rounded-2xl focus:ring-green-500 focus:border-green-500"
            placeholder="What do you want to listen to?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      <div className="px-8 py-10">
        <section className="">
          {search === "" ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 xxs:gap-1 xs:gap-3 sm:gap-5 md:gap-7">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="relative items-center rounded-lg"
                >
                  <img
                    className="relative xxs:w-20 xxs:h-20 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-58 2xl:h-58 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                    src={category?.icons?.[0].url}
                    alt=""
                    onClick={() => {
                      router.push({
                        pathname: "/category/[id]",
                        query: { id: category.id },
                      });
                    }}
                  />
                  <div
                    className="xxs:text-sm xs:text-md sm:text-sm md:text-sm xl:text-base 2xl:text-xl hover:opacity-75 cursor-pointer font-bold"
                    onClick={() => {
                      router.push({
                        pathname: "/category/[id]",
                        query: { id: category.id },
                      });
                    }}
                  >
                    {category?.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="">
              <section className="">
                <h1 className="px-8 py-10 text-2xl md:text-3xl xl:text-5xl font-bold">
                  Top results
                </h1>
                <div className="grid grid-cols-2 gap-7">
                  <div className="flex max-w-[40rem] max-h-[18rem] bg-black rounded-full">
                    <img
                      className="relative w-72 h-72 shadow-2xl rounded-full hover:opacity-80 hover:cursor-pointer"
                      src={artists?.[0]?.images?.[0]?.url}
                      alt=""
                      onClick={() => {
                        router.push({
                          pathname: "/artist/[id]",
                          query: { id: artists?.[0]?.id },
                        });
                      }}
                    />
                    <div className="flex justify-center items-center">
                      <p className="text-2xl px-3">{artists?.[0]?.name}</p>
                    </div>
                    <div className="flex justify-center items-center">
                      <PlayIcon
                        className="button w-14 h-14 text-green-500"
                        onClick={playArtistTopTracks}
                      />
                    </div>
                  </div>
                  <div className="flex">
                    {isLoading ? (
                      <div></div>
                    ) : (
                      <Songs ignoreAlbumName={true} songs={tracks} />
                    )}
                  </div>
                </div>
              </section>
              <h1 className="px-8 py-10 text-2xl md:text-3xl xl:text-5xl font-bold">
                Playlists
              </h1>
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8">
                  {playlist.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="text-xs md:text-sm xl:text-md bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-md"
                      onClick={() => {
                        router.push({
                          pathname: "/playlist/[id]",
                          query: { id: playlist.id },
                        });
                      }}
                    >
                      <img
                        className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-58 2xl:h-58 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                        src={playlist?.images?.[0].url}
                        alt=""
                      />
                      <div className="truncate">
                        <h1 className="hidden overflow-hidden xs:flex text-sm md:text-lg xl:text-xl font-bold">
                          {playlist?.name}
                        </h1>
                        <span className="hidden xs:flex overflow-hidden">
                          {playlist?.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <h1 className="px-8 py-10 text-2xl md:text-3xl xl:text-5xl font-bold">
                Albums
              </h1>
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8">
                  {album.map((album) => (
                    <div
                      key={album?.id}
                      className="text-xs md:text-sm xl:text-md bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-md"
                      onClick={() => {
                        console.log(album.id);
                        router.push({
                          pathname: "/album/[id]",
                          query: { id: album.id },
                        });
                      }}
                    >
                      <img
                        className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-58 2xl:h-58 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                        src={album?.images?.[0].url}
                        alt=""
                      />
                      <div>
                        <h1 className="hidden xs:flex text-sm md:text-lg xl:text-xl font-bold">
                          {album?.name}
                        </h1>
                        <p className="hidden xs:flex overflow-hidden">
                          {album?.artists?.[0]?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <h1 className="px-8 py-10 text-2xl md:text-3xl xl:text-5xl font-bold">
                Artists
              </h1>
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 xxs:gap-3 xs:gap-4 sm:gap-5 md:gap-7 py-4 px-8">
                  {artists.map((artist) => (
                    <div
                      key={artist?.id}
                      className="text-xs md:text-sm xl:text-md bg-gray-900 xs:px-3 xs:py-3 hover:bg-gray-700 cursor-pointer rounded-md"
                      onClick={() => {
                        console.log(artist.id);
                        router.push({
                          pathname: "/artist/[id]",
                          query: { id: artist.id },
                        });
                      }}
                    >
                      <img
                        className="relative xxs:w-22 xxs:h-22 xs:w-32 xs:h-32 md:w-24 md:h-24 lg:w-40 lg:h-40 xl:w-50 xl:h-50 2xl:w-58 2xl:h-58 shadow-2xl rounded-lg hover:opacity-75 cursor-pointer"
                        src={artist?.images?.[0].url}
                        alt=""
                      />
                      <div>
                        <h1 className="hidden xs:flex text-sm md:text-lg xl:text-xl font-bold">
                          {artist?.name}
                        </h1>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default SearchComponent;
