import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig/firebase";
import { useNavigate } from "react-router-dom";


const AddNewChat = (props) => {
    const navigate=useNavigate();
    return (
        <div className="flex flex-col h-full w-full border-2 border-black bg-slate-300">
            <p className="text-3xl cursor-pointer" onClick={()=>{props.SetNewChatBoxAppear(false)}}>{"<"}</p>
            <div className="flex w-full h-16 border-b items-center p-2 border-gray-700 cursor-pointer hover:bg-slate-400">
                <div className="flex h-14 w-14 rounded-full border-2 border-black"></div>
                <div className="flex flex-col ml-8">
                    <p className="text-xl">User Name</p>
                </div>

            </div>
        </div>
    )
}

export default AddNewChat;