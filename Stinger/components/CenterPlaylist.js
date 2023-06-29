import { playlistState } from "@/atoms/playlistAtoms";
import useSpotify from "@/hooks/useSpotify";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { CheckCircleIcon, LogoutIcon } from "@heroicons/react/solid";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
  "from-zinc-500",
  "from-amber-500",
  "from-emerald-500",
  "from-sky-500",
  "from-teal-500",
  "from-cyan-500",
  "from-rose-500",
  "from-fuchsia-500",
  "from-lime-500",
];

function CenterPlaylist() {
  const router = useRouter();
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [router.query.id]);

  useEffect(() => {
    if(spotifyApi.getAccessToken()){
      spotifyApi
      .getPlaylist(router.query.id, { limit: 50, offset: 5 })
      .then((data) => {
        setPlaylist(data?.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
    }
  }, [spotifyApi, session, router.query.id]);

  const [playlistName, setPlaylistName] = useState("");

  const [className, setClassName] = useState(
    "xxs:w-36 xxs:h-36 xs:w-44 xs:h-44 shadow-2xl hover:opacity-70 cursor-pointer"
  );
  // const uploadImage = () => {
  //   var input = document.createElement("input");
  //   input.type = "file";

  //   input.onchange = (e) => {
  //     // getting a hold of the file reference
  //     var file = e.target.files[0];

  //     // setting up the reader
  //     var reader = new FileReader();

  //     reader.onload = (readerEvent) => {
  //       var content = readerEvent.target.result; // this is the content!
  //       document.querySelector("#image_input").src = `url(${content})`;
  //       document.querySelector("#image_input").className = className;
  //     };

  //     reader.readAsDataURL(file); // this is reading as data url

  //     // here we tell the reader what to do when it's done reading...
  //   };
  //   input.click();
  // };

  const savePlaylistInfo = () => {
    spotifyApi
      .changePlaylistDetails(router.query.id, { name: playlistName })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.error(err));
  };
  console.log(playlist);

  return (
    <div className="bg-slate-800 flex-grow h-screen overflow-y-scroll scrollbar-hide select-none">
      <header className="relative">
        <div
          className="absolute hidden xs:flex top-5 right-8 items-center bg-black space-x-3 opacity-90 
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
      <header className="relative top-5 left-8">
        <div
          className="absolute hidden xs:flex items-center bg-black space-x-3 opacity-90 
        hover:opacity-70 cursor-pointer rounded-full p-1 pr-2 text-white"
        >
          <ChevronLeftIcon
            className="h-10 w-10"
            onClick={() => {
              router.back();
            }}
          />
        </div>
      </header>

      {router.query.custom === "true" ? (
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-slate-500
         ${color} h-80 text-white p-8`}
        >
          <img
            className="xxs:w-36 xxs:h-36 xs:w-44 xs:h-44 shadow-2xl hover:opacity-70 cursor-pointer"
            src="https://www.lifewire.com/thmb/tHjH9M19MsA9gFY-qcZvKYv5oG4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cloud-upload-a30f385a928e44e199a62210d578375a.jpg"
            alt=""
            id="image_input"
            // onClick={uploadImage}
          />

          <div className="hidden xs:block">
            <p>PLAYLIST</p>
            <input
              className="flex p-4 text-sm text-white border bg-gray-700 border-gray-600 placeholder-gray-400 rounded-2xl focus:ring-green-500 focus:border-green-500"
              placeholder="Give it a name!"
              type="text"
              onChange={(e) => {
                setPlaylistName(e.target.value);
              }}
              value={playlistName}
            />
            <button
              className="items-center  hover:text-white"
              onClick={savePlaylistInfo}
            >
              <CheckCircleIcon className="button py-2 w-12 h-12" />
            </button>
          </div>
        </section>
      ) : (
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-slate-800
         ${color} h-80 text-white p-8`}
        >
          <img
            className="xxs:w-36 xxs:h-36 xs:w-44 xs:h-44 shadow-2xl"
            src={playlist?.images?.[0]?.url}
            alt=""
          />
          <div className="hidden xs:block space-y-2">
            <p>PLAYLIST</p>
            <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
              {playlist?.name}
            </h1>
            <p>{playlist?.description}</p>
          </div>
        </section>
      )}
      <div>
        <Songs songs={playlist?.tracks?.items} isAlbum={false} useHeigthScreen={'h-screen'} />
      </div>
      {/* {router.query.custom === "false"  ?
  (
      
    
  ) : (
    <button>Click here to add Songs</button>
  )
} */}
    </div>
  );
}

export default CenterPlaylist;
