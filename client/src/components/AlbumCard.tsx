import { useNavigate } from "react-router-dom";

interface Props {
    id: string;
    image: string;
    name: string;
    desc: string;
}

export default function AlbumCard({ id, desc, image, name}: Props) {
    const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/album/" + id)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img src={image} className="rounded w-[160px]" alt="thumbnail" />
      <p className="font-bold mt-2 mb-1">{name.slice(0, 12)}...</p>
      <p className="text-slate-200 text-sm">{desc.slice(0, 18)}...</p>
    </div>
  )
}
