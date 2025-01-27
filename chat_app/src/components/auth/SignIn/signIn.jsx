import {useState,useEffect} from "react"
import { auth,db } from "../../../firebaseConfig/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { collection,addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const SignIn=()=>{
    const navigate=useNavigate();
    const [signInData,setSignInData]=useState({
        email:"",
        fullName:"",
        password:"",
        confirmPassword:""
    })

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setSignInData((prevData)=>({...prevData,[name]:value}))
    }


    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const userCredentials=await createUserWithEmailAndPassword(auth,signInData.email,signInData.password);
            const user=userCredentials.user;
            const collectionRef=collection(db,"Users");
            const data={uid:user.uid,email:signInData.email,fullName:signInData.fullName,createdAt:new Date()};
            const addedDoc=await addDoc(collectionRef,data);
            navigate("/ChatUI");
            console.log("added doc",addedDoc);
        }catch(error){
            console.log(error);
        }
        
        
    }
    return(
        <div className="flex justify-center items-center h-full w-full">
           <div className="flex flex-col items-center h-[400px] w-[300px] border-2 bg-blue-200 rounded-[30px]">
            <div className="flex justify-center items-center h-[20%] w-full mb-5">
                <p className="text-[40px] text-blue-500">Sign In</p>
            </div>
            <form className="flex flex-col h-[80%] w-[90%] items-center" onSubmit={handleSubmit}>
                <input 
                    className="h-[40px] w-[75%] rounded-lg mb-2" 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder="Email" 
                    onChange={handleChange}
                    value={signInData.email}
                    required 
                />
                <input 
                    className="h-[40px] w-[75%] rounded-lg mb-2" 
                    type="text" 
                    name="fullName" 
                    id="fullName" 
                    placeholder="Name" 
                    onChange={handleChange}
                    value={signInData.fullName}
                    required
                />
                <input 
                    className="h-[40px] w-[75%] rounded-lg mb-2" 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                    value={signInData.password}
                    required
                />
                <input 
                    className="h-[40px] w-[75%] rounded-lg mb-2" 
                    type="password" 
                    name="confirmPassword" 
                    id="confirmPassword" 
                    placeholder="Confirm Password"
                    onChange={handleChange} 
                    value={signInData.confirmPassword}
                    required
                />
                <button className="w-1/2 h-[30px] bg-blue-500 rounded-md">Submit</button>
            </form>
           </div>
        </div>
    )
}

export default SignIn;