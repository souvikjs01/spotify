import AlbumCard from "../components/AlbumCard";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import SongCard from "../components/SongCard";
import { useSongData } from "../context/SongContext";

export default function Home() {
  const { albums, loading, songs } = useSongData()
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
            <div className="flex overflow-auto">
              {albums?.map((alb, i) => {
                return (
                  <AlbumCard
                    key={i}
                    image={alb.thumbnail}
                    name={alb.title}
                    desc={alb.description}
                    id={alb.id}
                  />
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
            <div className="flex overflow-auto">
              {songs?.map((s, i) => {
                return (
                  <SongCard
                    key={i}
                    image={s.thumbnail}
                    name={s.title}
                    desc={s.description}
                    id={s.id}
                  />
                );
              })}
            </div>
          </div>
        </Layout>
      )}
    </div>
  )
}
