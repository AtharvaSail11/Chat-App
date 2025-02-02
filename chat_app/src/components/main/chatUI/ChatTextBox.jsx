import { useState } from "react";
import { db } from "../../../firebaseConfig/firebase";
import { collection,addDoc,updateDoc,doc } from "firebase/firestore";
import sendIcon from "./assets/proicons_send.png";
import emojiIcon from "./assets/Vector.png"
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data"


const ChatTextBox=({selectedDocId,userInfo})=>{
    const [Message,setMessage]=useState("");
    const [displayEmojiPicker,setDisplayEmojiPicker]=useState(false)
    
    const handleMessageChange=(e)=>{
        const {value}=e.target;
        setMessage(value);
    }

    const handleEmoji=(emojiData)=>{
        setMessage((prevData)=>prevData+emojiData.native)
    }

    const sendMessage=async()=>{
        try{
            const userChatCollectionRef=collection(db,"userChats");
            const docRef=doc(userChatCollectionRef,selectedDocId)
            const chatCollectionRef=collection(db,`userChats/${selectedDocId}/chats`);
            const messageData={uid:userInfo.uid,name:userInfo.fullName,message:Message,messageCreatedAt:(new Date()).getTime()}
            await addDoc(chatCollectionRef,messageData);
            await updateDoc(docRef,{latestMessage:{messageBy:userInfo.uid,message:Message}});
            setMessage("");
        }catch(error){
            console.log(error.message);
        }
    }
    return(
        <div className="flex justify-around items-center h-[90%] w-[80%]">
            <img className="cursor-pointer" src={emojiIcon} alt="O" onClick={()=>{setDisplayEmojiPicker(true)}}/>
            <input type="text" value={Message} className="h-[70%] w-[80%]" onChange={handleMessageChange}/>
            <img style={{height:"30px",width:"30px",cursor:"pointer"}} src={sendIcon} alt=">"  onClick={()=>{sendMessage()}} />
            {displayEmojiPicker?<div className="absolute h-max w-max z-10 bottom-[65px] right-[530px]">
            <p className="text-2xl cursor-pointer" onClick={()=>{setDisplayEmojiPicker(false)}}>X</p>
            <EmojiPicker data={data} onEmojiSelect={(emoji)=>{handleEmoji(emoji)}}/>
            </div>:""}
        </div>
    )
}

export default ChatTextBox;