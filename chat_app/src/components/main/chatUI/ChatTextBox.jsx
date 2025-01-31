import { useState } from "react";
import { db } from "../../../firebaseConfig/firebase";
import { collection,addDoc,updateDoc } from "firebase/firestore";
import sendIcon from "./assets/proicons_send.png";
import emojiIcon from "./assets/Vector.png"

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
            <img src={emojiIcon} alt="O"/>
            <input type="text" className="h-[70%] w-[80%]" onChange={handleMessageChange}/>
            <img style={{height:"30px",width:"30px",cursor:"pointer"}} src={sendIcon} alt=">"  onClick={()=>{sendMessage()}} />
        </div>
    )
}

export default ChatTextBox;