import ChatTextBox from "./ChatTextBox"
import { useState,useEffect } from "react";
import { auth,db } from "../../../firebaseConfig/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection,getDocs,onSnapshot,query,where } from "firebase/firestore";
import AddNewChat from "./AddNewChat";

const ChatUI=()=>{
    const navigate=useNavigate();
    const [Uid,setUid]=useState();
    const [userChats,setUserChats]=useState([]);
    const [newChatBoxAppear,SetNewChatBoxAppear]=useState(false);
    const [currentMessages,setCurrentMessages]=useState([])
    const [userInfo,setUserInfo]=useState([]);
    let array=["","","","","",""];
    let myUid="ae012c5";
    let chatMessages=[{createdAt:"1/2/2025 2:25",messageBy:"ae012c5",userName:"Abc",message:"Hello"},{createdAt:"1/2/2025 2:26",messageBy:"b2cm68o",userName:"Def",message:"Hi"},{createdAt:"1/2/2025 2:25",messageBy:"ae012c5",userName:"Abc",message:"How are You!"},{createdAt:"1/2/2025 2:26",messageBy:"b2cm68o",userName:"Def",message:"I am fine"}];
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,async(user)=>{
            if(user){
                try{
                    const userCollectionRef=collection(db,"Users");
                    const q=query(userCollectionRef,where("uid","==",user.uid));
                    const snapShot=await getDocs(q);
                    if(!snapShot.empty){
                        setUserInfo(snapShot.docs[0].data());
                        setUid(user.uid)
                    }
                }catch(error){
                    console.log(error)
                }
                
            }else{
                console.log("User auth does not exist")
            }
        })
        return ()=>unsubscribe();
    },[]);

    useEffect(()=>{
        console.log("uid:",Uid);
        if(Uid){
            getUserChats();
        }
    },[Uid])

    const getUserChats=()=>{
            const userChatCollectionRef=collection(db,"userChats");
            const q=query(userChatCollectionRef,where("UserIds","array-contains-any",[Uid]))
    
            const unsubscribe=onSnapshot(q,(querySnapshot)=>{
                setUserChats(querySnapshot.docs);
            })
        
        return unsubscribe;
    }

    const handleDocSelection=(index)=>{
        const userDoc=userChats[index];
        const docId=userDoc.id;
        console.log("selectedDocId:",docId)
        const chatCollectionRef=collection(db,`userChats/${docId}/chats`);
        const unsubscribe=onSnapshot(chatCollectionRef,(chatSnapshot)=>{
            console.log("current Message Uid:",(chatSnapshot.docs[0].data()).uid)
            console.log("My Uid:",myUid)
            setCurrentMessages(chatSnapshot.docs);
        })

        return unsubscribe;
    }

    const handleLogOut=async()=>{
        try{
            await signOut(auth);
            navigate("/")
        }catch(error){
            console.log(error.message)
        }
    }

    return(
        <div className="flex h-screen w-screen">
            {/* Chats Display */}
            <div className="flex flex-col h-full w-[35%]">
                {/* Header */}
                <div className="flex h-[10%] w-full justify-between p-2 items-center bg-blue-400">
                   <p className="text-3xl">Chats</p>

                   <div className="flex p-2">
                   <p className="text-3xl mr-4 cursor-pointer" onClick={()=>SetNewChatBoxAppear(true)}>+</p>
                   <div className="flex justify-center items-center h-10 w-10 rounded-full border-2 border-black cursor-pointer" onClick={handleLogOut}>
                        <p className="text-sm">{"[<-"}</p>
                   </div>
                   </div>
                   
                </div>
                {/* Display the chats here */}
                {newChatBoxAppear?<AddNewChat SetNewChatBoxAppear={SetNewChatBoxAppear} userInfo={userInfo}/>:<div className="flex flex-col h-[90%] w-full bg-slate-300">
                {/* Chats */}
                {userChats.map((item,index)=>{
                    return(<div className="flex w-full h-16 border-b items-center p-2 border-gray-700 cursor-pointer hover:bg-slate-400" key={index} onClick={()=>{handleDocSelection(index)}}>
                        <div className="flex h-14 w-14 rounded-full border-2 border-black"></div>
                        <div className="flex flex-col ml-8">
                            <p className="text-xl">{item.data().UserIds[0]===Uid?item.data().user2:item.data().user1}</p>
                            <p className="text-base">Message</p>
                        </div>
                        
                    </div>)
                })}
                

                </div>}
                
            </div>
            {/* Chatting section */}
            <div className="flex flex-col h-full w-[65%]">
                {/* Header */}
                <div className="flex items-center h-[8%] w-full bg-blue-400">
                    <div className="flex h-10 w-10 rounded-full border-2 border-black"></div>
                    <p className="text-xl ml-8">User Name</p>
                </div>
                <div className="flex flex-col w-full h-[92%] border-b p-2 bg-blue-100">
                   
                   <div className="flex flex-col h-[90%] w-full">
                    
                    {currentMessages.map((userMessage,index)=>{
                        return(
                        <>
                            {(userMessage.data()).uid===Uid?<div className="flex justify-end h-[60px] w-full">
                        <div className="flex h-max w-[40%] rounded-lg bg-blue-400 p-2"><p>{(userMessage.data()).message}</p></div>
                            </div>:<div className="flex h-[60px] w-full border-2 border-black">
                                <div className="flex h-max w-[40%] rounded-lg bg-slate-300 p-2"><p>{(userMessage.data()).message}</p></div>
                            </div>}
                        </>
                        )
                    })}
                        
                   </div>
                   <div className="flex items-center h-[10%] w-full bg-blue-200">
                        <p className="text-4xl cursor-pointer">+</p> 
                        <ChatTextBox/>
                   </div>
                </div>
            </div>
        </div>
    )
}

export default ChatUI;