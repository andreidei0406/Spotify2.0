import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { LogoutIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

function SearchComponent() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [categories, setCategories] = useState();
  const [search, setSearch] = useState("");
  useEffect(() => {
    spotifyApi
      .getCategories({ limit: 50 })
      .then((data) => {
        setCategories(data.body?.categories.items);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, session]);

  useEffect(() => {
    if (search) {
      debounceSearch(search);
    }
  }, [search]);

  const debounceSearch = useCallback(
    debounce((search) => {
      spotifyApi
        .search(search, ["playlist", "artist", "album", "track"])
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500),
    []
  );

  console.log(categories);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide pb-36">
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
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 xxs:gap-1 xs:gap-3 sm:gap-5 md:gap-7">
            {search === "" ? (
              categories?.map((category) => (
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
              ))
            ) : (
              <p>salut</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SearchComponent;
