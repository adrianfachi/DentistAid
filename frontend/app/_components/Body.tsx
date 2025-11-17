import React from "react"
import SideBar from "./SideBar";


type Props = {
  children: React.ReactElement;
  activeNavBar: string;
}

function Body({ children, activeNavBar }: Props) {
  return (
    <div className="min-h-screen flex">
      <SideBar active={activeNavBar} />
      <div className="m-6 rounded-lg bg-background w-full p-7 shadow-blue-soft">
        {children}
      </div>
    </div>
  )
}

export default Body