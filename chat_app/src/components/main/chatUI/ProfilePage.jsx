import { useState } from "react";
import BigUserIcon from "./assets/BigUserIcon.png"
const ProfilePage=({setDisplayProfileSection,Uid})=>{
    return(
        <div className="flex flex-col items-center border-2 border-black h-full w-full">
            <div className="flex h-max w-full">
                <p className="text-2xl cursor-pointer" onClick={()=>{setDisplayProfileSection(false)}}>{"<"}</p>
            </div>
            <div className="flex justify-center h-max w-full mt-10 mb-5">
                <div className="flex h-[150px] w-[150px] rounded-full"><img src={BigUserIcon} alt="" /></div>
            </div>
            <div className="flex justify-center h-max w-full">
                <div className="flex text-2xl">User Name</div>
            </div>
            
            
        </div>
    )
}

export default ProfilePage;