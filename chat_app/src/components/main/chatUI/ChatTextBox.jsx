import { useState } from "react";
import { db } from "../../../firebaseConfig/firebase";
import { collection,addDoc,updateDoc } from "firebase/firestore";

const ChatTextBox=({selectedDocId,userInfo})=>{
    const [Message,setMessage]=useState();
    
    const handleMessageChange=(e)=>{
        const {value}=e.target;
        setMessage(value);
    }
    const sendMessage=async()=>{
        try{
            const chatCollectionRef=collection(db,`userChats/${selectedDocId}/chats`);
            const messageData={uid:userInfo.uid,name:userInfo.fullName,message:Message,messageCreatedAt:(new Date()).getTime()}
            await addDoc(chatCollectionRef,messageData);
        }catch(error){
            console.log(error.message);
        }
    }
    return(
        <div className="flex justify-around items-center h-[90%] w-[80%]">
            <p className="text-4xl cursor-pointer">O</p>
            <input type="text" className="h-[70%] w-[80%]" onChange={handleMessageChange}/>
            <p className="text-4xl cursor-pointer" onClick={()=>{sendMessage()}}>{">"}</p>
        </div>
    )
}

export default ChatTextBox;