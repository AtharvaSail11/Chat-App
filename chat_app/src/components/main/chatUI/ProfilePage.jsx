import { useState,useEffect } from "react";
import BigUserIcon from "./assets/BigUserIcon.png"
import EditIcon from "./assets/editIcon.png";
import { db } from "../../../firebaseConfig/firebase";
import { collection,where,query,updateDoc,getDocs,doc,onSnapshot } from "firebase/firestore";
import axios from "axios";

const ProfilePage=({setDisplayProfileSection,Uid})=>{
    const [editIcon,setEditIcon]=useState(false);
    const [userName,setUserName]=useState();
    const [profileImage,setProfileImage]=useState();

    const getData=()=>{
        const profileRef=collection(db,"Users");
        const q=query(profileRef,where("uid","==",Uid));
        const unsubscribe=onSnapshot(q,(snapshot)=>{
            setUserName(snapshot.docs[0].data().fullName);
            setProfileImage(snapshot.docs[0].data().profileImage);
        })

        return unsubscribe;
    }

    useEffect(()=>{
        getData();
    },[])



    const handleFileChange=async(e)=>{
        const File=e.target.files[0];
        const formData=new FormData();
        formData.append("file",File);
        formData.append("upload_preset","ml_default");
        formData.append("folder","profileImages");
        try{
            const response=await axios.post(`https://api.cloudinary.com/v1_1/dsto9qze2/image/upload`,formData);
            const downloadUrl=response.data.secure_url;
            const userCollectionRef=collection(db,"Users");
            const q=query(userCollectionRef,where("uid","==",Uid));
            const querySnapshot=await getDocs(q);
            if(!querySnapshot.empty){
                const docId=querySnapshot.docs[0].id;
                const docRef=doc(userCollectionRef,docId);
                await updateDoc(docRef,{profileImage:downloadUrl});
            }

        }catch(error){
            console.log(error);
        }
        
    }
    return(
        <div className="flex flex-col items-center border-2 border-black h-full w-full">
            <div className="flex h-max w-full">
                <p className="text-2xl cursor-pointer" onClick={()=>{setDisplayProfileSection(false)}}>{"<"}</p>
            </div>
            <div className="flex justify-center h-max w-full mt-10 mb-5">
                <div className="flex h-[150px] w-[150px] rounded-full border-2 border-black transition-all overflow-hidden" onMouseEnter={()=>{setEditIcon(true)}} onMouseLeave={()=>{setEditIcon(false)}}><img className="shadow-inner hover:shadow-md transition-shadow duration-300" src={profileImage?profileImage:BigUserIcon} />{editIcon?<label htmlFor="fileInput"><img className="absolute z-10 font-bold text-2xl left-[225px] top-[180px] cursor-pointer" src={EditIcon} /></label>:null}<input type="file" id="fileInput" hidden onChange={handleFileChange}/></div>
            </div>
            <div className="flex justify-center h-max w-full">
                <div className="flex text-2xl">{userName}</div>
            </div>
        </div>
    )
}

export default ProfilePage;