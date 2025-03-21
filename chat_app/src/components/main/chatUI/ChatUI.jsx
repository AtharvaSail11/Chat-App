import ChatTextBox from "./ChatTextBox"
import { useState,useEffect,useRef } from "react";
import { auth,db } from "../../../firebaseConfig/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection,getDocs,onSnapshot,query,where,doc,addDoc,updateDoc } from "firebase/firestore";
import AddNewChat from "./AddNewChat";
import ProfilePage from "./ProfilePage";
import fileUploadIcon from "./assets/upload_icon.png";
import threeDots from "./assets/Three_Dots_Icon.png";
import userIcon from "./assets/userIcon.png"
import { smartEscape } from "@cloudinary/url-gen/backwards/utils/smartEscape";
import axios from "axios";

const ChatUI=()=>{
    const navigate=useNavigate();
    const [Uid,setUid]=useState();
    const [userChats,setUserChats]=useState([]);
    const [newChatBoxAppear,SetNewChatBoxAppear]=useState(false);
    const [uploadBoxAppear,setUploadBoxAppear]=useState(false);
    const [videoPlayerAppear,setVideoPlayerAppear]=useState(false);
    const [displayProfileSection,setDisplayProfileSection]=useState(false);
    const [userDocs,setUserDocs]=useState();
    const [displayChatUI,setDisplayChatUI]=useState(false);
    const [allUsers,setAllUsers]=useState([]);
    const [docIndex,setDocIndex]=useState();
    const [selectedDocId,setSelectedDocId]=useState();
    const [currentMessages,setCurrentMessages]=useState([]);
    const [displaySettingBox,setDisplaySettingBox]=useState(false);
    const [userInfo,setUserInfo]=useState([]);
    const imgFileRef=useRef();
    const videoFileRef=useRef();



    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,async(user)=>{
            if(user){
                try{
                    const userCollectionRef=collection(db,"Users");
                    const q2=query(userCollectionRef,where("uid","!=",user.uid));
                    const q=query(userCollectionRef,where("uid","==",user.uid));
                    const snapShot=await getDocs(q);
                    const snapShot2=await getDocs(q2);
                    const allUsers=[]
                    if(!snapShot.empty){
                        setUserInfo(snapShot.docs[0].data());
                        setUid(user.uid)
                    }
                    if(!snapShot2.empty){
                        for(const Doc of snapShot2.docs){
                            allUsers.push(Doc.data());
                        }
                    setAllUsers([...allUsers])
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
    },[Uid]);

    const handleImageFileChange=async()=>{
        const File=imgFileRef.current.files[0];
        console.log("File selected:",File)
        const formData=new FormData();
        formData.append("file",File);
        formData.append("upload_preset","ml_default");
        formData.append("folder","userUploads/images");
        try{
            const response=await axios.post(`https://api.cloudinary.com/v1_1/dsto9qze2/image/upload`,formData);
            const downloadUrl=response.data.secure_url;
            const userChatCollectionRef=collection(db,"userChats");
            const docRef=doc(userChatCollectionRef,selectedDocId)
            const chatCollectionRef=collection(db,`userChats/${selectedDocId}/chats`);
            const messageData={uid:userInfo.uid,messageType:"image",name:userInfo.fullName,imageLink:downloadUrl,messageCreatedAt:(new Date()).getTime()}
            await addDoc(chatCollectionRef,messageData);
            await updateDoc(docRef,{latestMessage:{messageBy:userInfo.uid,message:"Image"}});
            setUploadBoxAppear(false);
        }catch(error){
            console.log(error);
        }
        
    }

    const handleVideoFileChange=async()=>{
        const File=videoFileRef.current.files[0];
        console.log("File selected:",File)
        const formData=new FormData();
        formData.append("file",File);
        formData.append("upload_preset","ml_default");
        formData.append("folder","userUploads/videos");
        try{
            
            const response=await axios.post("https://api.cloudinary.com/v1_1/dsto9qze2/video/upload",formData);
            const downloadUrl=response.data.secure_url;
            const userChatCollectionRef=collection(db,"userChats");
            const docRef=doc(userChatCollectionRef,selectedDocId)
            const chatCollectionRef=collection(db,`userChats/${selectedDocId}/chats`);
            const messageData={uid:userInfo.uid,messageType:"video",name:userInfo.fullName,videoLink:downloadUrl,messageCreatedAt:(new Date()).getTime()}
            await addDoc(chatCollectionRef,messageData);
            await updateDoc(docRef,{latestMessage:{messageBy:userInfo.uid,message:"Video"}});
            setUploadBoxAppear(false);
        }catch(error){
            console.log(error);
        }
        
    }

    const getUserChats=()=>{
            const userChatCollectionRef=collection(db,"userChats");
            const q=query(userChatCollectionRef,where("UserIds","array-contains-any",[Uid]))
            const chatsWithProfiles=[]
            const unsubscribe=onSnapshot(q,(querySnapshot)=>{
                setUserDocs(querySnapshot.docs);
                for(const chat of querySnapshot.docs){
                    const chatUid=chat.data()?.UserIds[0]===Uid?chat.data()?.UserIds[1]:chat.data()?.UserIds[0];
                    const chatData=allUsers.filter((item)=>item.uid === chatUid);
                    const chatWithProfile={
                        ...chat.data(),profileImage:chatData[0].profileImage,docId:chat.id
                    }
                    chatsWithProfiles.push(chatWithProfile);
                }
                setUserChats((prevData)=>{
                    const hashMap=new Map();
    
                    prevData.forEach((item)=>hashMap.set(item.docId,item));
                    chatsWithProfiles.forEach((item)=>hashMap.set(item.docId,item));
    
                    return Array.from(hashMap.values());
                });
            })

        return unsubscribe;
    }

    const handleDocSelection=async(index)=>{
        setDisplayChatUI(true);
        const userDoc=userDocs[index];
        const docId=userDoc.id;
        console.log("The docId is:",docId)
        setDocIndex(index);
        setSelectedDocId(docId);
        try{
            const chatCollectionRef=collection(db,`userChats/${docId}/chats`);
            const unsubscribe=onSnapshot(chatCollectionRef,(chatSnapshot)=>{
            setCurrentMessages(chatSnapshot.docs);
            })
    
            return unsubscribe;
        }catch(error){
            console.log(error)
        }
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
        <div className="flex h-screen w-screen bg-blue-100">
            {/* Chats Display */}
            <div className="flex flex-col h-full w-[35%]">
                {/* Header */}
                <div className="flex h-[10%] w-full justify-between p-2 items-center bg-blue-400">
                   <p className="text-3xl">Chats</p>

                   <div className="flex p-2">
                   <p className="text-3xl mr-4 cursor-pointer" onClick={()=>SetNewChatBoxAppear(true)}>+</p>

                    <div id="dropDown" className="flex relative">
                    <img src={threeDots} alt="three dots" style={{width:"35px",cursor:"pointer"}} onClick={()=>{setDisplaySettingBox(true)}}/>
                    {(displaySettingBox&&<div className="flex absolute flex-col z-[10] bg-white h-max w-[150px] top-[35px] right-[10px] shadow-lg">
                        <div className="flex p-2 cursor-pointer hover:bg-gray-100" onClick={()=>{setDisplayProfileSection(true);setDisplaySettingBox(false)}}><p>Profile</p></div>
                        <div className="flex p-2 cursor-pointer hover:bg-gray-100" onClick={handleLogOut}><p>Log out</p></div>
                        <div className="flex p-2 cursor-pointer hover:bg-gray-100" onClick={()=>{setDisplaySettingBox(false)}}><p>Exit</p></div>
                    </div>)}
                    
                    </div>
                   
                   </div>
                  
                </div>
                {/* Display the chats here */}
                {newChatBoxAppear?<AddNewChat SetNewChatBoxAppear={SetNewChatBoxAppear} userInfo={userInfo}/>:displayProfileSection?<ProfilePage setDisplayProfileSection={setDisplayProfileSection} Uid={Uid}/>:<div className="flex flex-col h-[90%] w-full bg-slate-300">
                {/* Chats */}
                {userChats.map((item,index)=>{
                    return(<div className="flex w-full h-16 border-b items-center p-2 border-gray-700 cursor-pointer hover:bg-slate-400" key={index} onClick={()=>{handleDocSelection(index)}}>
                        <div className="flex h-[50px] w-[50px] rounded-full overflow-hidden"><img src={item.profileImage?item.profileImage:userIcon} /></div>
                        <div className="flex flex-col ml-8">
                            <p className="text-xl">{item.UserIds[0]===Uid?item.user2:item.user1}</p>
                            {item.latestMessage?item.latestMessage.messageBy === Uid?<p className="text-base text-green-700">{item.latestMessage.message}</p>:<p className="text-base">{item.latestMessage.message}</p>:""}
                        </div>
                        
                    </div>)
                })}
                

                </div>}
                
            </div>
            {/* Chatting section */}
            {displayChatUI?(<div className="flex flex-col h-full w-[65%]">
                {/* Header */}
                <div className="flex items-center h-[8%] w-full bg-blue-400">
                    <div className="flex h-[48px] w-[48px] rounded-full overflow-hidden"><img src={userChats[docIndex].profileImage?userChats[docIndex]?.profileImage:userIcon}/></div>
                    <p className="text-xl ml-8">{userChats[docIndex].UserIds[0]===Uid?userChats[docIndex].user2:userChats[docIndex].user1}</p>
                </div>
                <div className="flex flex-col w-full h-[92%] border-b p-2 bg-blue-100">
                   
                   <div className="flex flex-col h-[90%] w-full overflow-y-scroll">
                    
                    {currentMessages.sort((a,b)=>a.data().messageCreatedAt-b.data().messageCreatedAt).map((userMessage,index)=>{
                        if((userMessage.data()).messageType==="text"){
                            return(
                                <>
                                    {(userMessage.data()).uid===Uid?<div className="flex justify-end h-[60px] w-full mb-5">
                                <div className="flex h-max text-lg w-[40%] rounded-lg bg-blue-400 p-2"><p>{(userMessage.data()).message}</p></div>
                                    </div>:<div className="flex h-[60px] w-full mb-5">
                                        <div className="flex h-max text-lg w-[40%] rounded-lg bg-slate-300 p-2"><p>{(userMessage.data()).message}</p></div>
                                    </div>}
                                </>
                                )
                        }else if((userMessage.data()).messageType==="image"){
                            return(
                                <>
                                {(userMessage.data()).uid===Uid?<div className="flex justify-end h-[300px] w-full mb-5">
                            <div className="flex justify-center items-center h-max w-max max-h-[full] rounded-lg bg-blue-400 p-2"><img className="h-max w-max" src={userMessage.data().imageLink} alt="" /></div>
                                </div>:<div className="flex h-[300px] w-full mb-5">
                                    <div className="flex justify-center items-center h-max w-max rounded-lg bg-slate-300 p-2"><img className="h-max w-max" src={userMessage.data().imageLink} alt="" /></div>
                                </div>}
                            </>
                            )
                        }else if((userMessage.data()).messageType==="video"){
                            return(
                                <div className="flex relative">
                                {(userMessage.data()).uid===Uid?<div className="flex justify-end h-[50px] w-full mb-5">
                            <div className="flex justify-center items-center h-max w-max max-h-[full] rounded-lg cursor-pointer bg-blue-400 p-2" onClick={()=>setVideoPlayerAppear(true)}><p>Video</p></div>
                                </div>:<div className="flex h-[50px] w-full mb-5">
                                    <div className="flex justify-center items-center h-max w-max rounded-lg cursor-pointer bg-slate-300 p-2" onClick={()=>setVideoPlayerAppear(true)}><p>Video</p></div>
                                </div>}
                                    {
                                        videoPlayerAppear?(<div className="flex flex-col absolute bottom-[100px] left-[250px] h-max w-[400px]">
                                            <p className="cursor-pointer" onClick={()=>setVideoPlayerAppear(false)}>X</p>
                                            <video width="500" controls src={userMessage.data().videoLink} type="video/mp4"></video>
                                        </div>):""
                                    }
                            </div>
                            )
                        }
                       
                    })}
                        
                   </div>
                   <div className="flex items-center h-[10%] w-full bg-blue-200">
                    <div className="flex relative">
                        <img className="cursor-pointer" src={fileUploadIcon} alt="upload" style={{marginLeft:"20px"}} onClick={()=>{setUploadBoxAppear(true)}}/>
                        {
                            uploadBoxAppear?(<div className="flex h-[150px] w-[100px] absolute flex-col bg-white bottom-10 left-10">
                                <div className="flex p-2 hover:bg-gray-200"><label className="cursor-pointer" htmlFor="imgUpload"><p>Image</p></label><input type="file" ref={imgFileRef} name="imgUpload" id="imgUpload" hidden onChange={handleImageFileChange}></input></div>
                                <div className="flex p-2 cursor-pointer hover:bg-gray-200"><label className="cursor-pointer" htmlFor="videoUpload"><p>Video</p></label><input type="file" ref={videoFileRef} name="videoUpload" id="videoUpload" hidden onChange={handleVideoFileChange}></input></div>
                                <div className="flex p-2 cursor-pointer hover:bg-gray-200" onClick={()=>setUploadBoxAppear(false)}><p>Exit</p></div>
                            </div>):""
                        }
                        
                    </div>
                        
                        <ChatTextBox selectedDocId={selectedDocId} userInfo={userInfo}/>
                   </div>
                </div>
            </div>):""}
            
        </div>
    )
}

export default ChatUI;