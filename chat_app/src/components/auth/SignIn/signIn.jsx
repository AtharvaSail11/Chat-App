
const SignIn=()=>{
    return(
        <div className="flex justify-center items-center h-full w-full">
           <div className="flex flex-col items-center h-[400px] w-[300px] border-2 bg-blue-200 rounded-[30px]">
            <div className="flex justify-center items-center h-[20%] w-full mb-5">
                <p className="text-[40px] text-blue-500">Sign In</p>
            </div>
            <form className="flex flex-col h-[80%] w-[90%] items-center">
                <input className="h-[40px] w-[75%] rounded-lg mb-2" type="email" name="email" id="email" placeholder="Email" required />
                <input className="h-[40px] w-[75%] rounded-lg mb-2" type="text" name="fullName" id="fullName" placeholder="Name" required/>
                <input className="h-[40px] w-[75%] rounded-lg mb-2" type="password" name="password" id="password" placeholder="Password" required/>
                <input className="h-[40px] w-[75%] rounded-lg mb-2" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required/>
                <button className="w-1/2 h-[30px] bg-blue-500 rounded-md">Submit</button>
            </form>
           </div>
        </div>
    )
}

export default SignIn;