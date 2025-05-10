import type React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Player from "./Player";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className=" h-screen">
      <div className=" h-[90%] flex">
        <Sidebar />
        <div className=" w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
            <Navbar />
            {children}
        </div>
      </div>
      <Player />
    </div>
  )
}
