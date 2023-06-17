import useSpotify from "@/hooks/useSpotify";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

function SearchComponent() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [categories, setCategories] = useState();
  const [search, setSearch] = useState('');
  useEffect(() => {
    spotifyApi
      .getCategories({limit: 50})
      .then((data) => {
        setCategories(data.body.categories.items);
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
      spotifyApi.search(search, ["playlist", "artist", "album", "track"])
      .then((data) =>{
        console.log(data);
      })
      .catch((err) => {console.log(err)});
    }, 500),
    []
  );

  console.log(categories);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide pb-36">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 
    hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <header>
        <div className="mt-5 ml-8">
          <input
            type="search"
            id="default-search"
            className="flex p-4 text-sm text-gray-900 border bg-gray-700 border-gray-600 placeholder-gray-400 rounded-2xl focus:ring-green-500 focus:border-green-500"
            placeholder="What do you want to listen to?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>
      <div className="px-8 py-10">
        <section className="">
          <div className="grid grid-cols-9 gap-7">
            { search ==='' ? 
            categories?.map((category) => (
              <div
                key={category.id}
                className="relative items-center hover:opacity-75 rounded-lg cursor-pointer"
                onClick={() => {
                  router.push({
                    pathname: "/category/[id]",
                    query: { id: category.id },
                  });
                }}
              >
                <img
                  className="relative w-48 h-48 shadow-2xl rounded-lg"
                  src={category?.icons?.[0].url}  
                  alt=""
                />
                <div className="text-md md:text-lg xl:text-xl font-bold">
                  {category?.name}
                </div>
              </div>
            )) :
               <p>salut</p>
            }
          </div>
        </section>
      </div>
    </div>
  );
}

export default SearchComponent;
