import { useNavigate } from "react-router-dom"
import { useUserData } from "../context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuth, logout } = useUserData()

  const logoutHandler = () => {
    logout()
  }
  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <img
            src="/left_arrow.png"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => navigate(-1)}
            alt="left_arrow"
          />
          <img
            src="/right_arrow.png"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => navigate(+1)}
            alt="right_arrow"
          />
        </div>

        <div className="flex items-center gap-4">
          <p className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full hidden md:block">
            Expore Premium
          </p>
          <p className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full hidden md:block">
            Install App
          </p>
          {isAuth ? (
            <p
              onClick={logoutHandler}
              className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => navigate("/login")}
              className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full"
            >
              Login
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
          All
        </p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">
          Music
        </p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">
          Podcasts
        </p>
        <p
          className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer md:hidden"
          onClick={() => navigate("/playlist")}
        >
          PlayList
        </p>
      </div>
    </>
  )
}
