import {useState,useEffect} from "react"
import { auth,db } from "../../../firebaseConfig/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { collection,addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const LogIn=()=>{
    const navigate=useNavigate();
    const [signInData,setSignInData]=useState({
        email:"",
        password:"",
    })

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setSignInData((prevData)=>({...prevData,[name]:value}))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const userCredentials=await signInWithEmailAndPassword(auth,signInData.email,signInData.password);
            const user=userCredentials.user;
            if(user){
                navigate("/ChatUI")
            }
            console.log("signed in user:",user.email);
        }catch(error){
            console.log(error);
        }
    }
    return(
        <div className="flex justify-center items-center h-full w-full">
           <div className="flex flex-col items-center h-[400px] w-[300px] border-2 bg-blue-200 rounded-[30px]">
            <div className="flex justify-center items-center h-[20%] w-full mb-5">
                <p className="text-[40px] text-blue-500">Log In</p>
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
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                    value={signInData.password}
                    required
                />

                <p className="text-[12px]">Do you have an account? If not, <span className="text-blue-700"><a href="/SignUp">Sign In here</a></span></p>

                <button className="w-1/2 h-[30px] bg-blue-500 rounded-md">Submit</button>
            </form>
           </div>
        </div>
    )
}

export default LogIn;

