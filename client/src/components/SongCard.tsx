import { FaBookmark, FaPlay } from "react-icons/fa";
import { useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext";

interface Props {
    id: string;
    image?: string;
    name: string;
    desc: string;
}

export default function SongCard({ desc, id, image, name }: Props) {
    const { setSelectedSong, setIsPlaying } = useSongData()

    const { addToPlaylist, isAuth } = useUserData();
    
    const saveToPlayListHanlder = () => {
      addToPlaylist(id);
    }
  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-all duration-150">
      <div className="relative group">
        <img
          src={image ? image : "/download.jpeg"}
          className="mr-1 w-[160px] rounded"
          alt={name}
        />
        <div className="flex gap-2">
          <button className="absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={()=>{
            setSelectedSong(id);
            setIsPlaying(true)
          }}>
            <FaPlay />
          </button>
          {isAuth && (
            <button
              className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={saveToPlayListHanlder}
            >
              <FaBookmark />
            </button>
          )}
        </div>
      </div>
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc.slice(0, 20)}...</p>
    </div>
  )
}
