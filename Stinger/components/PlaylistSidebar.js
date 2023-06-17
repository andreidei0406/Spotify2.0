function PlaylistSidebar({ key, playlistName, playlistImage }) {

    return (
        <div className="flex items-center space-x-3" key={key}>
            <img
              className="w-10 h-10 shadow-md rounded-sm"
              src={playlistImage}
              alt=""
            />
            <p
              onClick={() => {
                setPlaylistId(key);
                router.push({
                  pathname: "/playlist/[id]",
                  query: { id: key },
                });
              }}
              className="cursor-pointer hover:text-white truncate"
            >
              {playlistName}
            </p>
          </div>
    )
}
export default PlaylistSidebar;