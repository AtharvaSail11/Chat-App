import { useRef, useState,useEffect } from "react";
import { db } from "../../../firebaseConfig/firebase";
import { collection,addDoc,updateDoc,doc } from "firebase/firestore";
import sendIcon from "./assets/proicons_send.png";
import emojiIcon from "./assets/Vector.png"
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data"


const ChatTextBox=({selectedDocId,userInfo})=>{
    const [Message,setMessage]=useState("");
    const emojiBoxRef=useRef(null);
    const emojiButtonRef=useRef(null)
    const [displayEmojiPicker,setDisplayEmojiPicker]=useState(false)
    
    const handleMessageChange=(e)=>{
        const {value}=e.target;
        setMessage(value);
    }

    useEffect(()=>{
        function handleClickOutside(event){
            if(emojiBoxRef.current && !emojiBoxRef.current.contains(event.target) && emojiButtonRef.current!==event.target){
                console.log("currentRef:",event.target);
                setDisplayEmojiPicker(false);
            }
        }

        document.addEventListener("click",handleClickOutside);
        return ()=>document.removeEventListener("click",handleClickOutside);
    },[])

    const handleEmoji=(emojiData)=>{
        setMessage((prevData)=>prevData+emojiData.native);
        setDisplayEmojiPicker(false);
    }

    const sendMessage=async()=>{
        try{
            const userChatCollectionRef=collection(db,"userChats");
            const docRef=doc(userChatCollectionRef,selectedDocId)
            const chatCollectionRef=collection(db,`userChats/${selectedDocId}/chats`);
            const messageData={uid:userInfo.uid,messageType:"text",name:userInfo.fullName,message:Message,messageCreatedAt:(new Date()).getTime()}
            await addDoc(chatCollectionRef,messageData);
            await updateDoc(docRef,{latestMessage:{messageBy:userInfo.uid,message:Message}});
            setMessage("");
        }catch(error){
            console.log(error.message);
        }
    }
    return(
        <div className="flex justify-around items-center h-[90%] w-[80%]">
            <img ref={emojiButtonRef} className="cursor-pointer" src={emojiIcon} alt="O" onClick={()=>{setDisplayEmojiPicker(true)}}/>
            <input type="text" value={Message} className="h-[70%] w-[80%]" onChange={handleMessageChange}/>
            <img style={{height:"30px",width:"30px",cursor:"pointer"}} src={sendIcon} alt=">"  onClick={()=>{sendMessage()}} />
            {displayEmojiPicker?<div ref={emojiBoxRef} className="absolute h-max w-max z-10 bottom-[65px] right-[530px]">
            <EmojiPicker data={data} onEmojiSelect={(emoji)=>{handleEmoji(emoji)}}/>
            </div>:""}
        </div>
    )
}

export default ChatTextBox;