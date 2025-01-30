import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../../../firebaseConfig/firebase";
import { useNavigate } from "react-router-dom";
import { collection,addDoc,getDocs,query,where } from "firebase/firestore";

const AddNewChat = ({userInfo,SetNewChatBoxAppear}) => {
    const [UserData,setUserData]=useState([]);
    const getUserData=async()=>{
        const userCollection=collection(db,"Users");
        const q=query(userCollection,where("uid","!=",userInfo.uid))
        const querySnapshot=await getDocs(q);
        setUserData(querySnapshot.docs)
    }

    useEffect(()=>{
        getUserData();
    },[])
    

    const addChat=async(User)=>{
        const data={
        UserIds:[userInfo.uid,User.uid],
        user1:userInfo.fullName,
        user2:User.fullName,
        createdAt:new Date()
    }
    try{
        const collectionRef=collection(db,"userChats");
        const addedDoc=await addDoc(collectionRef,data);
        console.log(addedDoc.id);
        const chatCollectionRef=collection(db,`userChats/${addedDoc.id}/chats`);
        const messageData={uid:userInfo.uid,name:userInfo.fullName,message:"Hi",messageCreatedAt:new Date()}
        await addDoc(chatCollectionRef,messageData);
        await updateDoc(addedDoc,{lastMessageTime:new Date()})
    }catch(error){
        console.log(error.message);
    }
    }


    const navigate=useNavigate();
    return (
        <div className="flex flex-col h-full w-full border-2 border-black bg-slate-300">
            <p className="text-3xl cursor-pointer" onClick={()=>{SetNewChatBoxAppear(false)}}>{"<"}</p>
            {UserData.map((User,index)=>{
                return(<div className="flex w-full h-16 border-b items-center p-2 border-gray-700 cursor-pointer hover:bg-slate-400" key={index} onClick={()=>addChat(User.data())}>
                    <div className="flex h-14 w-14 rounded-full border-2 border-black"></div>
                    <div className="flex flex-col ml-8">
                        <p className="text-xl">{(User.data()).fullName}</p>
                    </div>
                </div>)
            })}
            
        </div>
    )
}

export default AddNewChat;