import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../../../firebaseConfig/firebase";
import { useNavigate } from "react-router-dom";
import { collection,addDoc,getDocs,query,where } from "firebase/firestore";




const AddNewChat = ({userInfo,SetNewChatBoxAppear}) => {
    const [UserData,setUserData]=useState([]);
    const [selectedUser,setSelectedUser]=useState();
    const getUserData=async()=>{
        const userCollection=collection(db,"Users");
        const q=query(userCollection,where("uid","!=",userInfo.uid))
        const querySnapshot=await getDocs(userCollection);
        setUserData(querySnapshot.docs)
    }

    useEffect(()=>{
        getUserData();
    },[])
    
    useEffect(()=>{
        console.log("New user data:",UserData);
    },[UserData])

    const addChat=()=>{
        const userData=selectedUser.data();
        const data={
            user1:{
            name:userInfo.fullName,
            uid:userInfo.uid
        },
        user2:{
            name:userData?.fullName,
            uid:userData?.uid
        }
    }
    console.log("Data:",data);
    }
    
    useEffect(()=>{
        addChat();
    },[selectedUser])


    const navigate=useNavigate();
    return (
        <div className="flex flex-col h-full w-full border-2 border-black bg-slate-300">
            <p className="text-3xl cursor-pointer" onClick={()=>{SetNewChatBoxAppear(false)}}>{"<"}</p>
            {UserData.map((User,index)=>{
                return(<div className="flex w-full h-16 border-b items-center p-2 border-gray-700 cursor-pointer hover:bg-slate-400" key={index}>
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