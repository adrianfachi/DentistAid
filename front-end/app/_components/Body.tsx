import React from "react"
import SideBar from "./SideBar";


type Props = {
    children: React.ReactElement;
}

function Body({ children }: Props) {
    return (
        <div className="h-screen flex">
            <SideBar active="home" />
            {children}
        </div>
    )
}

export default Body